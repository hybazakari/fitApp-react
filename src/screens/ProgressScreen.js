import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Dimensions,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS, COMMON_STYLES } from '../constants/theme';
import { WeightLineChart, CaloriesRingChart } from '../components/MacroCharts';

const { width } = Dimensions.get('window');

const ProgressScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('weight');
  const [refreshing, setRefreshing] = useState(false);
  const [showAddWeightModal, setShowAddWeightModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  
  // Weight data
  const [weightData, setWeightData] = useState([]);
  const [currentWeight, setCurrentWeight] = useState(0);
  const [goalWeight, setGoalWeight] = useState(0);
  const [weightChange, setWeightChange] = useState(0);
  
  // Nutrition data
  const [nutritionAdherence, setNutritionAdherence] = useState([]);
  const [macroStreak, setMacroStreak] = useState(0);
  const [perfectDays, setPerfectDays] = useState(0);
  
  // Workout data
  const [workoutCompletion, setWorkoutCompletion] = useState([]);
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [favoriteExercises, setFavoriteExercises] = useState([]);
  const [totalVolume, setTotalVolume] = useState(0);
  
  // Overall data
  const [progressionHistory, setProgressionHistory] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [appUsageDays, setAppUsageDays] = useState(0);

  useEffect(() => {
    loadAllData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
  };

  const loadAllData = async () => {
    try {
      await loadWeightData();
      await loadNutritionData();
      await loadWorkoutData();
      await loadOverallData();
    } catch (error) {
      console.error('Error loading progress data:', error);
    }
  };

  const loadWeightData = async () => {
    try {
      // Load weight logs
      const logsJson = await AsyncStorage.getItem('@myfit_weight_logs');
      if (logsJson) {
        const logs = JSON.parse(logsJson);
        const sortedLogs = logs.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // Format for chart
        const chartData = sortedLogs.slice(-30).map(log => ({
          date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          weight: log.weight,
        }));
        
        setWeightData(chartData);
        
        if (sortedLogs.length > 0) {
          const latest = sortedLogs[sortedLogs.length - 1];
          setCurrentWeight(latest.weight);
          
          if (sortedLogs.length > 1) {
            const first = sortedLogs[0];
            setWeightChange(latest.weight - first.weight);
          }
        }
      }

      // Load goal weight
      const profileJson = await AsyncStorage.getItem('@myfit_profile');
      if (profileJson) {
        const profile = JSON.parse(profileJson);
        setGoalWeight(profile.goalWeight || 70);
      }
    } catch (error) {
      console.error('Error loading weight data:', error);
    }
  };

  const loadNutritionData = async () => {
    try {
      const today = new Date();
      const adherenceData = [];
      let streak = 0;
      let perfect = 0;
      let foundGap = false;

      const targetsJson = await AsyncStorage.getItem('@myfit_daily_targets');
      const targets = targetsJson ? JSON.parse(targetsJson) : null;

      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];

        const nutritionJson = await AsyncStorage.getItem(`@myfit_nutrition_logs_${dateKey}`);
        
        let status = 'empty';
        if (nutritionJson && targets) {
          const logs = JSON.parse(nutritionJson);
          const totals = logs.reduce(
            (sum, log) => ({
              calories: sum.calories + log.totalNutrition.calories,
              protein: sum.protein + log.totalNutrition.protein,
              carbs: sum.carbs + log.totalNutrition.carbs,
              fats: sum.fats + log.totalNutrition.fats,
            }),
            { calories: 0, protein: 0, carbs: 0, fats: 0 }
          );

          const caloriesOk = Math.abs(totals.calories - targets.calories) / targets.calories <= 0.1;
          const proteinOk = totals.protein >= targets.protein * 0.9;
          const carbsOk = Math.abs(totals.carbs - targets.carbs) / targets.carbs <= 0.15;
          const fatsOk = Math.abs(totals.fats - targets.fats) / targets.fats <= 0.15;

          if (caloriesOk && proteinOk && carbsOk && fatsOk) {
            status = 'perfect';
            perfect++;
            if (!foundGap && i <= 0) streak++;
          } else if (logs.length > 0) {
            status = 'partial';
            foundGap = true;
          } else {
            foundGap = true;
          }
        } else {
          foundGap = true;
        }

        adherenceData.push({
          date: dateKey,
          status,
        });
      }

      setNutritionAdherence(adherenceData);
      setMacroStreak(streak);
      setPerfectDays(perfect);
    } catch (error) {
      console.error('Error loading nutrition data:', error);
    }
  };

  const loadWorkoutData = async () => {
    try {
      const historyJson = await AsyncStorage.getItem('@myfit_workout_history');
      if (historyJson) {
        const history = JSON.parse(historyJson);
        
        // Total workouts
        const total = Object.values(history).flat().length;
        setTotalWorkouts(total);

        // Completion rate (last 30 days)
        const today = new Date();
        const completionData = [];
        let volume = 0;
        const exerciseCounts = {};

        for (let i = 29; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const dateKey = date.toISOString().split('T')[0];

          const dayWorkouts = history[dateKey] || [];
          completionData.push({
            date: dateKey,
            completed: dayWorkouts.length > 0,
            count: dayWorkouts.length,
          });

          // Calculate volume and exercise frequency
          dayWorkouts.forEach(workout => {
            if (workout.exercises) {
              workout.exercises.forEach(exercise => {
                // Count exercise frequency
                exerciseCounts[exercise.name] = (exerciseCounts[exercise.name] || 0) + 1;

                // Calculate volume (sets * reps * weight)
                if (exercise.sets) {
                  exercise.sets.forEach(set => {
                    if (set.completed && set.weight && set.reps) {
                      volume += set.weight * set.reps;
                    }
                  });
                }
              });
            }
          });
        }

        setWorkoutCompletion(completionData);
        setTotalVolume(volume);

        // Top 5 favorite exercises
        const sorted = Object.entries(exerciseCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, count]) => ({ name, count }));
        setFavoriteExercises(sorted);
      }
    } catch (error) {
      console.error('Error loading workout data:', error);
    }
  };

  const loadOverallData = async () => {
    try {
      // Load progression score history (last 30 days)
      const today = new Date();
      const scoreHistory = [];

      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];

        // Calculate daily score
        const nutritionJson = await AsyncStorage.getItem(`@myfit_nutrition_logs_${dateKey}`);
        const historyJson = await AsyncStorage.getItem('@myfit_workout_history');
        
        let nutritionScore = 0;
        let workoutScore = 0;

        if (nutritionJson) {
          const targetsJson = await AsyncStorage.getItem('@myfit_daily_targets');
          const targets = targetsJson ? JSON.parse(targetsJson) : null;

          if (targets) {
            const logs = JSON.parse(nutritionJson);
            const totals = logs.reduce(
              (sum, log) => ({
                calories: sum.calories + log.totalNutrition.calories,
                protein: sum.protein + log.totalNutrition.protein,
              }),
              { calories: 0, protein: 0 }
            );

            const caloriesOk = Math.abs(totals.calories - targets.calories) / targets.calories <= 0.1;
            const proteinOk = totals.protein >= targets.protein * 0.9;
            
            if (caloriesOk && proteinOk) nutritionScore = 50;
          }
        }

        if (historyJson) {
          const history = JSON.parse(historyJson);
          if (history[dateKey] && history[dateKey].length > 0) {
            workoutScore = 50;
          }
        }

        scoreHistory.push({
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          score: nutritionScore + workoutScore,
        });
      }

      setProgressionHistory(scoreHistory);

      // Load achievements
      const achievementsJson = await AsyncStorage.getItem('@myfit_achievements');
      if (achievementsJson) {
        setAchievements(JSON.parse(achievementsJson));
      }

      // Load streak
      const streakJson = await AsyncStorage.getItem('@myfit_streak');
      if (streakJson) {
        setCurrentStreak(parseInt(streakJson));
      }

      // Calculate app usage days (days with any activity)
      let usageDays = 0;
      for (let i = 0; i < 90; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];

        const nutritionJson = await AsyncStorage.getItem(`@myfit_nutrition_logs_${dateKey}`);
        const historyJson = await AsyncStorage.getItem('@myfit_workout_history');
        const history = historyJson ? JSON.parse(historyJson) : {};

        if (nutritionJson || (history[dateKey] && history[dateKey].length > 0)) {
          usageDays++;
        }
      }
      setAppUsageDays(usageDays);
    } catch (error) {
      console.error('Error loading overall data:', error);
    }
  };

  const handleAddWeight = async () => {
    try {
      const weight = parseFloat(newWeight);
      if (isNaN(weight) || weight <= 0) {
        alert('Please enter a valid weight');
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      
      // Load existing logs
      const logsJson = await AsyncStorage.getItem('@myfit_weight_logs');
      const logs = logsJson ? JSON.parse(logsJson) : [];

      // Add new log
      logs.push({
        date: today,
        weight,
        timestamp: new Date().toISOString(),
      });

      // Save
      await AsyncStorage.setItem('@myfit_weight_logs', JSON.stringify(logs));

      // Update profile
      const profileJson = await AsyncStorage.getItem('@myfit_profile');
      if (profileJson) {
        const profile = JSON.parse(profileJson);
        profile.weight = weight;
        await AsyncStorage.setItem('@myfit_profile', JSON.stringify(profile));
      }

      setShowAddWeightModal(false);
      setNewWeight('');
      await loadWeightData();
    } catch (error) {
      console.error('Error adding weight:', error);
    }
  };

  const renderWeightTab = () => {
    const daysToGoal = Math.abs((currentWeight - goalWeight) / 0.5).toFixed(0); // Assuming 0.5 kg/week
    
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.tabContent}>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{currentWeight.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Current (kg)</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{goalWeight.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Goal (kg)</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: weightChange < 0 ? COLORS.success : COLORS.warning }]}>
                {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)}
              </Text>
              <Text style={styles.statLabel}>Change (kg)</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.addButton} onPress={() => setShowAddWeightModal(true)}>
            <Text style={styles.addButtonText}>+ Add Weight Entry</Text>
          </TouchableOpacity>

          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Weight Progress (Last 30 Days)</Text>
            {weightData.length > 0 ? (
              <WeightLineChart weightData={weightData} />
            ) : (
              <Text style={styles.emptyText}>No weight data yet. Add your first entry!</Text>
            )}
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>📊 Progress Insights</Text>
            <Text style={styles.infoText}>
              • Current pace: {(weightChange / (weightData.length / 7)).toFixed(1)} kg/week
            </Text>
            <Text style={styles.infoText}>
              • Estimated days to goal: {daysToGoal} days
            </Text>
            <Text style={styles.infoText}>
              • Total entries: {weightData.length}
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderNutritionTab = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.tabContent}>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{perfectDays}</Text>
              <Text style={styles.statLabel}>Perfect Days</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{macroStreak}</Text>
              <Text style={styles.statLabel}>Current Streak</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{((perfectDays / 30) * 100).toFixed(0)}%</Text>
              <Text style={styles.statLabel}>Adherence</Text>
            </View>
          </View>

          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>30-Day Nutrition Calendar</Text>
            <View style={styles.calendarGrid}>
              {nutritionAdherence.map((day, index) => (
                <View
                  key={index}
                  style={[
                    styles.calendarDay,
                    day.status === 'perfect' && styles.calendarDayPerfect,
                    day.status === 'partial' && styles.calendarDayPartial,
                    day.status === 'empty' && styles.calendarDayEmpty,
                  ]}
                >
                  <Text style={styles.calendarDayText}>{index + 1}</Text>
                </View>
              ))}
            </View>
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: COLORS.success }]} />
                <Text style={styles.legendText}>Perfect</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: COLORS.warning }]} />
                <Text style={styles.legendText}>Partial</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: COLORS.cardBackground }]} />
                <Text style={styles.legendText}>No Data</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>💡 Nutrition Tips</Text>
            <Text style={styles.infoText}>
              • Perfect Day = Within 10% of calorie target + hit all macros
            </Text>
            <Text style={styles.infoText}>
              • Current adherence: {((perfectDays / 30) * 100).toFixed(0)}%
            </Text>
            <Text style={styles.infoText}>
              • {perfectDays >= 21 ? 'Excellent! You\'re crushing it! 🔥' : perfectDays >= 15 ? 'Great work! Keep it up! 💪' : 'Keep logging meals to improve adherence 📈'}
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderWorkoutTab = () => {
    const completionRate = (workoutCompletion.filter(d => d.completed).length / 30) * 100;
    
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.tabContent}>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{totalWorkouts}</Text>
              <Text style={styles.statLabel}>Total Workouts</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{completionRate.toFixed(0)}%</Text>
              <Text style={styles.statLabel}>Completion Rate</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{(totalVolume / 1000).toFixed(1)}k</Text>
              <Text style={styles.statLabel}>Total Volume (kg)</Text>
            </View>
          </View>

          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Workout Frequency (Last 30 Days)</Text>
            <View style={styles.frequencyGrid}>
              {workoutCompletion.map((day, index) => (
                <View
                  key={index}
                  style={[
                    styles.frequencyDay,
                    day.completed && styles.frequencyDayActive,
                  ]}
                >
                  <Text style={[styles.frequencyDayText, day.completed && styles.frequencyDayTextActive]}>
                    {day.count || ''}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Top 5 Exercises</Text>
            {favoriteExercises.length > 0 ? (
              favoriteExercises.map((exercise, index) => (
                <View key={index} style={styles.exerciseRow}>
                  <Text style={styles.exerciseRank}>#{index + 1}</Text>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exerciseCount}>{exercise.count}x</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No workout data yet. Start your first workout!</Text>
            )}
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>💪 Workout Insights</Text>
            <Text style={styles.infoText}>
              • Completion rate: {completionRate.toFixed(0)}% (last 30 days)
            </Text>
            <Text style={styles.infoText}>
              • Average workouts per week: {(workoutCompletion.filter(d => d.completed).length / 4.3).toFixed(1)}
            </Text>
            <Text style={styles.infoText}>
              • {completionRate >= 80 ? 'Outstanding consistency! 🏆' : completionRate >= 60 ? 'Great work! Keep going! 💪' : 'Let\'s boost that workout frequency! 📈'}
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderOverallTab = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.tabContent}>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{currentStreak}</Text>
              <Text style={styles.statLabel}>Current Streak</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{achievements.length}</Text>
              <Text style={styles.statLabel}>Achievements</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{appUsageDays}</Text>
              <Text style={styles.statLabel}>Active Days</Text>
            </View>
          </View>

          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Progression Score History</Text>
            {progressionHistory.length > 0 && (
              <View style={styles.scoreChart}>
                {progressionHistory.map((day, index) => (
                  <View key={index} style={styles.scoreBar}>
                    <View
                      style={[
                        styles.scoreBarFill,
                        {
                          height: `${day.score}%`,
                          backgroundColor:
                            day.score >= 85
                              ? COLORS.success
                              : day.score >= 50
                              ? COLORS.warning
                              : COLORS.error,
                        },
                      ]}
                    />
                  </View>
                ))}
              </View>
            )}
            <Text style={styles.chartSubtitle}>Last 30 days • Target: 85%</Text>
          </View>

          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Unlocked Achievements ({achievements.length}/6)</Text>
            {achievements.length > 0 ? (
              <View style={styles.achievementsList}>
                {achievements.map((achievementId, index) => (
                  <View key={index} style={styles.achievementItem}>
                    <Text style={styles.achievementEmoji}>✅</Text>
                    <Text style={styles.achievementText}>{achievementId.replace('_', ' ').toUpperCase()}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.emptyText}>Keep working to unlock achievements!</Text>
            )}
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>📊 Overall Statistics</Text>
            <Text style={styles.infoText}>
              • Active days (last 90 days): {appUsageDays}
            </Text>
            <Text style={styles.infoText}>
              • Current streak: {currentStreak} days {currentStreak >= 7 ? '🔥' : ''}
            </Text>
            <Text style={styles.infoText}>
              • Achievements unlocked: {achievements.length}/6
            </Text>
            <Text style={styles.infoText}>
              • Total workouts completed: {totalWorkouts}
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'weight':
        return renderWeightTab();
      case 'nutrition':
        return renderNutritionTab();
      case 'workout':
        return renderWorkoutTab();
      case 'overall':
        return renderOverallTab();
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Progress</Text>
          <Text style={styles.headerSubtitle}>Track your fitness journey</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'weight' && styles.tabActive]}
          onPress={() => setActiveTab('weight')}
        >
          <Text style={[styles.tabText, activeTab === 'weight' && styles.tabTextActive]}>
            Weight
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'nutrition' && styles.tabActive]}
          onPress={() => setActiveTab('nutrition')}
        >
          <Text style={[styles.tabText, activeTab === 'nutrition' && styles.tabTextActive]}>
            Nutrition
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'workout' && styles.tabActive]}
          onPress={() => setActiveTab('workout')}
        >
          <Text style={[styles.tabText, activeTab === 'workout' && styles.tabTextActive]}>
            Workout
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'overall' && styles.tabActive]}
          onPress={() => setActiveTab('overall')}
        >
          <Text style={[styles.tabText, activeTab === 'overall' && styles.tabTextActive]}>
            Overall
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Add Weight Modal */}
      <Modal
        visible={showAddWeightModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddWeightModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Weight Entry</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter weight (kg)"
              keyboardType="numeric"
              value={newWeight}
              onChangeText={setNewWeight}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={() => {
                  setShowAddWeightModal(false);
                  setNewWeight('');
                }}
              >
                <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleAddWeight}
              >
                <Text style={styles.modalButtonTextPrimary}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...COMMON_STYLES.container,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },

  headerTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.weights.bold,
  },

  headerSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },

  headerRight: {
    width: 40,
  },

  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },

  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
  },

  tabActive: {
    backgroundColor: COLORS.primary,
  },

  tabText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.weights.semiBold,
  },

  tabTextActive: {
    color: COLORS.buttonText,
  },

  tabContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },

  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },

  statBox: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.small,
  },

  statValue: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.weights.bold,
  },

  statLabel: {
    ...TYPOGRAPHY.tiny,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },

  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },

  addButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.buttonText,
    fontWeight: TYPOGRAPHY.weights.semiBold,
  },

  chartCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },

  chartTitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.weights.semiBold,
    marginBottom: SPACING.md,
  },

  chartSubtitle: {
    ...TYPOGRAPHY.tiny,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },

  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingVertical: SPACING.xl,
  },

  infoCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },

  infoTitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.weights.semiBold,
    marginBottom: SPACING.sm,
  },

  infoText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },

  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },

  calendarDay: {
    width: (width - SPACING.lg * 2 - SPACING.lg * 2 - 4 * 9) / 10,
    aspectRatio: 1,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },

  calendarDayPerfect: {
    backgroundColor: COLORS.success,
  },

  calendarDayPartial: {
    backgroundColor: COLORS.warning,
  },

  calendarDayEmpty: {
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  calendarDayText: {
    ...TYPOGRAPHY.tiny,
    color: COLORS.buttonText,
  },

  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },

  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  legendText: {
    ...TYPOGRAPHY.tiny,
    color: COLORS.textSecondary,
  },

  frequencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },

  frequencyDay: {
    width: (width - SPACING.lg * 2 - SPACING.lg * 2 - 4 * 9) / 10,
    aspectRatio: 1,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  frequencyDayActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  frequencyDayText: {
    ...TYPOGRAPHY.tiny,
    color: COLORS.textSecondary,
  },

  frequencyDayTextActive: {
    color: COLORS.buttonText,
    fontWeight: TYPOGRAPHY.weights.bold,
  },

  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  exerciseRank: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.weights.bold,
    width: 40,
  },

  exerciseName: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    flex: 1,
  },

  exerciseCount: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.weights.semiBold,
  },

  scoreChart: {
    flexDirection: 'row',
    height: 150,
    gap: 2,
    alignItems: 'flex-end',
  },

  scoreBar: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
  },

  scoreBarFill: {
    width: '100%',
    borderRadius: 2,
  },

  achievementsList: {
    gap: SPACING.sm,
  },

  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },

  achievementEmoji: {
    fontSize: 24,
    marginRight: SPACING.sm,
  },

  achievementText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.weights.semiBold,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },

  modalContent: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 400,
  },

  modalTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.weights.bold,
    marginBottom: SPACING.lg,
  },

  input: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },

  modalButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },

  modalButton: {
    flex: 1,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
  },

  modalButtonPrimary: {
    backgroundColor: COLORS.primary,
  },

  modalButtonSecondary: {
    backgroundColor: COLORS.cardBackground,
  },

  modalButtonTextPrimary: {
    ...TYPOGRAPHY.body,
    color: COLORS.buttonText,
    fontWeight: TYPOGRAPHY.weights.semiBold,
  },

  modalButtonTextSecondary: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.weights.semiBold,
  },
});

export default ProgressScreen;
