import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { useUser } from '../../context/UserContext';
import { CaloriesRingChart, MiniProgressBar } from '../../components/MacroCharts';

const MEAL_TYPES = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  SNACKS: 'snacks',
  DINNER: 'dinner',
};

const DailyNutritionScreen = ({ navigation }) => {
  const { dailyTargets, profile } = useUser();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [todayLogs, setTodayLogs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [waterIntake, setWaterIntake] = useState(0);

  const [totals, setTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  });

  useEffect(() => {
    loadTodayLogs();
    loadWaterIntake();
  }, [selectedDate]);

  useEffect(() => {
    calculateTotals();
  }, [todayLogs]);

  const loadTodayLogs = async () => {
    try {
      const logsJson = await AsyncStorage.getItem(`@myfit_nutrition_logs_${selectedDate}`);
      if (logsJson) {
        setTodayLogs(JSON.parse(logsJson));
      } else {
        setTodayLogs([]);
      }
    } catch (error) {
      console.error('Error loading logs:', error);
    }
  };

  const loadWaterIntake = async () => {
    try {
      const water = await AsyncStorage.getItem(`@myfit_water_${selectedDate}`);
      setWaterIntake(water ? parseInt(water) : 0);
    } catch (error) {
      console.error('Error loading water:', error);
    }
  };

  const calculateTotals = () => {
    const newTotals = todayLogs.reduce(
      (acc, log) => ({
        calories: acc.calories + log.totalNutrition.calories,
        protein: acc.protein + log.totalNutrition.protein,
        carbs: acc.carbs + log.totalNutrition.carbs,
        fats: acc.fats + log.totalNutrition.fats,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
    setTotals(newTotals);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTodayLogs();
    await loadWaterIntake();
    setRefreshing(false);
  }, [selectedDate]);

  const addWater = async () => {
    const newWater = waterIntake + 1;
    setWaterIntake(newWater);
    try {
      await AsyncStorage.setItem(`@myfit_water_${selectedDate}`, newWater.toString());
    } catch (error) {
      console.error('Error saving water:', error);
    }
  };

  const removeWater = async () => {
    if (waterIntake > 0) {
      const newWater = waterIntake - 1;
      setWaterIntake(newWater);
      try {
        await AsyncStorage.setItem(`@myfit_water_${selectedDate}`, newWater.toString());
      } catch (error) {
        console.error('Error saving water:', error);
      }
    }
  };

  const handleAddFood = (mealType) => {
    navigation.navigate('AddFood', {
      mealType,
      date: selectedDate,
      onFoodAdded: loadTodayLogs,
    });
  };

  const handleDeleteLog = async (logId) => {
    Alert.alert(
      'Delete Meal',
      'Are you sure you want to delete this meal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedLogs = todayLogs.filter(log => log.id !== logId);
            setTodayLogs(updatedLogs);
            try {
              await AsyncStorage.setItem(
                `@myfit_nutrition_logs_${selectedDate}`,
                JSON.stringify(updatedLogs)
              );
            } catch (error) {
              console.error('Error deleting log:', error);
            }
          },
        },
      ]
    );
  };

  const handleCopyMeal = async (log) => {
    const newLog = {
      ...log,
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };
    const updatedLogs = [...todayLogs, newLog];
    setTodayLogs(updatedLogs);
    try {
      await AsyncStorage.setItem(
        `@myfit_nutrition_logs_${selectedDate}`,
        JSON.stringify(updatedLogs)
      );
      Alert.alert('Success', 'Meal copied successfully!');
    } catch (error) {
      console.error('Error copying meal:', error);
    }
  };

  const getMealLogs = (mealType) => {
    return todayLogs.filter(log => log.mealType === mealType);
  };

  const getMealTotals = (mealType) => {
    const meals = getMealLogs(mealType);
    return meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.totalNutrition.calories,
        protein: acc.protein + meal.totalNutrition.protein,
        carbs: acc.carbs + meal.totalNutrition.carbs,
        fats: acc.fats + meal.totalNutrition.fats,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
  };

  const renderMealSection = (mealType, icon, title) => {
    const mealLogs = getMealLogs(mealType);
    const mealTotals = getMealTotals(mealType);

    return (
      <View style={styles.mealSection}>
        <View style={styles.mealHeader}>
          <View style={styles.mealTitleContainer}>
            <Text style={styles.mealIcon}>{icon}</Text>
            <Text style={styles.mealTitle}>{title}</Text>
          </View>
          {mealLogs.length > 0 && (
            <Text style={styles.mealCalories}>{mealTotals.calories} kcal</Text>
          )}
        </View>

        {mealLogs.length > 0 ? (
          <View style={styles.mealLogsContainer}>
            {mealLogs.map((log) => (
              <View key={log.id} style={styles.mealLogCard}>
                <View style={styles.mealLogContent}>
                  <Text style={styles.mealLogName}>
                    {log.foods.map(f => `${f.name} (${f.quantity}${f.unit})`).join(', ')}
                  </Text>
                  <View style={styles.mealLogMacros}>
                    <Text style={styles.macroText}>P: {log.totalNutrition.protein}g</Text>
                    <Text style={styles.macroText}>C: {log.totalNutrition.carbs}g</Text>
                    <Text style={styles.macroText}>F: {log.totalNutrition.fats}g</Text>
                  </View>
                </View>
                <View style={styles.mealLogActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleCopyMeal(log)}
                  >
                    <Text style={styles.actionButtonText}>📋</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDeleteLog(log.id)}
                  >
                    <Text style={styles.actionButtonText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyMealText}>No meals logged yet</Text>
        )}

        <TouchableOpacity
          style={styles.addMealButton}
          onPress={() => handleAddFood(mealType)}
        >
          <Text style={styles.addMealButtonText}>+ Add Food</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const remaining = {
    calories: (dailyTargets?.calories || 2000) - totals.calories,
    protein: (dailyTargets?.protein || 150) - totals.protein,
    carbs: (dailyTargets?.carbs || 200) - totals.carbs,
    fats: (dailyTargets?.fats || 65) - totals.fats,
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
        <Text style={styles.headerTitle}>Daily Nutrition</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
      >
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Today's Nutrition</Text>
            <Text style={styles.summaryDate}>
              {new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </Text>
          </View>

          <View style={styles.chartContainer}>
            <CaloriesRingChart
              consumed={totals.calories}
              target={dailyTargets?.calories || 2000}
            />
          </View>

          <View style={styles.remainingContainer}>
            <Text style={styles.remainingLabel}>Remaining</Text>
            <Text style={[
              styles.remainingValue,
              { color: remaining.calories < 0 ? COLORS.error : COLORS.success }
            ]}>
              {remaining.calories >= 0 ? remaining.calories : Math.abs(remaining.calories)} kcal
              {remaining.calories < 0 && ' over'}
            </Text>
          </View>

          <View style={styles.macrosContainer}>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{totals.protein}g</Text>
              <Text style={styles.macroLabel}>Protein</Text>
              <Text style={styles.macroRemaining}>
                {remaining.protein >= 0 ? remaining.protein : 0}g left
              </Text>
            </View>
            <View style={styles.macroDivider} />
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{totals.carbs}g</Text>
              <Text style={styles.macroLabel}>Carbs</Text>
              <Text style={styles.macroRemaining}>
                {remaining.carbs >= 0 ? remaining.carbs : 0}g left
              </Text>
            </View>
            <View style={styles.macroDivider} />
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{totals.fats}g</Text>
              <Text style={styles.macroLabel}>Fats</Text>
              <Text style={styles.macroRemaining}>
                {remaining.fats >= 0 ? remaining.fats : 0}g left
              </Text>
            </View>
          </View>
        </View>

        {/* Progress Bars */}
        <View style={styles.progressCard}>
          <MiniProgressBar
            current={totals.protein}
            target={dailyTargets?.protein || 150}
            label="Protein"
            color={COLORS.chartColors.protein}
          />
          <MiniProgressBar
            current={totals.carbs}
            target={dailyTargets?.carbs || 200}
            label="Carbs"
            color={COLORS.chartColors.carbs}
          />
          <MiniProgressBar
            current={totals.fats}
            target={dailyTargets?.fats || 65}
            label="Fats"
            color={COLORS.chartColors.fats}
          />
        </View>

        {/* Water Tracking */}
        <View style={styles.waterCard}>
          <View style={styles.waterHeader}>
            <Text style={styles.waterTitle}>💧 Water Intake</Text>
            <Text style={styles.waterCount}>
              {waterIntake} / {dailyTargets?.water || 8} glasses
            </Text>
          </View>
          <View style={styles.waterActions}>
            <TouchableOpacity style={styles.waterButton} onPress={removeWater}>
              <Text style={styles.waterButtonText}>−</Text>
            </TouchableOpacity>
            <View style={styles.waterGlasses}>
              {[...Array(dailyTargets?.water || 8)].map((_, i) => (
                <Text key={i} style={styles.waterGlass}>
                  {i < waterIntake ? '💧' : '💨'}
                </Text>
              ))}
            </View>
            <TouchableOpacity style={styles.waterButton} onPress={addWater}>
              <Text style={styles.waterButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Meal Sections */}
        {renderMealSection(MEAL_TYPES.BREAKFAST, '🌅', 'Breakfast')}
        {renderMealSection(MEAL_TYPES.LUNCH, '☀️', 'Lunch')}
        {renderMealSection(MEAL_TYPES.SNACKS, '🍎', 'Snacks')}
        {renderMealSection(MEAL_TYPES.DINNER, '🌙', 'Dinner')}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
  headerTitle: {
    fontSize: TYPOGRAPHY.h3,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.text,
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    padding: SPACING.lg,
  },
  summaryCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    ...SHADOWS.medium,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  summaryTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
  },
  summaryDate: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  remainingContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  remainingLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  remainingValue: {
    ...TYPOGRAPHY.h2,
    fontWeight: TYPOGRAPHY.weights.bold,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroItem: {
    alignItems: 'center',
    flex: 1,
  },
  macroValue: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  macroLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  macroRemaining: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontSize: 10,
  },
  macroDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  progressCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.small,
  },
  waterCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.small,
  },
  waterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  waterTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.textPrimary,
  },
  waterCount: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.weights.semiBold,
  },
  waterActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  waterButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waterButtonText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: TYPOGRAPHY.weights.bold,
  },
  waterGlasses: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  waterGlass: {
    fontSize: 20,
  },
  mealSection: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.small,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  mealTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealIcon: {
    fontSize: 24,
    marginRight: SPACING.sm,
  },
  mealTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.textPrimary,
  },
  mealCalories: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.weights.semiBold,
  },
  mealLogsContainer: {
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  mealLogCard: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealLogContent: {
    flex: 1,
  },
  mealLogName: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  mealLogMacros: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  macroText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  mealLogActions: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  actionButton: {
    padding: SPACING.xs,
  },
  actionButtonText: {
    fontSize: 20,
  },
  emptyMealText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: SPACING.md,
  },
  addMealButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
  },
  addMealButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.weights.semiBold,
  },
  bottomSpacer: {
    height: SPACING.xl,
  },
});

export default DailyNutritionScreen;
