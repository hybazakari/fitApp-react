/**
 * DASHBOARD SCREEN - UPDATED VERSION WITH CHARTS
 * This is an enhanced version of DashboardScreen.js with integrated charts
 * Copy this code to replace the existing DashboardScreen.js
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, COMMON_STYLES, SHADOWS } from '../constants/theme';
import StatCard from '../components/StatCard';
import { CaloriesRingChart, MacroPieChart, MiniProgressBar } from '../components/MacroCharts';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.lg * 3) / 2;

const DashboardScreenUpdated = ({ navigation }) => {
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

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // TODO: Replace with actual API call
      console.log('Loading dashboard data...');
    } catch (error) {
      console.error('Error loading dashboard:', error);
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
            <Text style={styles.subtitle}>Let's crush your goals today</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileInitial}>{userName.charAt(0)}</Text>
            </View>
          </TouchableOpacity>
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
        </View>

        {/* 🆕 CALORIE RING CHART */}
        <CaloriesRingChart
          consumed={userData.calories.consumed}
          target={userData.calories.target}
        />

        {/* 🆕 MACRO PIE CHART */}
        <MacroPieChart
          protein={userData.protein.consumed}
          carbs={userData.carbs.consumed}
          fats={userData.fats.consumed}
        />

        {/* Section: Macro Progress Bars (Alternative compact view) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Macro Progress</Text>
          <View style={styles.progressContainer}>
            <MiniProgressBar
              current={userData.protein.consumed}
              target={userData.protein.target}
              color={COLORS.chartColors.protein}
              label="Protein"
            />
            <MiniProgressBar
              current={userData.carbs.consumed}
              target={userData.carbs.target}
              color={COLORS.chartColors.carbs}
              label="Carbs"
            />
            <MiniProgressBar
              current={userData.fats.consumed}
              target={userData.fats.target}
              color={COLORS.chartColors.fats}
              label="Fats"
            />
          </View>
        </View>

        {/* Section: Activity Stats (Unchanged - works with light theme) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Activity & Fitness</Text>
          </View>

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
              value={userData.steps.count.toLocaleString()}
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

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
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
    paddingHorizontal: SPACING.lg,
  },
  
  sectionHeader: {
    ...COMMON_STYLES.rowBetween,
    marginBottom: SPACING.base,
  },
  
  sectionTitle: {
    ...COMMON_STYLES.h3,
  },
  
  // Progress Container
  progressContainer: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.base,
    ...SHADOWS.small,
  },
  
  // Horizontal Scroll
  horizontalScroll: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  
  horizontalCard: {
    width: CARD_WIDTH * 1.2,
  },
  
  bottomSpacer: {
    height: SPACING.xl,
  },
});

export default DashboardScreenUpdated;
