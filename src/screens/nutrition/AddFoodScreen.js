import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { searchFoods, calculateNutrition, FOOD_CATEGORIES } from '../../data/foodDatabase';

const AddFoodScreen = ({ route, navigation }) => {
  const { mealType, date, onFoodAdded } = route.params;
  const [activeTab, setActiveTab] = useState('search'); // search, favorites, custom
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState('');

  // Custom meal state
  const [customName, setCustomName] = useState('');
  const [customCalories, setCustomCalories] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [customCarbs, setCustomCarbs] = useState('');
  const [customFats, setCustomFats] = useState('');

  useEffect(() => {
    loadFavorites();
    if (activeTab === 'search') {
      handleSearch('');
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'search') {
      handleSearch(searchQuery);
    }
  }, [searchQuery, selectedCategory]);

  const loadFavorites = async () => {
    try {
      const favsJson = await AsyncStorage.getItem('@myfit_favorite_foods');
      if (favsJson) {
        setFavorites(JSON.parse(favsJson));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const handleSearch = (query) => {
    let results = searchFoods(query);
    if (selectedCategory) {
      results = results.filter(food => food.category === selectedCategory);
    }
    setSearchResults(results);
  };

  const toggleFavorite = async (food) => {
    const isFavorite = favorites.some(fav => fav.id === food.id);
    let newFavorites;
    
    if (isFavorite) {
      newFavorites = favorites.filter(fav => fav.id !== food.id);
    } else {
      newFavorites = [...favorites, food];
    }
    
    setFavorites(newFavorites);
    try {
      await AsyncStorage.setItem('@myfit_favorite_foods', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const handleSelectFood = (food) => {
    setSelectedFood(food);
    setQuantity(food.serving.size.toString());
  };

  const handleAddFood = async () => {
    if (!selectedFood || !quantity || parseFloat(quantity) <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid quantity');
      return;
    }

    const nutrition = calculateNutrition(selectedFood, parseFloat(quantity));
    const newLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: 'user_123', // TODO: Replace with actual user ID
      date,
      mealType,
      foods: [{
        foodId: selectedFood.id,
        name: selectedFood.name,
        quantity: parseFloat(quantity),
        unit: selectedFood.serving.unit,
        nutrition,
      }],
      totalNutrition: nutrition,
      timestamp: new Date().toISOString(),
    };

    try {
      // Load existing logs
      const logsJson = await AsyncStorage.getItem(`@myfit_nutrition_logs_${date}`);
      const logs = logsJson ? JSON.parse(logsJson) : [];
      
      // Add new log
      logs.push(newLog);
      
      // Save
      await AsyncStorage.setItem(`@myfit_nutrition_logs_${date}`, JSON.stringify(logs));
      
      Alert.alert('Success', 'Food added successfully!');
      if (onFoodAdded) onFoodAdded();
      navigation.goBack();
    } catch (error) {
      console.error('Error adding food:', error);
      Alert.alert('Error', 'Failed to add food');
    }
  };

  const handleAddCustomFood = async () => {
    if (!customName || !customCalories || !customProtein || !customCarbs || !customFats) {
      Alert.alert('Invalid Input', 'Please fill in all fields');
      return;
    }

    const nutrition = {
      calories: parseInt(customCalories),
      protein: parseFloat(customProtein),
      carbs: parseFloat(customCarbs),
      fats: parseFloat(customFats),
    };

    const newLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: 'user_123',
      date,
      mealType,
      foods: [{
        foodId: 'custom',
        name: customName,
        quantity: 1,
        unit: 'serving',
        nutrition,
      }],
      totalNutrition: nutrition,
      timestamp: new Date().toISOString(),
    };

    try {
      const logsJson = await AsyncStorage.getItem(`@myfit_nutrition_logs_${date}`);
      const logs = logsJson ? JSON.parse(logsJson) : [];
      logs.push(newLog);
      await AsyncStorage.setItem(`@myfit_nutrition_logs_${date}`, JSON.stringify(logs));
      
      Alert.alert('Success', 'Custom food added successfully!');
      if (onFoodAdded) onFoodAdded();
      navigation.goBack();
    } catch (error) {
      console.error('Error adding custom food:', error);
      Alert.alert('Error', 'Failed to add custom food');
    }
  };

  const renderFoodItem = (food, showFavoriteButton = true) => {
    const isFavorite = favorites.some(fav => fav.id === food.id);
    
    return (
      <TouchableOpacity
        key={food.id}
        style={[
          styles.foodItem,
          selectedFood?.id === food.id && styles.foodItemSelected,
        ]}
        onPress={() => handleSelectFood(food)}
      >
        <View style={styles.foodItemContent}>
          <Text style={styles.foodName}>{food.name}</Text>
          <Text style={styles.foodServing}>
            Per {food.serving.size}{food.serving.unit}
          </Text>
          <View style={styles.foodMacros}>
            <Text style={styles.macroTag}>{food.nutrition.calories} cal</Text>
            <Text style={styles.macroTag}>P: {food.nutrition.protein}g</Text>
            <Text style={styles.macroTag}>C: {food.nutrition.carbs}g</Text>
            <Text style={styles.macroTag}>F: {food.nutrition.fats}g</Text>
          </View>
        </View>
        {showFavoriteButton && (
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => toggleFavorite(food)}
          >
            <Text style={styles.favoriteIcon}>{isFavorite ? '⭐' : '☆'}</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  const renderSearchTab = () => (
    <View style={styles.tabContent}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search foods..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor={COLORS.textSecondary}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryScrollContent}
      >
        <TouchableOpacity
          style={[styles.categoryChip, !selectedCategory && styles.categoryChipActive]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text style={[styles.categoryChipText, !selectedCategory && styles.categoryChipTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        {Object.values(FOOD_CATEGORIES).map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === category && styles.categoryChipTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.foodList} showsVerticalScrollIndicator={false}>
        {searchResults.map(food => renderFoodItem(food))}
      </ScrollView>
    </View>
  );

  const renderFavoritesTab = () => (
    <View style={styles.tabContent}>
      {favorites.length > 0 ? (
        <ScrollView style={styles.foodList} showsVerticalScrollIndicator={false}>
          {favorites.map(food => renderFoodItem(food, false))}
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateEmoji}>⭐</Text>
          <Text style={styles.emptyStateText}>No favorites yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Star foods in the search tab to add them here
          </Text>
        </View>
      )}
    </View>
  );

  const renderCustomTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.customForm}>
        <Text style={styles.label}>Food Name</Text>
        <TextInput
          style={styles.input}
          value={customName}
          onChangeText={setCustomName}
          placeholder="e.g., Homemade Pasta"
          placeholderTextColor={COLORS.textSecondary}
        />

        <Text style={styles.label}>Calories</Text>
        <TextInput
          style={styles.input}
          value={customCalories}
          onChangeText={setCustomCalories}
          placeholder="e.g., 300"
          keyboardType="numeric"
          placeholderTextColor={COLORS.textSecondary}
        />

        <Text style={styles.label}>Protein (g)</Text>
        <TextInput
          style={styles.input}
          value={customProtein}
          onChangeText={setCustomProtein}
          placeholder="e.g., 20"
          keyboardType="decimal-pad"
          placeholderTextColor={COLORS.textSecondary}
        />

        <Text style={styles.label}>Carbs (g)</Text>
        <TextInput
          style={styles.input}
          value={customCarbs}
          onChangeText={setCustomCarbs}
          placeholder="e.g., 40"
          keyboardType="decimal-pad"
          placeholderTextColor={COLORS.textSecondary}
        />

        <Text style={styles.label}>Fats (g)</Text>
        <TextInput
          style={styles.input}
          value={customFats}
          onChangeText={setCustomFats}
          placeholder="e.g., 10"
          keyboardType="decimal-pad"
          placeholderTextColor={COLORS.textSecondary}
        />

        <TouchableOpacity style={styles.addButton} onPress={handleAddCustomFood}>
          <Text style={styles.addButtonText}>Add Custom Food</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add to {mealType}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'search' && styles.tabActive]}
          onPress={() => setActiveTab('search')}
        >
          <Text style={[styles.tabText, activeTab === 'search' && styles.tabTextActive]}>
            Search
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'favorites' && styles.tabActive]}
          onPress={() => setActiveTab('favorites')}
        >
          <Text style={[styles.tabText, activeTab === 'favorites' && styles.tabTextActive]}>
            Favorites
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'custom' && styles.tabActive]}
          onPress={() => setActiveTab('custom')}
        >
          <Text style={[styles.tabText, activeTab === 'custom' && styles.tabTextActive]}>
            Custom
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'search' && renderSearchTab()}
      {activeTab === 'favorites' && renderFavoritesTab()}
      {activeTab === 'custom' && renderCustomTab()}

      {selectedFood && activeTab !== 'custom' && (
        <View style={styles.bottomSheet}>
          <View style={styles.bottomSheetHeader}>
            <Text style={styles.bottomSheetTitle}>{selectedFood.name}</Text>
            <TouchableOpacity onPress={() => setSelectedFood(null)}>
              <Text style={styles.bottomSheetClose}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.bottomSheetLabel}>Quantity ({selectedFood.serving.unit})</Text>
          <TextInput
            style={styles.quantityInput}
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="decimal-pad"
          />
          
          {quantity && parseFloat(quantity) > 0 && (
            <View style={styles.nutritionPreview}>
              <Text style={styles.nutritionPreviewTitle}>Nutrition:</Text>
              <View style={styles.nutritionRow}>
                <Text style={styles.nutritionText}>
                  Calories: {calculateNutrition(selectedFood, parseFloat(quantity)).calories}
                </Text>
                <Text style={styles.nutritionText}>
                  Protein: {calculateNutrition(selectedFood, parseFloat(quantity)).protein}g
                </Text>
              </View>
              <View style={styles.nutritionRow}>
                <Text style={styles.nutritionText}>
                  Carbs: {calculateNutrition(selectedFood, parseFloat(quantity)).carbs}g
                </Text>
                <Text style={styles.nutritionText}>
                  Fats: {calculateNutrition(selectedFood, parseFloat(quantity)).fats}g
                </Text>
              </View>
            </View>
          )}
          
          <TouchableOpacity style={styles.addButton} onPress={handleAddFood}>
            <Text style={styles.addButtonText}>Add to {mealType}</Text>
          </TouchableOpacity>
        </View>
      )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  closeButton: {
    fontSize: 24,
    color: COLORS.textPrimary,
  },
  headerTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    textTransform: 'capitalize',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    padding: SPACING.md,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.weights.semiBold,
  },
  tabContent: {
    flex: 1,
  },
  searchInput: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    margin: SPACING.lg,
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
  },
  categoryScroll: {
    marginBottom: SPACING.md,
  },
  categoryScrollContent: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  categoryChip: {
    backgroundColor: COLORS.cardBackground,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  categoryChipTextActive: {
    color: COLORS.white,
  },
  foodList: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  foodItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.small,
  },
  foodItemSelected: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  foodItemContent: {
    flex: 1,
  },
  foodName: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.weights.semiBold,
    marginBottom: SPACING.xs,
  },
  foodServing: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  foodMacros: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  macroTag: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    fontSize: 10,
  },
  favoriteButton: {
    padding: SPACING.xs,
  },
  favoriteIcon: {
    fontSize: 24,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xxl,
  },
  emptyStateEmoji: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyStateText: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  emptyStateSubtext: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  customForm: {
    padding: SPACING.lg,
  },
  label: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.weights.semiBold,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  input: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  bottomSheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.large,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  bottomSheetTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
  },
  bottomSheetClose: {
    fontSize: 24,
    color: COLORS.textSecondary,
  },
  bottomSheetLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  quantityInput: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  nutritionPreview: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  nutritionPreviewTitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
  },
  nutritionText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  addButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.weights.bold,
  },
});

export default AddFoodScreen;
