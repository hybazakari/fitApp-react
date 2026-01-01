import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Dimensions,
  Alert,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, COMMON_STYLES, SHADOWS } from '../constants/theme';
import StatCard from '../components/StatCard';
import { CaloriesRingChart, MacroPieChart, WeightLineChart, MiniProgressBar } from '../components/MacroCharts';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.lg * 3) / 2;

// Achievement definitions
const ACHIEVEMENTS = [
  { id: 'first_workout', name: 'First Steps', emoji: '🎯', description: 'Complete your first workout', requirement: { type: 'workouts_total', value: 1 } },
  { id: 'week_streak', name: '7-Day Warrior', emoji: '🔥', description: 'Maintain a 7-day streak', requirement: { type: 'streak_days', value: 7 } },
  { id: 'macro_master', name: 'Macro Master', emoji: '🎖️', description: 'Hit all macros for 7 days', requirement: { type: 'macro_perfect_days', value: 7 } },
  { id: 'workout_warrior', name: 'Workout Warrior', emoji: '💪', description: 'Complete 30 workouts', requirement: { type: 'workouts_total', value: 30 } },
  { id: 'month_streak', name: 'Month Master', emoji: '🏆', description: 'Maintain a 30-day streak', requirement: { type: 'streak_days', value: 30 } },
  { id: 'goal_crusher', name: 'Goal Crusher', emoji: '⭐', description: 'Maintain 85%+ score for 30 days', requirement: { type: 'high_score_days', value: 30 } },
];

const DashboardScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState({
    calories: { consumed: 1850, target: 2200, remaining: 350 },
    protein: { consumed: 120, target: 150, remaining: 30 },
    carbs: { consumed: 180, target: 220, remaining: 40 },
    fats: { consumed: 55, target: 70, remaining: 15 },
    water: { consumed: 6, target: 8 },
    workouts: { completed: 3, thisWeek: 5 },
    weight: { current: 75.5, change: -0.5 },
    steps: { count: 8234, target: 10000 },
  });

  const [userName, setUserName] = useState('User');
  const [progressionScore, setProgressionScore] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [showScoreModal, setShowScoreModal] = useState(false);


  useEffect(() => {
    loadDashboardData();
  }, []);

  const checkAchievements = async () => {
    try {
      const historyJson = await AsyncStorage.getItem('@myfit_workout_history');
      const history = historyJson ? JSON.parse(historyJson) : {};
      
      const totalWorkouts = Object.values(history).flat().length;
      
      // Count perfect macro days (last 30 days)
      let macroPerfectDays = 0;
      let highScoreDays = 0;
      const today = new Date();
      const targetsJson = await AsyncStorage.getItem('@myfit_daily_targets');
      const targets = targetsJson ? JSON.parse(targetsJson) : null;

      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];

        const nutritionJson = await AsyncStorage.getItem(`@myfit_nutrition_logs_${dateKey}`);
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
            macroPerfectDays++;
          }

          // Check if score >= 85
          const dayScore = (caloriesOk && proteinOk ? 50 : 0) + (history[dateKey] ? 50 : 0);
          if (dayScore >= 85) {
            highScoreDays++;
          }
        }
      }

      const unlockedAchievements = [];
      const stats = {
        workouts_total: totalWorkouts,
        streak_days: currentStreak,
        macro_perfect_days: macroPerfectDays,
        high_score_days: highScoreDays,
      };

      // Check each achievement
      ACHIEVEMENTS.forEach(achievement => {
        const reqType = achievement.requirement.type;
        const reqValue = achievement.requirement.value;
        
        if (stats[reqType] >= reqValue) {
          unlockedAchievements.push(achievement.id);
        }
      });

      setAchievements(unlockedAchievements);
      await AsyncStorage.setItem('@myfit_achievements', JSON.stringify(unlockedAchievements));
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  };

  const getMotivationalMessage = () => {
    if (progressionScore >= 90) {
      return "🔥 Amazing! You're crushing it!";
    } else if (progressionScore >= 85) {
      return "💪 Outstanding work! Keep it up!";
    } else if (progressionScore >= 70) {
      return "✨ Great progress! You're doing well!";
    } else if (progressionScore >= 50) {
      return "📈 Keep pushing! You're making progress!";
    } else if (progressionScore >= 30) {
      return "🌱 Good start! Stay consistent!";
    } else {
      return "🎯 Let's get started! Build your routine!";
    }
  };

  const getScoreColor = () => {
    if (progressionScore >= 85) return '#05CD99'; // Green
    if (progressionScore >= 50) return '#FFB547'; // Yellow
    return '#EE5D50'; // Red
  };

  const loadDashboardData = async () => {
    try {
      // Load progression score
      const scoreJson = await AsyncStorage.getItem('@myfit_progression_score');
      if (scoreJson) {
        setProgressionScore(parseInt(scoreJson));
      } else {
        // Calculate initial score
        const score = await calculateProgressionScore();
        setProgressionScore(score);
      }

      // Load streak
      const streakJson = await AsyncStorage.getItem('@myfit_streak');
      if (streakJson) {
        setCurrentStreak(parseInt(streakJson));
      }

      // Load achievements
      const achievementsJson = await AsyncStorage.getItem('@myfit_achievements');
      if (achievementsJson) {
        setAchievements(JSON.parse(achievementsJson));
      }

      // Load user profile
      const profileJson = await AsyncStorage.getItem('@myfit_profile');
      if (profileJson) {
        const profile = JSON.parse(profileJson);
        setUserName(profile.name || 'User');
      }

      // Load today's nutrition and workout data
      await loadTodayData();

      // Check achievements
      await checkAchievements();
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  const loadTodayData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Load nutrition logs
      const nutritionJson = await AsyncStorage.getItem(`@myfit_nutrition_logs_${today}`);
      if (nutritionJson) {
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

        // Load daily targets
        const targetsJson = await AsyncStorage.getItem('@myfit_daily_targets');
        if (targetsJson) {
          const targets = JSON.parse(targetsJson);
          setUserData(prev => ({
            ...prev,
            calories: {
              consumed: Math.round(totals.calories),
              target: Math.round(targets.calories),
              remaining: Math.round(targets.calories - totals.calories),
            },
            protein: {
              consumed: Math.round(totals.protein),
              target: Math.round(targets.protein),
              remaining: Math.round(targets.protein - totals.protein),
            },
            carbs: {
              consumed: Math.round(totals.carbs),
              target: Math.round(targets.carbs),
              remaining: Math.round(targets.carbs - totals.carbs),
            },
            fats: {
              consumed: Math.round(totals.fats),
              target: Math.round(targets.fats),
              remaining: Math.round(targets.fats - totals.fats),
            },
          }));
        }
      }

      // Load water intake
      const waterJson = await AsyncStorage.getItem(`@myfit_water_${today}`);
      if (waterJson) {
        const waterCount = parseInt(waterJson);
        setUserData(prev => ({
          ...prev,
          water: { consumed: waterCount, target: 8 },
        }));
      }

      // Load workout history
      const historyJson = await AsyncStorage.getItem('@myfit_workout_history');
      if (historyJson) {
        const history = JSON.parse(historyJson);
        const todayWorkouts = history[today] || [];
        const thisWeekWorkouts = getThisWeekWorkouts(history);
        
        setUserData(prev => ({
          ...prev,
          workouts: {
            completed: todayWorkouts.length,
            thisWeek: thisWeekWorkouts,
          },
        }));
      }
    } catch (error) {
      console.error('Error loading today data:', error);
    }
  };

  const getThisWeekWorkouts = (history) => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    
    let count = 0;
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      const dateKey = date.toISOString().split('T')[0];
      if (history[dateKey]) {
        count += history[dateKey].length;
      }
    }
    return count;
  };

  const calculateProgressionScore = async () => {
    try {
      // 50% from nutrition adherence (last 30 days)
      // 50% from workout completion (last 30 days)
      
      const today = new Date();
      let nutritionScore = 0;
      let workoutScore = 0;
      let nutritionDays = 0;
      let workoutDays = 0;

      // Load targets
      const targetsJson = await AsyncStorage.getItem('@myfit_daily_targets');
      const targets = targetsJson ? JSON.parse(targetsJson) : null;

      // Load workout plan
      const planJson = await AsyncStorage.getItem('@myfit_workout_plan_v2');
      const workoutPlan = planJson ? JSON.parse(planJson) : null;

      // Calculate for last 30 days
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];

        // Check nutrition
        const nutritionJson = await AsyncStorage.getItem(`@myfit_nutrition_logs_${dateKey}`);
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

          // Check if within 10% of targets
          const caloriesOk = Math.abs(totals.calories - targets.calories) / targets.calories <= 0.1;
          const proteinOk = totals.protein >= targets.protein * 0.9;
          const carbsOk = Math.abs(totals.carbs - targets.carbs) / targets.carbs <= 0.15;
          const fatsOk = Math.abs(totals.fats - targets.fats) / targets.fats <= 0.15;

          if (caloriesOk && proteinOk && carbsOk && fatsOk) {
            nutritionScore += 1;
          }
          nutritionDays += 1;
        }

        // Check workouts
        const historyJson = await AsyncStorage.getItem('@myfit_workout_history');
        if (historyJson && workoutPlan) {
          const history = JSON.parse(historyJson);
          const dayWorkouts = history[dateKey];
          
          if (dayWorkouts && dayWorkouts.length > 0) {
            workoutScore += 1;
          }
          workoutDays += 1;
        }
      }

      // Calculate percentages
      const nutritionPercentage = nutritionDays > 0 ? (nutritionScore / nutritionDays) * 50 : 0;
      const workoutPercentage = workoutDays > 0 ? (workoutScore / workoutDays) * 50 : 0;
      
      const totalScore = Math.round(nutritionPercentage + workoutPercentage);
      
      // Save score
      await AsyncStorage.setItem('@myfit_progression_score', totalScore.toString());
      
      return totalScore;
    } catch (error) {
      console.error('Error calculating progression score:', error);
      return 0;
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleAddMeal = () => {
    navigation.navigate('PageAjoutRepas');
  };

  const handleAddWorkout = () => {
    navigation.navigate('PageSeance');
  };

  const handleViewNutrition = () => {
    // Navigate to detailed nutrition view
    Alert.alert('Navigation', 'Navigate to Nutrition Details');
  };

  const handleViewWorkout = () => {
    navigation.navigate('Programme');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {userName}! 👋</Text>
            <Text style={styles.subtitle}>{getMotivationalMessage()}</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileInitial}>{userName.charAt(0)}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Progression Score & Streak */}
        <View style={styles.gamificationSection}>
          <TouchableOpacity 
            style={styles.scoreCard}
            onPress={() => setShowScoreModal(true)}
          >
            <View style={styles.scoreCircle}>
              <View style={[styles.scoreCircleInner, { borderColor: getScoreColor() }]}>
                <Text style={[styles.scoreText, { color: getScoreColor() }]}>
                  {progressionScore}%
                </Text>
              </View>
            </View>
            <View style={styles.scoreInfo}>
              <Text style={styles.scoreLabel}>Progression Score</Text>
              <Text style={styles.scoreTap}>Tap for details</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.streakCard}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <View style={styles.streakInfo}>
              <Text style={styles.streakNumber}>{currentStreak}</Text>
              <Text style={styles.streakLabel}>Day Streak</Text>
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.achievementsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Achievements</Text>
          </View>
          <View style={styles.achievementsGrid}>
            {ACHIEVEMENTS.map((achievement) => {
              const isUnlocked = achievements.includes(achievement.id);
              return (
                <View 
                  key={achievement.id}
                  style={[
                    styles.achievementBadge,
                    !isUnlocked && styles.achievementLocked
                  ]}
                >
                  <Text style={[
                    styles.achievementEmoji,
                    !isUnlocked && styles.achievementEmojiLocked
                  ]}>
                    {achievement.emoji}
                  </Text>
                  <Text style={[
                    styles.achievementName,
                    !isUnlocked && styles.achievementNameLocked
                  ]}>
                    {achievement.name}
                  </Text>
                  {!isUnlocked && (
                    <Text style={styles.achievementRequirement}>
                      {achievement.requirement.value} {achievement.requirement.type.replace('_', ' ')}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity style={styles.quickActionButton} onPress={handleAddMeal}>
            <Text style={styles.quickActionIcon}>🍽️</Text>
            <Text style={styles.quickActionText}>Add Meal</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton} onPress={handleAddWorkout}>
            <Text style={styles.quickActionIcon}>💪</Text>
            <Text style={styles.quickActionText}>Log Workout</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionButton} 
            onPress={() => navigation.navigate('Progress')}
          >
            <Text style={styles.quickActionIcon}>📊</Text>
            <Text style={styles.quickActionText}>View Progress</Text>
          </TouchableOpacity>
        </View>

        {/* Section: Today's Nutrition */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Nutrition</Text>
            <TouchableOpacity onPress={handleViewNutrition}>
              <Text style={styles.sectionLink}>View All →</Text>
            </TouchableOpacity>
          </View>

          {/* Nutrition Stats Grid (2x2) */}
          <View style={styles.statsGrid}>
            <StatCard
              title="Calories"
              value={userData.calories.consumed}
              unit="kcal"
              subtitle={`${userData.calories.remaining} remaining of ${userData.calories.target}`}
              color={COLORS.primary}
              trend="-12%"
              trendColor={COLORS.success}
              style={styles.statCard}
            />
            
            <StatCard
              title="Protein"
              value={userData.protein.consumed}
              unit="g"
              subtitle={`${userData.protein.remaining}g remaining`}
              color={COLORS.success}
              style={styles.statCard}
            />
            
            <StatCard
              title="Carbs"
              value={userData.carbs.consumed}
              unit="g"
              subtitle={`${userData.carbs.remaining}g remaining`}
              color={COLORS.info}
              style={styles.statCard}
            />
            
            <StatCard
              title="Fats"
              value={userData.fats.consumed}
              unit="g"
              subtitle={`${userData.fats.remaining}g remaining`}
              color={COLORS.warning}
              style={styles.statCard}
            />
          </View>
        </View>

        {/* Section: Activity Stats */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Activity & Fitness</Text>
            <TouchableOpacity onPress={handleViewWorkout}>
              <Text style={styles.sectionLink}>View All →</Text>
            </TouchableOpacity>
          </View>

          {/* Horizontal Scroll for Activity Cards */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            <StatCard
              title="Workouts"
              value={userData.workouts.completed}
              unit={`/ ${userData.workouts.thisWeek}`}
              subtitle="This week"
              color={COLORS.success}
              style={styles.horizontalCard}
            />
            
            <StatCard
              title="Weight"
              value={userData.weight.current}
              unit="kg"
              subtitle={`${userData.weight.change > 0 ? '+' : ''}${userData.weight.change} kg this week`}
              color={COLORS.primary}
              trend={`${userData.weight.change}kg`}
              trendColor={userData.weight.change < 0 ? COLORS.success : COLORS.warning}
              style={styles.horizontalCard}
            />
            
            <StatCard
              title="Steps"
              value={userData.steps.count}
              unit=""
              subtitle={`Goal: ${userData.steps.target.toLocaleString()}`}
              color={COLORS.info}
              style={styles.horizontalCard}
            />
            
            <StatCard
              title="Water"
              value={userData.water.consumed}
              unit={`/ ${userData.water.target}`}
              subtitle="Glasses today"
              color={COLORS.info}
              style={styles.horizontalCard}
            />
          </ScrollView>
        </View>

        {/* Progress Charts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Progress</Text>
          
          <View style={styles.chartsContainer}>
            <View style={styles.chartRow}>
              <View style={styles.chartCard}>
                <Text style={styles.chartTitle}>Calories Today</Text>
                <CaloriesRingChart 
                  consumed={userData.calories.consumed} 
                  target={userData.calories.target} 
                />
              </View>

              <View style={styles.chartCard}>
                <Text style={styles.chartTitle}>Macros Today</Text>
                <MacroPieChart
                  protein={userData.protein.consumed}
                  carbs={userData.carbs.consumed}
                  fats={userData.fats.consumed}
                />
              </View>
            </View>

            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Weight Progress (kg)</Text>
              <WeightLineChart
                weightData={[
                  { date: 'Mon', weight: 76.2 },
                  { date: 'Tue', weight: 76.0 },
                  { date: 'Wed', weight: 75.8 },
                  { date: 'Thu', weight: 75.7 },
                  { date: 'Fri', weight: 75.5 },
                  { date: 'Sat', weight: 75.5 },
                  { date: 'Sun', weight: 75.5 },
                ]}
              />
            </View>

            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Weekly Goals</Text>
              <MiniProgressBar
                current={userData.workouts.completed}
                target={userData.workouts.thisWeek}
                label="Workouts"
                color={COLORS.success}
              />
              <MiniProgressBar
                current={userData.water.consumed}
                target={userData.water.target}
                label="Water (glasses)"
                color={COLORS.info}
              />
              <MiniProgressBar
                current={userData.steps.count}
                target={userData.steps.target}
                label="Steps"
                color={COLORS.primary}
              />
            </View>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Score Breakdown Modal */}
      <Modal
        visible={showScoreModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowScoreModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Progression Score</Text>
              <TouchableOpacity onPress={() => setShowScoreModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.scoreBreakdown}>
              <View style={styles.scoreCircleLarge}>
                <Text style={[styles.scoreTextLarge, { color: getScoreColor() }]}>
                  {progressionScore}%
                </Text>
                <Text style={styles.scoreSubtitle}>Overall Score</Text>
              </View>

              <View style={styles.breakdownSection}>
                <Text style={styles.breakdownTitle}>How it's calculated:</Text>
                
                <View style={styles.breakdownItem}>
                  <View style={styles.breakdownIcon}>
                    <Text style={styles.breakdownEmoji}>🍽️</Text>
                  </View>
                  <View style={styles.breakdownInfo}>
                    <Text style={styles.breakdownLabel}>Nutrition Adherence</Text>
                    <Text style={styles.breakdownDescription}>
                      Days you hit your macro targets (±10%)
                    </Text>
                  </View>
                  <Text style={styles.breakdownValue}>50%</Text>
                </View>

                <View style={styles.breakdownItem}>
                  <View style={styles.breakdownIcon}>
                    <Text style={styles.breakdownEmoji}>💪</Text>
                  </View>
                  <View style={styles.breakdownInfo}>
                    <Text style={styles.breakdownLabel}>Workout Completion</Text>
                    <Text style={styles.breakdownDescription}>
                      Days you completed a workout
                    </Text>
                  </View>
                  <Text style={styles.breakdownValue}>50%</Text>
                </View>
              </View>

              <View style={styles.scoreFooter}>
                <Text style={styles.scoreFooterText}>
                  Based on your last 30 days of activity
                </Text>
                <Text style={styles.scoreFooterHint}>
                  💡 Reach 85% to unlock goal changes
                </Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => setShowScoreModal(false)}
            >
              <Text style={styles.modalButtonText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...COMMON_STYLES.container,
  },
  
  scrollContent: {
    paddingTop: SPACING.lg,
  },
  
  // Header
  header: {
    ...COMMON_STYLES.rowBetween,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  
  greeting: {
    ...COMMON_STYLES.h2,
    marginBottom: SPACING.xs,
  },
  
  subtitle: {
    ...COMMON_STYLES.bodySecondary,
  },
  
  profileButton: {
    padding: SPACING.xs,
  },
  
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    ...COMMON_STYLES.center,
  },
  
  profileInitial: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.bold,
  },
  
  // Quick Actions
  quickActionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
    gap: SPACING.md,
  },
  
  quickActionButton: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  
  quickActionIcon: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  
  quickActionText: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semiBold,
  },
  
  // Sections
  section: {
    marginBottom: SPACING.xl,
  },
  
  sectionHeader: {
    ...COMMON_STYLES.rowBetween,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.base,
  },
  
  sectionTitle: {
    ...COMMON_STYLES.h3,
  },
  
  sectionLink: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semiBold,
  },
  
  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  
  statCard: {
    width: CARD_WIDTH,
  },
  
  // Horizontal Scroll
  horizontalScroll: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  
  horizontalCard: {
    width: CARD_WIDTH * 1.2,
  },
  
  // Charts
  chartsContainer: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  
  chartRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  
  chartCard: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    ...SHADOWS.small,
    marginBottom: SPACING.md,
  },
  
  chartTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    fontWeight: TYPOGRAPHY.weights.semiBold,
  },
  
  bottomSpacer: {
    height: SPACING.xl,
  },

  // Gamification Styles
  gamificationSection: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    gap: SPACING.md,
  },

  scoreCard: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...SHADOWS.small,
    flexDirection: 'row',
    alignItems: 'center',
  },

  scoreCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },

  scoreCircleInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  scoreText: {
    ...TYPOGRAPHY.h3,
    fontWeight: TYPOGRAPHY.weights.bold,
  },

  scoreInfo: {
    flex: 1,
  },

  scoreLabel: {
    ...TYPOGRAPHY.small,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.weights.semiBold,
    marginBottom: 2,
  },

  scoreTap: {
    ...TYPOGRAPHY.tiny,
    color: COLORS.textSecondary,
  },

  streakCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...SHADOWS.small,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 120,
  },

  streakEmoji: {
    fontSize: 36,
    marginRight: SPACING.sm,
  },

  streakInfo: {
    flex: 1,
  },

  streakNumber: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.weights.bold,
  },

  streakLabel: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
  },

  achievementsSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },

  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },

  achievementBadge: {
    width: (width - SPACING.lg * 2 - SPACING.sm * 2) / 3,
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.small,
  },

  achievementLocked: {
    opacity: 0.5,
  },

  achievementEmoji: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },

  achievementEmojiLocked: {
    opacity: 0.3,
  },

  achievementName: {
    ...TYPOGRAPHY.tiny,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.weights.semiBold,
    textAlign: 'center',
  },

  achievementNameLocked: {
    color: COLORS.textSecondary,
  },

  achievementRequirement: {
    ...TYPOGRAPHY.tiny,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },

  // Modal Styles
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

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },

  modalTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.weights.bold,
  },

  modalClose: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textSecondary,
  },

  scoreBreakdown: {
    alignItems: 'center',
  },

  scoreCircleLarge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    ...SHADOWS.medium,
  },

  scoreTextLarge: {
    ...TYPOGRAPHY.h1,
    fontWeight: TYPOGRAPHY.weights.bold,
  },

  scoreSubtitle: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },

  breakdownSection: {
    width: '100%',
    marginBottom: SPACING.lg,
  },

  breakdownTitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.weights.semiBold,
    marginBottom: SPACING.md,
  },

  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },

  breakdownIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },

  breakdownEmoji: {
    fontSize: 24,
  },

  breakdownInfo: {
    flex: 1,
  },

  breakdownLabel: {
    ...TYPOGRAPHY.small,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.weights.semiBold,
  },

  breakdownDescription: {
    ...TYPOGRAPHY.tiny,
    color: COLORS.textSecondary,
  },

  breakdownValue: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.weights.bold,
  },

  scoreFooter: {
    width: '100%',
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
  },

  scoreFooterText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },

  scoreFooterHint: {
    ...TYPOGRAPHY.small,
    color: COLORS.primary,
    textAlign: 'center',
  },

  modalButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },

  modalButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.buttonText,
    fontWeight: TYPOGRAPHY.weights.semiBold,
  },
});

export default DashboardScreen;
