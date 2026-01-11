/**
 * Macro Calculator Utilities
 * Helper functions for calculating macronutrients based on user goals
 */

// Activity level multipliers
const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,      // Little or no exercise
  light: 1.375,        // Light exercise 1-3 days/week
  moderate: 1.55,      // Moderate exercise 3-5 days/week
  active: 1.725,       // Hard exercise 6-7 days/week
  veryActive: 1.9,     // Very hard exercise & physical job
};

// Goal adjustments (calorie deficit/surplus)
const GOAL_ADJUSTMENTS = {
  weightLoss: -500,    // 500 calorie deficit
  maintenance: 0,      // No adjustment
  muscleGain: 300,     // 300 calorie surplus
};

/**
 * Calculate daily calorie needs based on BMR and activity level
 * @param {number} bmr - Basal Metabolic Rate
 * @param {string} activityLevel - Activity level (sedentary, light, moderate, active, veryActive)
 * @returns {number} Daily calorie needs
 */
export const calculateDailyCalories = (bmr, activityLevel) => {
  return Math.round(bmr * (ACTIVITY_MULTIPLIERS[activityLevel] || 1.2));
};

/**
 * Calculate BMR using Mifflin-St Jeor Equation
 * @param {number} weight - Weight in kg
 * @param {number} height - Height in cm
 * @param {number} age - Age in years
 * @param {string} gender - 'male' or 'female'
 * @returns {number} BMR in calories
 */
export const calculateBMR = (weight, height, age, gender) => {
  if (gender === 'male') {
    return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
  } else {
    return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
  }
};

/**
 * Calculate macronutrient targets based on calories and goal
 * @param {number} calories - Daily calorie target
 * @param {string} goal - Goal type (weightLoss, maintenance, muscleGain)
 * @returns {object} Macro targets in grams
 */
export const calculateMacros = (calories, goal = 'maintenance') => {
  let proteinPercentage, carbsPercentage, fatsPercentage;

  switch (goal) {
    case 'muscleGain':
      // Higher carbs for muscle building
      proteinPercentage = 0.30;
      carbsPercentage = 0.50;
      fatsPercentage = 0.20;
      break;
    case 'weightLoss':
      // Higher protein to preserve muscle
      proteinPercentage = 0.40;
      carbsPercentage = 0.30;
      fatsPercentage = 0.30;
      break;
    case 'maintenance':
    default:
      proteinPercentage = 0.30;
      carbsPercentage = 0.40;
      fatsPercentage = 0.30;
      break;
  }

  return {
    protein: Math.round((calories * proteinPercentage) / 4), // 4 cal/g
    carbs: Math.round((calories * carbsPercentage) / 4),     // 4 cal/g
    fats: Math.round((calories * fatsPercentage) / 9),       // 9 cal/g
  };
};

/**
 * Master function to calculate all daily targets
 * @param {string} gender - 'male' or 'female'
 * @param {number} age - Age in years
 * @param {number} weight - Weight in kg
 * @param {number} height - Height in cm
 * @param {string} activityLevel - Activity level
 * @param {string} goal - Fitness goal (weightLoss, maintenance, muscleGain)
 * @returns {object} Complete daily targets
 */
export const calculateDailyTargets = (gender, age, weight, height, activityLevel, goal) => {
  const bmr = calculateBMR(weight, height, age, gender);
  const tdee = calculateDailyCalories(bmr, activityLevel);
  const adjustedCalories = tdee + (GOAL_ADJUSTMENTS[goal] || 0);
  const macros = calculateMacros(adjustedCalories, goal);

  return {
    calories: adjustedCalories,
    protein: macros.protein,
    carbs: macros.carbs,
    fats: macros.fats,
    water: 8, // 8 glasses
    bmr,
    tdee,
  };
};

/**
 * Calculate protein needs per kg of body weight
 * @param {number} weight - Weight in kg
 * @param {string} goal - Goal type
 * @returns {number} Protein in grams
 */
export const calculateProteinNeeds = (weight, goal = 'maintenance') => {
  const proteinPerKg = {
    maintenance: 1.6,  // General fitness
    muscleGain: 2.0,   // Muscle building
    weightLoss: 2.2,   // Fat loss while preserving muscle
  };

  return Math.round(weight * (proteinPerKg[goal] || 1.6));
};

/**
 * Calculate percentage of macro consumed vs target
 * @param {number} current - Current amount consumed
 * @param {number} target - Target amount
 * @returns {number} Percentage (0-100)
 */
export const calculateMacroPercentage = (current, target) => {
  if (target === 0) return 0;
  return Math.min(Math.round((current / target) * 100), 100);
};

/**
 * Validate if macros match the calorie count
 * @param {number} protein - Protein in grams
 * @param {number} carbs - Carbs in grams
 * @param {number} fats - Fats in grams
 * @returns {number} Total calories from macros
 */
export const calculateCaloriesFromMacros = (protein, carbs, fats) => {
  return Math.round(protein * 4 + carbs * 4 + fats * 9);
};

/**
 * Format macro value with unit
 * @param {number} value - Macro value
 * @param {string} unit - Unit (default: 'g')
 * @returns {string} Formatted string
 */
export const formatMacro = (value, unit = 'g') => {
  return `${value}${unit}`;
};

/**
 * Get color code for macro type
 * @param {string} macroType - Type of macro (protein, carbs, fats)
 * @returns {string} Hex color code
 */
export const getMacroColor = (macroType) => {
  const colors = {
    protein: '#4ECDC4',
    carbs: '#FFE66D',
    fats: '#A8E6CF',
    calories: '#FF6B6B',
  };
  return colors[macroType] || '#7F8C8D';
};
