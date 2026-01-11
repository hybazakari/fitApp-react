/**
 * USAGE EXAMPLES - MyFit Component Library
 * Copy these examples into your screens for quick implementation
 */

import React, { useState } from 'react';
import { View, FlatList, Alert } from 'react-native';
import StatCard from '../components/StatCard';
import ListItem from '../components/ListItem';
import { COLORS } from '../constants/theme';

// ============================================
// EXAMPLE 1: Using StatCard
// ============================================
export const StatCardExamples = () => {
  return (
    <View>
      {/* Basic StatCard */}
      <StatCard
        title="Calories"
        value={1850}
        unit="kcal"
        subtitle="350 remaining"
        color={COLORS.primary}
      />

      {/* StatCard with Trend */}
      <StatCard
        title="Weight"
        value={75.5}
        unit="kg"
        subtitle="This week"
        color={COLORS.success}
        trend="-0.5kg"
        trendColor={COLORS.success}
      />

      {/* Tappable StatCard */}
      <StatCard
        title="Workouts"
        value={3}
        unit="/ 5"
        subtitle="This week"
        color={COLORS.info}
        onPress={() => Alert.alert('Navigate', 'Go to workout details')}
      />

      {/* Percentage Progress */}
      <StatCard
        title="Protein"
        value={120}
        unit="g"
        subtitle="80% of daily goal"
        color={COLORS.success}
        trend="+15%"
      />
    </View>
  );
};

// ============================================
// EXAMPLE 2: Using ListItem with FlatList
// ============================================
export const MealsListExample = () => {
  const [meals, setMeals] = useState([
    { id: 1, name: 'Breakfast', time: '08:00 AM', calories: 450, icon: '🍳' },
    { id: 2, name: 'Lunch', time: '12:30 PM', calories: 650, icon: '🍱' },
    { id: 3, name: 'Snack', time: '03:00 PM', calories: 200, icon: '🍎', isNew: true },
    { id: 4, name: 'Dinner', time: '07:00 PM', calories: 700, icon: '🍽️' },
  ]);

  const handleDeleteMeal = (mealId) => {
    setMeals(prevMeals => prevMeals.filter(meal => meal.id !== mealId));
    Alert.alert('Success', 'Meal deleted successfully');
  };

  const handleViewMeal = (meal) => {
    Alert.alert('View Meal', `Details for ${meal.name}`);
  };

  return (
    <FlatList
      data={meals}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <ListItem
          title={item.name}
          subtitle={item.time}
          value={item.calories}
          unit="kcal"
          icon={item.icon}
          badge={item.isNew ? 'New' : null}
          badgeColor={COLORS.success}
          onPress={() => handleViewMeal(item)}
          onDelete={() => handleDeleteMeal(item.id)}
        />
      )}
    />
  );
};

// ============================================
// EXAMPLE 3: Workouts List with ListItem
// ============================================
export const WorkoutsListExample = () => {
  const workouts = [
    { id: 1, name: 'Upper Body', duration: '45 min', exercises: 8, icon: '💪', status: 'completed' },
    { id: 2, name: 'Leg Day', duration: '60 min', exercises: 10, icon: '🦵', status: 'completed' },
    { id: 3, name: 'Cardio', duration: '30 min', exercises: 5, icon: '🏃', status: 'upcoming' },
  ];

  const getBadgeColor = (status) => {
    switch (status) {
      case 'completed': return COLORS.success;
      case 'upcoming': return COLORS.info;
      case 'skipped': return COLORS.error;
      default: return COLORS.textMuted;
    }
  };

  return (
    <FlatList
      data={workouts}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <ListItem
          title={item.name}
          subtitle={item.duration}
          value={item.exercises}
          unit="exercises"
          icon={item.icon}
          badge={item.status}
          badgeColor={getBadgeColor(item.status)}
          onPress={() => console.log('View workout:', item.name)}
        />
      )}
    />
  );
};

// ============================================
// EXAMPLE 4: Dashboard Stats Grid (2x2)
// ============================================
export const DashboardStatsGrid = ({ nutrition }) => {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, padding: 20 }}>
      <StatCard
        title="Calories"
        value={nutrition.calories.consumed}
        unit="kcal"
        subtitle={`${nutrition.calories.remaining} remaining`}
        color={COLORS.primary}
        style={{ width: '48%' }}
      />
      
      <StatCard
        title="Protein"
        value={nutrition.protein.consumed}
        unit="g"
        subtitle={`${nutrition.protein.remaining}g left`}
        color={COLORS.success}
        style={{ width: '48%' }}
      />
      
      <StatCard
        title="Carbs"
        value={nutrition.carbs.consumed}
        unit="g"
        subtitle={`${nutrition.carbs.remaining}g left`}
        color={COLORS.info}
        style={{ width: '48%' }}
      />
      
      <StatCard
        title="Fats"
        value={nutrition.fats.consumed}
        unit="g"
        subtitle={`${nutrition.fats.remaining}g left`}
        color={COLORS.warning}
        style={{ width: '48%' }}
      />
    </View>
  );
};

// ============================================
// EXAMPLE 5: Horizontal Scroll Activity Cards
// ============================================
export const ActivityCardsHorizontalScroll = ({ activityData }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
    >
      <StatCard
        title="Workouts"
        value={activityData.workouts.completed}
        unit={`/ ${activityData.workouts.target}`}
        subtitle="This week"
        color={COLORS.success}
        style={{ width: 150 }}
      />
      
      <StatCard
        title="Steps"
        value={activityData.steps.count.toLocaleString()}
        subtitle={`Goal: ${activityData.steps.target.toLocaleString()}`}
        color={COLORS.info}
        style={{ width: 150 }}
      />
      
      <StatCard
        title="Water"
        value={activityData.water.consumed}
        unit={`/ ${activityData.water.target}`}
        subtitle="Glasses"
        color={COLORS.info}
        style={{ width: 150 }}
      />
    </ScrollView>
  );
};

// ============================================
// EXAMPLE 6: Simple List without Delete
// ============================================
export const SimpleListExample = () => {
  const achievements = [
    { id: 1, title: '7-Day Streak', description: 'Logged for 7 days', icon: '🔥' },
    { id: 2, title: '100 Workouts', description: 'Completed 100 sessions', icon: '🏆' },
    { id: 3, title: 'Weight Goal', description: 'Lost 5kg', icon: '🎯' },
  ];

  return (
    <FlatList
      data={achievements}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <ListItem
          title={item.title}
          subtitle={item.description}
          icon={item.icon}
          onPress={() => Alert.alert('Achievement', item.title)}
        />
      )}
    />
  );
};

// ============================================
// EXAMPLE 7: Dynamic Color based on Progress
// ============================================
export const DynamicColorStatCard = ({ current, target, title }) => {
  const percentage = (current / target) * 100;
  
  const getColor = () => {
    if (percentage >= 90) return COLORS.success;
    if (percentage >= 50) return COLORS.warning;
    return COLORS.error;
  };

  return (
    <StatCard
      title={title}
      value={current}
      unit={`/ ${target}`}
      subtitle={`${Math.round(percentage)}% complete`}
      color={getColor()}
      trend={percentage >= 90 ? '✓' : '!'}
      trendColor={getColor()}
    />
  );
};

// ============================================
// EXAMPLE 8: Empty State with ListItem
// ============================================
export const EmptyStateExample = () => {
  return (
    <View style={{ padding: 20 }}>
      <ListItem
        title="No meals logged yet"
        subtitle="Tap 'Add Meal' to get started"
        icon="🍽️"
        onPress={() => Alert.alert('Add Meal', 'Navigate to add meal screen')}
      />
    </View>
  );
};

// ============================================
// DATA STRUCTURE EXAMPLES
// ============================================
export const SAMPLE_DATA = {
  // For Dashboard
  nutrition: {
    calories: { consumed: 1850, target: 2200, remaining: 350 },
    protein: { consumed: 120, target: 150, remaining: 30 },
    carbs: { consumed: 180, target: 220, remaining: 40 },
    fats: { consumed: 55, target: 70, remaining: 15 },
  },

  // For Activity
  activity: {
    workouts: { completed: 3, target: 5 },
    steps: { count: 8234, target: 10000 },
    water: { consumed: 6, target: 8 },
    weight: { current: 75.5, change: -0.5 },
  },

  // For Meals List
  meals: [
    { id: 1, name: 'Breakfast', time: '08:00 AM', calories: 450, icon: '🍳' },
    { id: 2, name: 'Lunch', time: '12:30 PM', calories: 650, icon: '🍱' },
    { id: 3, name: 'Snack', time: '03:00 PM', calories: 200, icon: '🍎' },
  ],

  // For Workouts List
  workouts: [
    { id: 1, name: 'Upper Body', duration: '45 min', exercises: 8, icon: '💪' },
    { id: 2, name: 'Leg Day', duration: '60 min', exercises: 10, icon: '🦵' },
  ],
};
