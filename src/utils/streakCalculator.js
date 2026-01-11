import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Calculate macro streak from nutrition history
 * A streak requires: calories >= 90% of target AND all macros hit
 */
export const calculateMacroStreak = async (targets) => {
  try {
    if (!targets) return 0;

    const allMealsJson = await AsyncStorage.getItem('@myfit_nutrition_logs');
    const allMeals = allMealsJson ? JSON.parse(allMealsJson) : {};

    const today = new Date();
    let currentStreak = 0;
    let foundGap = false;

    // Scan backwards from today
    for (let i = 0; i < 365; i++) {
      const scanDate = new Date(today);
      scanDate.setDate(today.getDate() - i);
      const dateKey = scanDate.toISOString().split('T')[0]; // YYYY-MM-DD format

      const mealsForDate = allMeals[dateKey] || [];

      if (mealsForDate.length === 0) {
        // No meals logged for this day
        foundGap = true;
        break;
      }

      // Calculate totals for this date
      const totals = mealsForDate.reduce(
        (sum, meal) => ({
          calories: sum.calories + (meal.nutrition?.calories || 0),
          protein: sum.protein + (meal.nutrition?.protein || 0),
          carbs: sum.carbs + (meal.nutrition?.carbs || 0),
          fats: sum.fats + (meal.nutrition?.fats || 0),
        }),
        { calories: 0, protein: 0, carbs: 0, fats: 0 }
      );

      // ✅ CRITICAL: Check if day meets criteria
      const caloriesMet = totals.calories >= targets.calories * 0.9; // 90% of target
      const proteinMet = totals.protein >= targets.protein * 0.9;
      const carbsMet = totals.carbs >= targets.carbs * 0.9;
      const fatsMet = totals.fats >= targets.fats * 0.9;

      if (caloriesMet && proteinMet && carbsMet && fatsMet) {
        currentStreak++;
      } else {
        // Day didn't meet criteria
        foundGap = true;
        break;
      }
    }

    // Save streak to AsyncStorage
    await AsyncStorage.setItem('@myfit_macro_streak', currentStreak.toString());
    return currentStreak;
  } catch (error) {
    console.error('Error calculating macro streak:', error);
    return 0;
  }
};

/**
 * Calculate workout streak from history
 */
export const calculateWorkoutStreak = async () => {
  try {
    const historyJson = await AsyncStorage.getItem('@myfit_workout_history');
    const history = historyJson ? JSON.parse(historyJson) : {};

    const today = new Date();
    let currentStreak = 0;
    let foundGap = false;

    // Scan backwards from today
    for (let i = 0; i < 365; i++) {
      const scanDate = new Date(today);
      scanDate.setDate(today.getDate() - i);
      const dateKey = scanDate.toISOString().split('T')[0]; // YYYY-MM-DD format

      const dayWorkouts = history[dateKey] || [];

      if (dayWorkouts.length > 0) {
        currentStreak++;
      } else {
        foundGap = true;
        break;
      }
    }

    // Save streak to AsyncStorage
    await AsyncStorage.setItem('@myfit_workout_streak', currentStreak.toString());
    return currentStreak;
  } catch (error) {
    console.error('Error calculating workout streak:', error);
    return 0;
  }
};

/**
 * Get overall streak (minimum of nutrition and workout streaks)
 */
export const getOverallStreak = async (targets) => {
  try {
    const macroStreak = await calculateMacroStreak(targets);
    const workoutStreak = await calculateWorkoutStreak();

    // Overall streak is the minimum (you must keep both)
    const overallStreak = Math.min(macroStreak, workoutStreak);

    await AsyncStorage.setItem('@myfit_overall_streak', overallStreak.toString());
    return {
      macroStreak,
      workoutStreak,
      overallStreak,
    };
  } catch (error) {
    console.error('Error getting overall streak:', error);
    return { macroStreak: 0, workoutStreak: 0, overallStreak: 0 };
  }
};
