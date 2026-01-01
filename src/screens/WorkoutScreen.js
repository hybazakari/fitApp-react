import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, COMMON_STYLES, SHADOWS } from '../constants/theme';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_ABBREVIATIONS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const STORAGE_KEY = '@myfit_workout_plan';

const WorkoutScreen = ({ navigation }) => {
  const [selectedDay, setSelectedDay] = useState(DAYS_OF_WEEK[0]);
  const [workoutPlan, setWorkoutPlan] = useState({
    Monday: 'Chest',
    Tuesday: 'Back',
    Wednesday: 'Legs',
    Thursday: 'Shoulders',
    Friday: 'Arms',
    Saturday: 'Core',
    Sunday: 'Rest',
  });
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingDay, setEditingDay] = useState('');
  const [editingMuscleGroup, setEditingMuscleGroup] = useState('');

  // Load workout plan from AsyncStorage on mount
  useEffect(() => {
    loadWorkoutPlan();
  }, []);

  // Set default to current day
  useEffect(() => {
    const currentDayIndex = new Date().getDay();
    const adjustedIndex = currentDayIndex === 0 ? 6 : currentDayIndex - 1; // Convert Sunday=0 to index 6
    setSelectedDay(DAYS_OF_WEEK[adjustedIndex]);
  }, []);

  const loadWorkoutPlan = async () => {
    try {
      const savedPlan = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedPlan !== null) {
        setWorkoutPlan(JSON.parse(savedPlan));
      }
    } catch (error) {
      console.error('Error loading workout plan:', error);
    }
  };

  const saveWorkoutPlan = async (newPlan) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPlan));
      setWorkoutPlan(newPlan);
    } catch (error) {
      console.error('Error saving workout plan:', error);
      Alert.alert('Error', 'Failed to save workout plan');
    }
  };

  const handleEditDay = (day) => {
    setEditingDay(day);
    setEditingMuscleGroup(workoutPlan[day] || '');
    setIsEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (!editingMuscleGroup.trim()) {
      Alert.alert('Error', 'Please enter a muscle group or activity');
      return;
    }

    const updatedPlan = {
      ...workoutPlan,
      [editingDay]: editingMuscleGroup.trim(),
    };

    saveWorkoutPlan(updatedPlan);
    setIsEditModalVisible(false);
    Alert.alert('Success', 'Workout plan updated!');
  };

  const renderDaySelector = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.daySelectorContainer}
    >
      {DAYS_OF_WEEK.map((day, index) => {
        const isSelected = day === selectedDay;
        return (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayButton,
              isSelected && styles.dayButtonSelected,
            ]}
            onPress={() => setSelectedDay(day)}
          >
            <Text style={[
              styles.dayButtonText,
              isSelected && styles.dayButtonTextSelected,
            ]}>
              {DAY_ABBREVIATIONS[index]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  const renderMuscleGroupCard = () => {
    const muscleGroup = workoutPlan[selectedDay] || 'Not Set';
    const isRestDay = muscleGroup.toLowerCase() === 'rest';

    return (
      <View style={styles.muscleGroupCard}>
        <Text style={styles.selectedDayLabel}>{selectedDay}</Text>
        <View style={styles.muscleGroupContent}>
          <Text style={[
            styles.muscleGroupTitle,
            isRestDay && styles.restDayTitle
          ]}>
            {isRestDay ? '😴 Rest Day' : `💪 ${muscleGroup}`}
          </Text>
          {!isRestDay && (
            <Text style={styles.muscleGroupSubtitle}>
              Target Muscle Group
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditDay(selectedDay)}
        >
          <Text style={styles.editButtonText}>✏️ Edit</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderWeekOverview = () => (
    <View style={styles.weekOverviewContainer}>
      <Text style={styles.sectionTitle}>Weekly Overview</Text>
      {DAYS_OF_WEEK.map((day, index) => {
        const muscleGroup = workoutPlan[day] || 'Not Set';
        const isToday = day === selectedDay;
        
        return (
          <TouchableOpacity
            key={day}
            style={[
              styles.weekDayRow,
              isToday && styles.weekDayRowToday,
            ]}
            onPress={() => setSelectedDay(day)}
          >
            <View style={styles.weekDayLeft}>
              <Text style={[
                styles.weekDayName,
                isToday && styles.weekDayNameToday,
              ]}>
                {DAY_ABBREVIATIONS[index]}
              </Text>
              <Text style={[
                styles.weekDayFull,
                isToday && styles.weekDayFullToday,
              ]}>
                {day}
              </Text>
            </View>
            <Text style={[
              styles.weekDayMuscle,
              isToday && styles.weekDayMuscleToday,
            ]}>
              {muscleGroup}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderEditModal = () => (
    <Modal
      visible={isEditModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsEditModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit {editingDay}</Text>
            <TouchableOpacity
              onPress={() => setIsEditModalVisible(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <Text style={styles.inputLabel}>Muscle Group / Activity</Text>
            <TextInput
              style={styles.input}
              value={editingMuscleGroup}
              onChangeText={setEditingMuscleGroup}
              placeholder="e.g., Chest, Back, Legs, Rest"
              placeholderTextColor={COLORS.textMuted}
              autoFocus
            />

            <View style={styles.quickOptions}>
              <Text style={styles.quickOptionsLabel}>Quick Options:</Text>
              <View style={styles.quickButtonsRow}>
                {['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio', 'Rest'].map(option => (
                  <TouchableOpacity
                    key={option}
                    style={styles.quickButton}
                    onPress={() => setEditingMuscleGroup(option)}
                  >
                    <Text style={styles.quickButtonText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.modalButtonCancel}
              onPress={() => setIsEditModalVisible(false)}
            >
              <Text style={styles.modalButtonCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButtonSave}
              onPress={handleSaveEdit}
            >
              <Text style={styles.modalButtonSaveText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Workout Program</Text>
          <Text style={styles.headerSubtitle}>Plan your weekly training schedule</Text>
        </View>

        {/* Day Selector */}
        {renderDaySelector()}

        {/* Selected Day Details */}
        {renderMuscleGroupCard()}

        {/* Week Overview */}
        {renderWeekOverview()}

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Edit Modal */}
      {renderEditModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...COMMON_STYLES.container,
  },
  
  scrollContent: {
    padding: SPACING.lg,
  },
  
  // Header
  header: {
    marginBottom: SPACING.xl,
  },
  
  headerTitle: {
    fontSize: TYPOGRAPHY.sizes.xxxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  
  headerSubtitle: {
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.textSecondary,
  },
  
  // Day Selector
  daySelectorContainer: {
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  
  dayButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.cardBackground,
    marginRight: SPACING.sm,
    minWidth: 60,
    alignItems: 'center',
  },
  
  dayButtonSelected: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.small,
  },
  
  dayButtonText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semiBold,
    color: COLORS.textPrimary,
  },
  
  dayButtonTextSelected: {
    color: COLORS.white,
  },
  
  // Muscle Group Card
  muscleGroupCard: {
    ...COMMON_STYLES.card,
    padding: SPACING.xl,
    marginVertical: SPACING.lg,
    alignItems: 'center',
  },
  
  selectedDayLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.md,
  },
  
  muscleGroupContent: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  
  muscleGroupTitle: {
    fontSize: TYPOGRAPHY.sizes.xxxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  
  restDayTitle: {
    color: COLORS.success,
  },
  
  muscleGroupSubtitle: {
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.textSecondary,
  },
  
  editButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.small,
  },
  
  editButtonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.semiBold,
  },
  
  // Week Overview
  weekOverviewContainer: {
    marginTop: SPACING.lg,
  },
  
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.semiBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.base,
  },
  
  weekDayRow: {
    ...COMMON_STYLES.card,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.base,
    marginBottom: SPACING.sm,
  },
  
  weekDayRowToday: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight + '10', // 10% opacity
  },
  
  weekDayLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  weekDayName: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.textPrimary,
    width: 40,
  },
  
  weekDayNameToday: {
    color: COLORS.primary,
  },
  
  weekDayFull: {
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.textSecondary,
    marginLeft: SPACING.md,
  },
  
  weekDayFullToday: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.weights.semiBold,
  },
  
  weekDayMuscle: {
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  
  weekDayMuscleToday: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.weights.bold,
  },
  
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    paddingBottom: SPACING.xl,
    maxHeight: '80%',
  },
  
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  
  modalTitle: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.textPrimary,
  },
  
  modalCloseButton: {
    padding: SPACING.sm,
  },
  
  modalCloseText: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    color: COLORS.textSecondary,
  },
  
  modalBody: {
    padding: SPACING.lg,
  },
  
  inputLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  
  input: {
    ...COMMON_STYLES.input,
    fontSize: TYPOGRAPHY.sizes.lg,
    paddingVertical: SPACING.base,
  },
  
  quickOptions: {
    marginTop: SPACING.xl,
  },
  
  quickOptionsLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  
  quickButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  
  quickButton: {
    backgroundColor: COLORS.cardBackground,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.base,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  
  quickButtonText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  
  modalButtonCancel: {
    flex: 1,
    ...COMMON_STYLES.buttonSecondary,
    paddingVertical: SPACING.base,
  },
  
  modalButtonCancelText: {
    ...COMMON_STYLES.buttonSecondaryText,
    textAlign: 'center',
  },
  
  modalButtonSave: {
    flex: 1,
    ...COMMON_STYLES.button,
    paddingVertical: SPACING.base,
  },
  
  modalButtonSaveText: {
    ...COMMON_STYLES.buttonText,
  },
  
  bottomSpacer: {
    height: SPACING.xl,
  },
});

export default WorkoutScreen;
