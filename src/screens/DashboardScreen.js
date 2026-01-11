import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  Modal,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, TYPOGRAPHY, COMMON_STYLES } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';

const ACHIEVEMENTS = [
  { id: 'first_workout', name: 'First Steps', icon: 'trophy-outline', description: 'Complete your first workout', requirement: { type: 'workouts_total', value: 1 } },
  { id: 'week_streak', name: '7-Day Warrior', icon: 'flame-outline', description: 'Maintain a 7-day streak', requirement: { type: 'streak_days', value: 7 } },
  { id: 'macro_master', name: 'Macro Master', icon: 'ribbon-outline', description: 'Hit all macros for 7 days', requirement: { type: 'macro_perfect_days', value: 7 } },
  { id: 'workout_warrior', name: 'Workout Warrior', icon: 'barbell-outline', description: 'Complete 30 workouts', requirement: { type: 'workouts_total', value: 30 } },
  { id: 'month_streak', name: 'Month Master', icon: 'medal-outline', description: 'Maintain a 30-day streak', requirement: { type: 'streak_days', value: 30 } },
  { id: 'goal_crusher', name: 'Goal Crusher', icon: 'star-outline', description: 'Maintain 85%+ score for 30 days', requirement: { type: 'high_score_days', value: 30 } },
];

const DashboardScreen = ({ navigation }) => {
  
  const { user } = useAuth();
  
  const { 
    dailyTargets, 
    profile, 
    progressionScore: contextScore, 
    currentStreak: contextStreak, 
    nutritionData, 
    workoutHistory 
  } = useUser();
  
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [userData, setUserData] = useState({
    calories: { consumed: 0, target: 2000, remaining: 2000 },
    protein: { consumed: 0, target: 150, remaining: 150 },
    carbs: { consumed: 0, target: 200, remaining: 200 },
    fats: { consumed: 0, target: 65, remaining: 65 },
    workouts: { completed: 0, weeklyGoal: 5 },
  });
  
  const [progressionScore, setProgressionScore] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [newAchievement, setNewAchievement] = useState(null);

  const userName = user?.name || user?.prenom || 'User';

  // Reload dashboard data whenever the screen gains focus
  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [dailyTargets])
  );

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Today key
      const todayKey = new Date().toISOString().split('T')[0];

      // Read meals from storage and recompute totals
      const allMealsJson = await AsyncStorage.getItem('@myfit_nutrition_logs');
      const allMeals = allMealsJson ? JSON.parse(allMealsJson) : {};
      const todayMeals = allMeals[todayKey] || [];

      const consumed = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
      };

      todayMeals.forEach(meal => {
        consumed.calories += parseFloat(meal.nutrition?.calories) || 0;
        consumed.protein += parseFloat(meal.nutrition?.protein) || 0;
        consumed.carbs += parseFloat(meal.nutrition?.carbs) || 0;
        consumed.fats += parseFloat(meal.nutrition?.fats) || 0;
      });

      // Read workouts from storage and compute last 7 days count
      const historyJson = await AsyncStorage.getItem('@myfit_workout_history');
      const history = historyJson ? JSON.parse(historyJson) : {};
      const today = new Date();
      let thisWeekCompleted = 0;
      for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const key = d.toISOString().split('T')[0];
        thisWeekCompleted += (history[key]?.length || 0);
      }

      // Set user data with targets
      setUserData({
        calories: {
          consumed: Math.round(consumed.calories),
          target: dailyTargets?.calories || 2000,
          remaining: Math.round((dailyTargets?.calories || 2000) - consumed.calories),
        },
        protein: {
          consumed: Math.round(consumed.protein),
          target: dailyTargets?.protein || 150,
          remaining: Math.round((dailyTargets?.protein || 150) - consumed.protein),
        },
        carbs: {
          consumed: Math.round(consumed.carbs),
          target: dailyTargets?.carbs || 200,
          remaining: Math.round((dailyTargets?.carbs || 200) - consumed.carbs),
        },
        fats: {
          consumed: Math.round(consumed.fats),
          target: dailyTargets?.fats || 65,
          remaining: Math.round((dailyTargets?.fats || 65) - consumed.fats),
        },
        workouts: {
          completed: thisWeekCompleted,
          weeklyGoal: 5,
        },
      });

      // Context-derived scores
      setProgressionScore(contextScore || 0);
      setCurrentStreak(contextStreak || 0);

      // Achievements
      const savedAchievements = await AsyncStorage.getItem('@myfit_achievements');
      if (savedAchievements) {
        setAchievements(JSON.parse(savedAchievements));
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  }, []);

  const getMotivationalMessage = () => {
    const score = progressionScore;
    if (score >= 80) return "Outstanding! Keep crushing it!";
    if (score >= 60) return "Great progress! You're doing amazing!";
    if (score >= 40) return "Good work! Keep pushing forward!";
    return "Every step counts! Let's get started!";
  };

  const workoutProgressPercent = (userData.workouts.completed / userData.workouts.weeklyGoal) * 100;

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
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.gymLogo}>
              <Ionicons name="fitness-outline" size={24} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.greeting}>Hello, {userName}</Text>
              <Text style={styles.subtitle}>{getMotivationalMessage()}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <View style={styles.profileAvatar}>
              <Ionicons name="person" size={24} color={COLORS.textWhite} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.quickActionsContainer}>
          <TouchableOpacity style={styles.quickActionButton} onPress={() => navigation.navigate('Nutrition')}>
            <View style={styles.quickActionIconContainer}>
              <Ionicons name="restaurant-outline" size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.quickActionText}>Add Meal</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton} 
            onPress={() => navigation.navigate('Programme')}
          >
            <View style={styles.quickActionIconContainer}>
              <Ionicons name="barbell-outline" size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.quickActionText}>Workout</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('Progress')}
          >
            <View style={styles.quickActionIconContainer}>
              <Ionicons name="trending-up-outline" size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.quickActionText}>Progress</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Nutrition</Text>
          
          <View style={styles.macroGrid}>
            <View style={styles.macroCard}>
              <Text style={styles.macroTitle}>Calories</Text>
              <Text style={styles.macroValue}>{userData.calories.consumed}</Text>
              <Text style={styles.macroSubtitle}>/ {userData.calories.target} kcal</Text>
            </View>
            
            <View style={styles.macroCard}>
              <Text style={styles.macroTitle}>Protein</Text>
              <Text style={styles.macroValue}>{userData.protein.consumed}</Text>
              <Text style={styles.macroSubtitle}>/ {userData.protein.target} g</Text>
            </View>
            
            <View style={styles.macroCard}>
              <Text style={styles.macroTitle}>Carbs</Text>
              <Text style={styles.macroValue}>{userData.carbs.consumed}</Text>
              <Text style={styles.macroSubtitle}>/ {userData.carbs.target} g</Text>
            </View>
            
            <View style={styles.macroCard}>
              <Text style={styles.macroTitle}>Fats</Text>
              <Text style={styles.macroValue}>{userData.fats.consumed}</Text>
              <Text style={styles.macroSubtitle}>/ {userData.fats.target} g</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Progress</Text>
          <View style={styles.progressCard}>
            <Text style={styles.progressLabel}>Workouts: {userData.workouts.completed}/{userData.workouts.weeklyGoal}</Text>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${Math.min(workoutProgressPercent, 100)}%` }]} />
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  gymLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  greeting: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.textPrimary,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.textSecondary,
  },
  profileButton: {
    padding: SPACING.xs,
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
    gap: SPACING.md,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  quickActionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  quickActionText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  macroGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  macroCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.base,
    ...SHADOWS.small,
  },
  macroTitle: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  macroValue: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  macroSubtitle: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.textSecondary,
  },
  progressCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.small,
  },
  progressLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.sm,
  },
  bottomSpacer: {
    height: SPACING.xl,
  },
});

export default DashboardScreen;