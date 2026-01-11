/**
 * INTEGRATION EXAMPLES - Light Theme & Charts
 * Copy these examples to quickly integrate the new features
 */

import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { CaloriesRingChart, MacroPieChart, WeightLineChart, MiniProgressBar } from '../components/MacroCharts';
import { COLORS, SPACING } from '../constants/theme';

// ============================================
// EXAMPLE 1: Updated Dashboard with Charts
// ============================================
export const DashboardWithCharts = () => {
  const [userData, setUserData] = useState({
    calories: { consumed: 1850, target: 2200 },
    protein: { consumed: 120, target: 150 },
    carbs: { consumed: 180, target: 220 },
    fats: { consumed: 55, target: 70 },
  });

  return (
    <ScrollView style={styles.container}>
      {/* Calories Ring Chart */}
      <CaloriesRingChart
        consumed={userData.calories.consumed}
        target={userData.calories.target}
      />

      {/* Macro Pie Chart */}
      <MacroPieChart
        protein={userData.protein.consumed}
        carbs={userData.carbs.consumed}
        fats={userData.fats.consumed}
      />

      {/* Mini Progress Bars for Quick View */}
      <View style={styles.progressBarsContainer}>
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
    </ScrollView>
  );
};

// ============================================
// EXAMPLE 2: Profile Screen with Weight Chart
// ============================================
export const ProfileWithWeightChart = () => {
  const [weightHistory, setWeightHistory] = useState([
    { date: 'Dec 1', weight: 77.0 },
    { date: 'Dec 8', weight: 76.5 },
    { date: 'Dec 15', weight: 76.2 },
    { date: 'Dec 22', weight: 75.8 },
    { date: 'Dec 29', weight: 75.5 },
    { date: 'Jan 5', weight: 75.2 },
  ]);

  return (
    <ScrollView style={styles.container}>
      <WeightLineChart weightData={weightHistory} />
      
      {/* Additional stats can go here */}
    </ScrollView>
  );
};

// ============================================
// EXAMPLE 3: Complete Nutrition Dashboard
// ============================================
export const CompletNutritionDashboard = () => {
  const nutritionData = {
    calories: { consumed: 1850, target: 2200, remaining: 350 },
    macros: {
      protein: { consumed: 120, target: 150 },
      carbs: { consumed: 180, target: 220 },
      fats: { consumed: 55, target: 70 },
    },
  };

  return (
    <ScrollView style={styles.container}>
      {/* Main Calorie Ring */}
      <CaloriesRingChart
        consumed={nutritionData.calories.consumed}
        target={nutritionData.calories.target}
      />

      {/* Macro Breakdown */}
      <MacroPieChart
        protein={nutritionData.macros.protein.consumed}
        carbs={nutritionData.macros.carbs.consumed}
        fats={nutritionData.macros.fats.consumed}
      />
    </ScrollView>
  );
};

// ============================================
// EXAMPLE 4: API Integration with Charts
// ============================================
export const ChartWithAPIData = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNutritionData();
  }, []);

  const fetchNutritionData = async () => {
    try {
      // Replace with your actual API call
      const response = await fetch('YOUR_API_ENDPOINT/nutrition');
      const data = await response.json();
      
      setChartData({
        calories: data.calories,
        protein: data.macros.protein,
        carbs: data.macros.carbs,
        fats: data.macros.fats,
      });
    } catch (error) {
      console.error('Error fetching nutrition data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !chartData) {
    return <Text>Loading charts...</Text>;
  }

  return (
    <ScrollView>
      <CaloriesRingChart
        consumed={chartData.calories.consumed}
        target={chartData.calories.target}
      />
      <MacroPieChart
        protein={chartData.protein}
        carbs={chartData.carbs}
        fats={chartData.fats}
      />
    </ScrollView>
  );
};

// ============================================
// EXAMPLE 5: Workout Screen Usage
// ============================================
export const WorkoutScreenUsage = () => {
  // Simply import and use the WorkoutScreen component
  // It handles all the logic internally
  
  // In your navigator:
  /*
  import WorkoutScreen from './src/screens/WorkoutScreen';
  
  <Tab.Screen 
    name="Programme" 
    component={WorkoutScreen}
    options={{
      title: 'Workout Program',
      tabBarIcon: ({ color }) => <Icon name="fitness" color={color} />
    }}
  />
  */
};

// ============================================
// EXAMPLE 6: AsyncStorage Integration
// ============================================
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AsyncStorageExample = () => {
  // Save workout plan
  const saveWorkoutPlan = async (plan) => {
    try {
      await AsyncStorage.setItem('@myfit_workout_plan', JSON.stringify(plan));
      console.log('Workout plan saved!');
    } catch (error) {
      console.error('Error saving workout plan:', error);
    }
  };

  // Load workout plan
  const loadWorkoutPlan = async () => {
    try {
      const savedPlan = await AsyncStorage.getItem('@myfit_workout_plan');
      if (savedPlan !== null) {
        return JSON.parse(savedPlan);
      }
      // Return default plan if none exists
      return {
        Monday: 'Chest',
        Tuesday: 'Back',
        Wednesday: 'Legs',
        Thursday: 'Shoulders',
        Friday: 'Arms',
        Saturday: 'Core',
        Sunday: 'Rest',
      };
    } catch (error) {
      console.error('Error loading workout plan:', error);
      return null;
    }
  };

  // Clear workout plan (reset)
  const clearWorkoutPlan = async () => {
    try {
      await AsyncStorage.removeItem('@myfit_workout_plan');
      console.log('Workout plan cleared!');
    } catch (error) {
      console.error('Error clearing workout plan:', error);
    }
  };
};

// ============================================
// EXAMPLE 7: Dynamic Chart Data
// ============================================
export const DynamicChartExample = () => {
  const [timeRange, setTimeRange] = useState('week'); // 'week' or 'month'
  
  // Generate weight data based on time range
  const getWeightData = () => {
    if (timeRange === 'week') {
      return [
        { date: 'Mon', weight: 75.8 },
        { date: 'Tue', weight: 75.7 },
        { date: 'Wed', weight: 75.6 },
        { date: 'Thu', weight: 75.5 },
        { date: 'Fri', weight: 75.4 },
        { date: 'Sat', weight: 75.3 },
        { date: 'Sun', weight: 75.2 },
      ];
    } else {
      return [
        { date: 'Week 1', weight: 76.5 },
        { date: 'Week 2', weight: 76.0 },
        { date: 'Week 3', weight: 75.5 },
        { date: 'Week 4', weight: 75.0 },
      ];
    }
  };

  return (
    <View>
      {/* Time Range Selector */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
        <TouchableOpacity onPress={() => setTimeRange('week')}>
          <Text style={{ fontWeight: timeRange === 'week' ? 'bold' : 'normal' }}>
            Week
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTimeRange('month')}>
          <Text style={{ fontWeight: timeRange === 'month' ? 'bold' : 'normal' }}>
            Month
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Dynamic Chart */}
      <WeightLineChart weightData={getWeightData()} />
    </View>
  );
};

// ============================================
// EXAMPLE 8: Combined Stats Card with Mini Progress
// ============================================
export const StatsCardWithProgress = ({ title, stats }) => {
  return (
    <View style={styles.statsCard}>
      <Text style={styles.statsTitle}>{title}</Text>
      
      {stats.map((stat, index) => (
        <MiniProgressBar
          key={index}
          current={stat.current}
          target={stat.target}
          color={stat.color}
          label={stat.label}
        />
      ))}
    </View>
  );
};

// Usage:
/*
<StatsCardWithProgress
  title="Today's Nutrition"
  stats={[
    { label: 'Protein', current: 120, target: 150, color: COLORS.chartColors.protein },
    { label: 'Carbs', current: 180, target: 220, color: COLORS.chartColors.carbs },
    { label: 'Fats', current: 55, target: 70, color: COLORS.chartColors.fats },
  ]}
/>
*/

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },
  
  progressBarsContainer: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: SPACING.base,
    marginVertical: SPACING.md,
  },
  
  statsCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: SPACING.lg,
    marginVertical: SPACING.md,
  },
  
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
});

// ============================================
// SAMPLE DATA STRUCTURES
// ============================================
export const SAMPLE_DATA = {
  // For Calorie Ring Chart
  calories: {
    consumed: 1850,
    target: 2200,
  },

  // For Macro Pie Chart
  macros: {
    protein: 120,
    carbs: 180,
    fats: 55,
  },

  // For Weight Line Chart
  weightHistory: [
    { date: 'Jan 1', weight: 76.0 },
    { date: 'Jan 8', weight: 75.5 },
    { date: 'Jan 15', weight: 75.2 },
    { date: 'Jan 22', weight: 75.0 },
  ],

  // For Workout Plan
  workoutPlan: {
    Monday: 'Chest',
    Tuesday: 'Back',
    Wednesday: 'Legs',
    Thursday: 'Shoulders',
    Friday: 'Arms',
    Saturday: 'Core',
    Sunday: 'Rest',
  },
};
