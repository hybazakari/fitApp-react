import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
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
import { TYPOGRAPHY, COLORS, SPACING, BORDER_RADIUS, SHADOWS, COMMON_STYLES } from '../../constants/theme';
import { useUser } from '../../context/UserContext';
import { CaloriesRingChart, MiniProgressBar } from '../../components/MacroCharts';
import SafeHeader from '../../components/SafeHeader';

const MEAL_TYPES = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  SNACKS: 'snacks',
  DINNER: 'dinner',
};

const DailyNutritionScreen = ({ navigation }) => {
  const { dailyTargets, profile } = useUser();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [meals, setMeals] = useState({
    breakfast: [],
    lunch: [],
    snacks: [],
    dinner: [],
  });
  const [totals, setTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMeals();
  }, [selectedDate]);

  // Reload meals when screen comes into focus (after adding a meal)
  useFocusEffect(
    useCallback(() => {
      loadMeals();
    }, [selectedDate])
  );

  const loadMeals = async () => {
    try {
      // ✅ CRITICAL: Load from global nutrition logs key
      const allMealsJson = await AsyncStorage.getItem('@myfit_nutrition_logs');
      const allMeals = allMealsJson ? JSON.parse(allMealsJson) : {};

      // Get meals for selected date
      const mealsForDate = allMeals[selectedDate] || [];

      // Categorize by meal type
      const categorizedMeals = {
        breakfast: [],
        lunch: [],
        snacks: [],
        dinner: [],
      };

      mealsForDate.forEach(meal => {
        const mealType = meal.mealType?.toLowerCase() || 'snacks';
        if (categorizedMeals[mealType]) {
          categorizedMeals[mealType].push({
            id: meal.id,
            nom: meal.name,
            calories: Math.round(meal.nutrition?.calories || 0),
            proteines: Math.round(meal.nutrition?.protein || 0),
            glucides: Math.round(meal.nutrition?.carbs || 0),
            lipides: Math.round(meal.nutrition?.fats || 0),
          });
        }
      });

      setMeals(categorizedMeals);
      calculateTotals(categorizedMeals);
    } catch (error) {
      console.error('Error loading meals:', error);
    }
  };

  const calculateTotals = (mealsData) => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;

    Object.values(mealsData).forEach(mealList => {
      mealList.forEach(meal => {
        totalCalories += parseFloat(meal.calories) || 0;
        totalProtein += parseFloat(meal.proteines) || 0;
        totalCarbs += parseFloat(meal.glucides) || 0;
        totalFats += parseFloat(meal.lipides) || 0;
      });
    });

    setTotals({
      calories: Math.round(totalCalories),
      protein: Math.round(totalProtein),
      carbs: Math.round(totalCarbs),
      fats: Math.round(totalFats),
    });
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadMeals();
    setRefreshing(false);
  }, [selectedDate]);

  const handleDeleteMeal = async (mealType, mealId) => {
    Alert.alert(
      'Delete Meal',
      'Are you sure you want to delete this meal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // ✅ Load, filter, and save back
              const allMealsJson = await AsyncStorage.getItem('@myfit_nutrition_logs');
              let allMeals = allMealsJson ? JSON.parse(allMealsJson) : {};

              if (allMeals[selectedDate]) {
                allMeals[selectedDate] = allMeals[selectedDate].filter(
                  m => m.id !== mealId
                );
              }

              await AsyncStorage.setItem('@myfit_nutrition_logs', JSON.stringify(allMeals));
              await loadMeals();
            } catch (error) {
              console.error('Error deleting meal:', error);
              Alert.alert('Error', 'Failed to delete meal');
            }
          },
        },
      ]
    );
  };

  const renderMealSection = (type, icon, title) => {
    const mealList = meals[type] || [];

    return (
      <View style={styles.mealSection}>
        <View style={styles.mealHeader}>
          <Text style={styles.mealIcon}>{icon}</Text>
          <Text style={styles.mealTitle}>{title}</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddFood', { mealType: type, date: selectedDate })}
          >
            <Ionicons name="add-circle" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {mealList.length === 0 ? (
          <View style={styles.emptyMeal}>
            <Text style={styles.emptyMealText}>No meals added</Text>
          </View>
        ) : (
          mealList.map((meal, index) => (
            <View key={index} style={styles.mealItem}>
              <View style={styles.mealInfo}>
                <Text style={styles.mealName}>{meal.nom || 'Unnamed meal'}</Text>
                <Text style={styles.mealDetails}>
                  {meal.calories || 0} cal • {meal.proteines || 0}g P • {meal.glucides || 0}g C • {meal.lipides || 0}g F
                </Text>
              </View>
              <TouchableOpacity onPress={() => handleDeleteMeal(type, meal.id)}>
                <Ionicons name="trash-outline" size={20} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
    );
  };

  const caloriesRemaining = (dailyTargets?.calories || 2000) - totals.calories;

  return (
    <SafeAreaView style={styles.container}>
      <SafeHeader navigation={navigation} title="Daily Nutrition" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Today's Summary</Text>
          
          <View style={styles.chartContainer}>
            <CaloriesRingChart
              consumed={totals.calories}
              target={dailyTargets?.calories || 2000}
            />
          </View>

          <View style={styles.remainingContainer}>
            <Text style={styles.remainingLabel}>Calories Remaining</Text>
            <Text style={[styles.remainingValue, { color: caloriesRemaining >= 0 ? COLORS.success : COLORS.error }]}>
              {Math.abs(caloriesRemaining)} {caloriesRemaining >= 0 ? 'left' : 'over'}
            </Text>
          </View>

          <View style={styles.macrosContainer}>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{totals.protein}g</Text>
              <Text style={styles.macroLabel}>Protein</Text>
              <Text style={styles.macroRemaining}>
                {Math.max(0, (dailyTargets?.protein || 150) - totals.protein)}g left
              </Text>
            </View>

            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{totals.carbs}g</Text>
              <Text style={styles.macroLabel}>Carbs</Text>
              <Text style={styles.macroRemaining}>
                {Math.max(0, (dailyTargets?.carbs || 200) - totals.carbs)}g left
              </Text>
            </View>

            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{totals.fats}g</Text>
              <Text style={styles.macroLabel}>Fats</Text>
              <Text style={styles.macroRemaining}>
                {Math.max(0, (dailyTargets?.fats || 65) - totals.fats)}g left
              </Text>
            </View>
          </View>
        </View>

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
  headerTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.textPrimary,
  },
  summaryCard: {
    backgroundColor: COLORS.cardBackground,
    margin: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.small,
  },
  summaryTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
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
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  remainingValue: {
    fontSize: TYPOGRAPHY.sizes.xxl,
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
    fontSize: TYPOGRAPHY.sizes.lg,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  macroLabel: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  macroRemaining: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.textMuted,
  },
  mealSection: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.small,
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  mealIcon: {
    fontSize: 24,
    marginRight: SPACING.sm,
  },
  mealTitle: {
    flex: 1,
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.textPrimary,
  },
  addButton: {
    padding: SPACING.xs,
  },
  emptyMeal: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  emptyMealText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.textSecondary,
  },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  mealDetails: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.textSecondary,
  },
  bottomSpacer: {
    height: SPACING.xl,
  },
});

export default DailyNutritionScreen;
