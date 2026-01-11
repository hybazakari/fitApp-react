/**
 * Food Database
 * Comprehensive database of common foods with accurate nutritional information
 * Ready to be replaced with API calls
 */

export const FOOD_CATEGORIES = {
  PROTEINS: 'Proteins',
  CARBS: 'Carbs',
  FATS: 'Fats',
  VEGETABLES: 'Vegetables',
  FRUITS: 'Fruits',
  DAIRY: 'Dairy',
  SNACKS: 'Snacks',
  BEVERAGES: 'Beverages',
};

export const FOODS = [
  // PROTEINS
  {
    id: 'protein_001',
    name: 'Chicken Breast',
    category: FOOD_CATEGORIES.PROTEINS,
    serving: { size: 100, unit: 'g' },
    nutrition: { calories: 165, protein: 31, carbs: 0, fats: 3.6, fiber: 0, sugar: 0 },
    verified: true,
  },
  {
    id: 'protein_002',
    name: 'Salmon',
    category: FOOD_CATEGORIES.PROTEINS,
    serving: { size: 100, unit: 'g' },
    nutrition: { calories: 208, protein: 20, carbs: 0, fats: 13, fiber: 0, sugar: 0 },
    verified: true,
  },
  {
    id: 'protein_003',
    name: 'Tuna',
    category: FOOD_CATEGORIES.PROTEINS,
    serving: { size: 100, unit: 'g' },
    nutrition: { calories: 130, protein: 28, carbs: 0, fats: 1, fiber: 0, sugar: 0 },
    verified: true,
  },
  {
    id: 'protein_004',
    name: 'Eggs',
    category: FOOD_CATEGORIES.PROTEINS,
    serving: { size: 1, unit: 'large egg' },
    nutrition: { calories: 78, protein: 6, carbs: 0.6, fats: 5, fiber: 0, sugar: 0.6 },
    verified: true,
  },
  {
    id: 'protein_005',
    name: 'Ground Beef (90% lean)',
    category: FOOD_CATEGORIES.PROTEINS,
    serving: { size: 100, unit: 'g' },
    nutrition: { calories: 176, protein: 20, carbs: 0, fats: 10, fiber: 0, sugar: 0 },
    verified: true,
  },
  {
    id: 'protein_006',
    name: 'Turkey Breast',
    category: FOOD_CATEGORIES.PROTEINS,
    serving: { size: 100, unit: 'g' },
    nutrition: { calories: 135, protein: 30, carbs: 0, fats: 0.7, fiber: 0, sugar: 0 },
    verified: true,
  },
  {
    id: 'protein_007',
    name: 'Pork Chop',
    category: FOOD_CATEGORIES.PROTEINS,
    serving: { size: 100, unit: 'g' },
    nutrition: { calories: 231, protein: 25, carbs: 0, fats: 14, fiber: 0, sugar: 0 },
    verified: true,
  },
  {
    id: 'protein_008',
    name: 'Shrimp',
    category: FOOD_CATEGORIES.PROTEINS,
    serving: { size: 100, unit: 'g' },
    nutrition: { calories: 99, protein: 24, carbs: 0.2, fats: 0.3, fiber: 0, sugar: 0 },
    verified: true,
  },
  {
    id: 'protein_009',
    name: 'Tofu',
    category: FOOD_CATEGORIES.PROTEINS,
    serving: { size: 100, unit: 'g' },
    nutrition: { calories: 76, protein: 8, carbs: 1.9, fats: 4.8, fiber: 0.3, sugar: 0.7 },
    verified: true,
  },
  {
    id: 'protein_010',
    name: 'Greek Yogurt (Non-Fat)',
    category: FOOD_CATEGORIES.PROTEINS,
    serving: { size: 100, unit: 'g' },
    nutrition: { calories: 59, protein: 10, carbs: 3.6, fats: 0.4, fiber: 0, sugar: 3.2 },
    verified: true,
  },

  // CARBS
  {
    id: 'carbs_001',
    name: 'White Rice (Cooked)',
    category: FOOD_CATEGORIES.CARBS,
    serving: { size: 100, unit: 'g' },
    nutrition: { calories: 130, protein: 2.7, carbs: 28, fats: 0.3, fiber: 0.4, sugar: 0.1 },
    verified: true,
  },
  {
    id: 'carbs_002',
    name: 'Brown Rice (Cooked)',
    category: FOOD_CATEGORIES.CARBS,
    serving: { size: 100, unit: 'g' },
    nutrition: { calories: 112, protein: 2.6, carbs: 24, fats: 0.9, fiber: 1.8, sugar: 0.4 },
    verified: true,
  },
  {
    id: 'carbs_003',
    name: 'Sweet Potato',
    category: FOOD_CATEGORIES.CARBS,
    serving: { size: 100, unit: 'g' },
    nutrition: { calories: 86, protein: 1.6, carbs: 20, fats: 0.1, fiber: 3, sugar: 4.2 },
    verified: true,
  },
  {
    id: 'carbs_004',
    name: 'Oatmeal (Dry)',
    category: FOOD_CATEGORIES.CARBS,
    serving: { size: 40, unit: 'g' },
    nutrition: { calories: 150, protein: 5, carbs: 27, fats: 3, fiber: 4, sugar: 1 },
    verified: true,
  },
  {
    id: 'carbs_005',
    name: 'Whole Wheat Bread',
    category: FOOD_CATEGORIES.CARBS,
    serving: { size: 1, unit: 'slice' },
    nutrition: { calories: 81, protein: 4, carbs: 14, fats: 1.1, fiber: 2, sugar: 1.4 },
    verified: true,
  },
  {
    id: 'carbs_006',
    name: 'Pasta (Cooked)',
    category: FOOD_CATEGORIES.CARBS,
    serving: { size: 100, unit: 'g' },
    nutrition: { calories: 131, protein: 5, carbs: 25, fats: 1.1, fiber: 1.8, sugar: 0.6 },
    verified: true,
  },
  {
    id: 'carbs_007',
    name: 'Quinoa (Cooked)',
    category: FOOD_CATEGORIES.CARBS,
    serving: { size: 100, unit: 'g' },
    nutrition: { calories: 120, protein: 4.4, carbs: 21, fats: 1.9, fiber: 2.8, sugar: 0.9 },
    verified: true,
  },
  {
    id: 'carbs_008',
    name: 'Potato (Baked)',
    category: FOOD_CATEGORIES.CARBS,
    serving: { size: 100, unit: 'g' },
    nutrition: { calories: 93, protein: 2.5, carbs: 21, fats: 0.1, fiber: 2.2, sugar: 1.2 },
    verified: true,
  },
  {
    id: 'carbs_009',
    name: 'Banana',
    category: FOOD_CATEGORIES.CARBS,
    serving: { size: 1, unit: 'medium' },
    nutrition: { calories: 105, protein: 1.3, carbs: 27, fats: 0.4, fiber: 3.1, sugar: 14 },
    verified: true,
  },

  // VEGETABLES
  {
    id: 'veg_001',
    name: 'Broccoli',
    category: FOOD_CATEGORIES.VEGETABLES,
    serving: { size: 100, unit: 'g' },
    nutrition: { calories: 34, protein: 2.8, carbs: 7, fats: 0.4, fiber: 2.6, sugar: 1.7 },
    verified: true,
  },
  {
    id: 'veg_002',
    name: 'Spinach',
    category: FOOD_CATEGORIES.VEGETABLES,
    serving: { size: 100, unit: 'g' },
    nutrition: { calories: 23, protein: 2.9, carbs: 3.6, fats: 0.4, fiber: 2.2, sugar: 0.4 },
    verified: true,
  },
  {
    id: 'veg_003',
    name: 'Carrots',
    category: FOOD_CATEGORIES.VEGETABLES,
    serving: { size: 100, unit: 'g' },
    nutrition: { calories: 41, protein: 0.9, carbs: 10, fats: 0.2, fiber: 2.8, sugar: 4.7 },
    verified: true,
  },
  {
    id: 'veg_004',
    name: 'Bell Pepper',
    category: FOOD_CATEGORIES.VEGETABLES,
    serving: { size: 100, unit: 'g' },
    nutrition: { calories: 31, protein: 1, carbs: 6, fats: 0.3, fiber: 2.1, sugar: 4.2 },
    verified: true,
  },
  {
    id: 'veg_005',
    name: 'Tomato',
    category: FOOD_CATEGORIES.VEGETABLES,
    serving: { size: 100, unit: 'g' },
    nutrition: { calories: 18, protein: 0.9, carbs: 3.9, fats: 0.2, fiber: 1.2, sugar: 2.6 },
    verified: true,
  },
  {
    id: 'veg_006',
    name: 'Cucumber',
    category: FOOD_CATEGORIES.VEGETABLES,
    serving: { size: 100, unit: 'g' },
    nutrition: { calories: 15, protein: 0.7, carbs: 3.6, fats: 0.1, fiber: 0.5, sugar: 1.7 },
    verified: true,
  },
  {
    id: 'veg_007',
    name: 'Lettuce',
    category: FOOD_CATEGORIES.VEGETABLES,
    serving: { size: 100, unit: 'g' },
    nutrition: { calories: 15, protein: 1.4, carbs: 2.9, fats: 0.2, fiber: 1.3, sugar: 0.8 },
    verified: true,
  },
  {
    id: 'veg_008',
    name: 'Asparagus',
    category: FOOD_CATEGORIES.VEGETABLES,
    serving: { size: 100, unit: 'g' },
    nutrition: { calories: 20, protein: 2.2, carbs: 3.9, fats: 0.1, fiber: 2.1, sugar: 1.9 },
    verified: true,
  },

  // FRUITS
  {
    id: 'fruit_001',
    name: 'Apple',
    category: FOOD_CATEGORIES.FRUITS,
    serving: { size: 1, unit: 'medium' },
    nutrition: { calories: 95, protein: 0.5, carbs: 25, fats: 0.3, fiber: 4.4, sugar: 19 },
    verified: true,
  },
  {
    id: 'fruit_002',
    name: 'Orange',
    category: FOOD_CATEGORIES.FRUITS,
    serving: { size: 1, unit: 'medium' },
    nutrition: { calories: 62, protein: 1.2, carbs: 15, fats: 0.2, fiber: 3.1, sugar: 12 },
    verified: true,
  },
  {
    id: 'fruit_003',
    name: 'Strawberries',
    category: FOOD_CATEGORIES.FRUITS,
    serving: { size: 100, unit: 'g' },
    nutrition: { calories: 32, protein: 0.7, carbs: 7.7, fats: 0.3, fiber: 2, sugar: 4.9 },
    verified: true,
  },
  {
    id: 'fruit_004',
    name: 'Blueberries',
    category: FOOD_CATEGORIES.FRUITS,
    serving: { size: 100, unit: 'g' },
    nutrition: { calories: 57, protein: 0.7, carbs: 14, fats: 0.3, fiber: 2.4, sugar: 10 },
    verified: true,
  },
  {
    id: 'fruit_005',
    name: 'Watermelon',
    category: FOOD_CATEGORIES.FRUITS,
    serving: { size: 100, unit: 'g' },
    nutrition: { calories: 30, protein: 0.6, carbs: 8, fats: 0.2, fiber: 0.4, sugar: 6 },
    verified: true,
  },

  // DAIRY
  {
    id: 'dairy_001',
    name: 'Milk (2%)',
    category: FOOD_CATEGORIES.DAIRY,
    serving: { size: 240, unit: 'ml' },
    nutrition: { calories: 122, protein: 8, carbs: 12, fats: 5, fiber: 0, sugar: 12 },
    verified: true,
  },
  {
    id: 'dairy_002',
    name: 'Cheddar Cheese',
    category: FOOD_CATEGORIES.DAIRY,
    serving: { size: 28, unit: 'g' },
    nutrition: { calories: 114, protein: 7, carbs: 0.4, fats: 9, fiber: 0, sugar: 0.1 },
    verified: true,
  },
  {
    id: 'dairy_003',
    name: 'Mozzarella Cheese',
    category: FOOD_CATEGORIES.DAIRY,
    serving: { size: 28, unit: 'g' },
    nutrition: { calories: 85, protein: 6, carbs: 1, fats: 6, fiber: 0, sugar: 0.4 },
    verified: true,
  },
  {
    id: 'dairy_004',
    name: 'Cottage Cheese (Low-Fat)',
    category: FOOD_CATEGORIES.DAIRY,
    serving: { size: 100, unit: 'g' },
    nutrition: { calories: 72, protein: 12, carbs: 4.3, fats: 1, fiber: 0, sugar: 4.1 },
    verified: true,
  },

  // FATS
  {
    id: 'fats_001',
    name: 'Olive Oil',
    category: FOOD_CATEGORIES.FATS,
    serving: { size: 15, unit: 'ml' },
    nutrition: { calories: 119, protein: 0, carbs: 0, fats: 14, fiber: 0, sugar: 0 },
    verified: true,
  },
  {
    id: 'fats_002',
    name: 'Avocado',
    category: FOOD_CATEGORIES.FATS,
    serving: { size: 100, unit: 'g' },
    nutrition: { calories: 160, protein: 2, carbs: 9, fats: 15, fiber: 7, sugar: 0.7 },
    verified: true,
  },
  {
    id: 'fats_003',
    name: 'Almonds',
    category: FOOD_CATEGORIES.FATS,
    serving: { size: 28, unit: 'g' },
    nutrition: { calories: 164, protein: 6, carbs: 6, fats: 14, fiber: 3.5, sugar: 1.2 },
    verified: true,
  },
  {
    id: 'fats_004',
    name: 'Peanut Butter',
    category: FOOD_CATEGORIES.FATS,
    serving: { size: 15, unit: 'g' },
    nutrition: { calories: 94, protein: 4, carbs: 3.5, fats: 8, fiber: 1, sugar: 1.5 },
    verified: true,
  },
  {
    id: 'fats_005',
    name: 'Walnuts',
    category: FOOD_CATEGORIES.FATS,
    serving: { size: 28, unit: 'g' },
    nutrition: { calories: 185, protein: 4.3, carbs: 3.9, fats: 18, fiber: 1.9, sugar: 0.7 },
    verified: true,
  },

  // SNACKS
  {
    id: 'snack_001',
    name: 'Protein Bar',
    category: FOOD_CATEGORIES.SNACKS,
    serving: { size: 1, unit: 'bar' },
    nutrition: { calories: 200, protein: 20, carbs: 24, fats: 7, fiber: 3, sugar: 3 },
    verified: true,
  },
  {
    id: 'snack_002',
    name: 'Rice Cakes',
    category: FOOD_CATEGORIES.SNACKS,
    serving: { size: 1, unit: 'cake' },
    nutrition: { calories: 35, protein: 0.7, carbs: 7, fats: 0.3, fiber: 0.4, sugar: 0 },
    verified: true,
  },
  {
    id: 'snack_003',
    name: 'Dark Chocolate (70%)',
    category: FOOD_CATEGORIES.SNACKS,
    serving: { size: 28, unit: 'g' },
    nutrition: { calories: 170, protein: 2, carbs: 13, fats: 12, fiber: 3, sugar: 7 },
    verified: true,
  },

  // BEVERAGES
  {
    id: 'bev_001',
    name: 'Water',
    category: FOOD_CATEGORIES.BEVERAGES,
    serving: { size: 240, unit: 'ml' },
    nutrition: { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, sugar: 0 },
    verified: true,
  },
  {
    id: 'bev_002',
    name: 'Black Coffee',
    category: FOOD_CATEGORIES.BEVERAGES,
    serving: { size: 240, unit: 'ml' },
    nutrition: { calories: 2, protein: 0.3, carbs: 0, fats: 0, fiber: 0, sugar: 0 },
    verified: true,
  },
  {
    id: 'bev_003',
    name: 'Green Tea',
    category: FOOD_CATEGORIES.BEVERAGES,
    serving: { size: 240, unit: 'ml' },
    nutrition: { calories: 2, protein: 0, carbs: 0, fats: 0, fiber: 0, sugar: 0 },
    verified: true,
  },
  {
    id: 'bev_004',
    name: 'Whey Protein Shake',
    category: FOOD_CATEGORIES.BEVERAGES,
    serving: { size: 1, unit: 'scoop' },
    nutrition: { calories: 120, protein: 24, carbs: 3, fats: 1.5, fiber: 1, sugar: 1 },
    verified: true,
  },
];

/**
 * Search foods by name
 * @param {string} query - Search query
 * @returns {Array} Matching foods
 */
export const searchFoods = (query) => {
  if (!query) return FOODS;
  
  const lowercaseQuery = query.toLowerCase();
  return FOODS.filter(food => 
    food.name.toLowerCase().includes(lowercaseQuery)
  );
};

/**
 * Filter foods by category
 * @param {string} category - Food category
 * @returns {Array} Foods in category
 */
export const getFoodsByCategory = (category) => {
  if (!category) return FOODS;
  return FOODS.filter(food => food.category === category);
};

/**
 * Get food by ID
 * @param {string} id - Food ID
 * @returns {Object} Food object
 */
export const getFoodById = (id) => {
  return FOODS.find(food => food.id === id);
};

/**
 * Calculate nutrition for custom portion
 * @param {Object} food - Food object
 * @param {number} quantity - Quantity
 * @returns {Object} Calculated nutrition
 */
export const calculateNutrition = (food, quantity) => {
  const multiplier = quantity / food.serving.size;
  
  return {
    calories: Math.round(food.nutrition.calories * multiplier),
    protein: Math.round(food.nutrition.protein * multiplier * 10) / 10,
    carbs: Math.round(food.nutrition.carbs * multiplier * 10) / 10,
    fats: Math.round(food.nutrition.fats * multiplier * 10) / 10,
    fiber: Math.round(food.nutrition.fiber * multiplier * 10) / 10,
    sugar: Math.round(food.nutrition.sugar * multiplier * 10) / 10,
  };
};

export default FOODS;
