import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { getExerciseById } from '../data/exerciseDatabase';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_ABBREVIATIONS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const ProgrammeScreen = ({ navigation }) => {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
  const [workoutPlan, setWorkoutPlan] = useState({});
  const [workoutHistory, setWorkoutHistory] = useState({});
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [workoutStartTime, setWorkoutStartTime] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Save workout plan whenever it changes
    if (Object.keys(workoutPlan).length > 0) {
      saveWorkoutPlan();
    }
  }, [workoutPlan]);

  const loadData = async () => {
    try {
      const [planJson, historyJson] = await Promise.all([
        AsyncStorage.getItem('@myfit_workout_plan_v2'),
        AsyncStorage.getItem('@myfit_workout_history'),
      ]);

      if (planJson) {
        setWorkoutPlan(JSON.parse(planJson));
      } else {
        // Initialize empty plan
        const emptyPlan = {};
        DAYS_OF_WEEK.forEach(day => {
          emptyPlan[day] = { exercises: [] };
        });
        setWorkoutPlan(emptyPlan);
      }

      if (historyJson) {
        setWorkoutHistory(JSON.parse(historyJson));
      }
    } catch (error) {
      console.error('Error loading workout data:', error);
    }
  };

  const saveWorkoutPlan = async () => {
    try {
      await AsyncStorage.setItem('@myfit_workout_plan_v2', JSON.stringify(workoutPlan));
    } catch (error) {
      console.error('Error saving workout plan:', error);
    }
  };

  const saveWorkoutHistory = async (history) => {
    try {
      await AsyncStorage.setItem('@myfit_workout_history', JSON.stringify(history));
      setWorkoutHistory(history);
    } catch (error) {
      console.error('Error saving workout history:', error);
    }
  };

  const handleAddExercise = () => {
    const currentDay = DAYS_OF_WEEK[selectedDay];
    navigation.navigate('ExerciseLibrary', {
      onSelectExercise: (exercise) => {
        addExerciseToDay(currentDay, exercise);
      },
      userLocation: 'Gym', // TODO: Get from user profile
    });
  };

  const addExerciseToDay = (day, exercise) => {
    const newPlan = { ...workoutPlan };
    if (!newPlan[day]) {
      newPlan[day] = { exercises: [] };
    }
    
    const newExercise = {
      id: `${exercise.id}_${Date.now()}`,
      exerciseId: exercise.id,
      name: exercise.name,
      sets: [
        { set: 1, reps: '', weight: '', completed: false },
        { set: 2, reps: '', weight: '', completed: false },
        { set: 3, reps: '', weight: '', completed: false },
      ],
    };

    newPlan[day].exercises.push(newExercise);
    setWorkoutPlan(newPlan);
  };

  const removeExercise = (day, exerciseId) => {
    Alert.alert(
      'Remove Exercise',
      'Are you sure you want to remove this exercise?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const newPlan = { ...workoutPlan };
            newPlan[day].exercises = newPlan[day].exercises.filter(
              ex => ex.id !== exerciseId
            );
            setWorkoutPlan(newPlan);
          },
        },
      ]
    );
  };

  const updateSet = (day, exerciseId, setIndex, field, value) => {
    const newPlan = { ...workoutPlan };
    const exercise = newPlan[day].exercises.find(ex => ex.id === exerciseId);
    if (exercise && exercise.sets[setIndex]) {
      exercise.sets[setIndex][field] = value;
      setWorkoutPlan(newPlan);
    }
  };

  const toggleSetComplete = (day, exerciseId, setIndex) => {
    const newPlan = { ...workoutPlan };
    const exercise = newPlan[day].exercises.find(ex => ex.id === exerciseId);
    if (exercise && exercise.sets[setIndex]) {
      exercise.sets[setIndex].completed = !exercise.sets[setIndex].completed;
      setWorkoutPlan(newPlan);
    }
  };

  const addSet = (day, exerciseId) => {
    const newPlan = { ...workoutPlan };
    const exercise = newPlan[day].exercises.find(ex => ex.id === exerciseId);
    if (exercise) {
      const newSetNumber = exercise.sets.length + 1;
      exercise.sets.push({
        set: newSetNumber,
        reps: '',
        weight: '',
        completed: false,
      });
      setWorkoutPlan(newPlan);
    }
  };

  const startWorkout = () => {
    const currentDay = DAYS_OF_WEEK[selectedDay];
    setActiveWorkout(currentDay);
    setWorkoutStartTime(new Date());
  };

  const finishWorkout = () => {
    if (!activeWorkout || !workoutStartTime) return;

    const endTime = new Date();
    const durationMinutes = Math.round((endTime - workoutStartTime) / 60000);

    const currentDayData = workoutPlan[activeWorkout];
    const totalSets = currentDayData.exercises.reduce(
      (sum, ex) => sum + ex.sets.length,
      0
    );
    const completedSets = currentDayData.exercises.reduce(
      (sum, ex) => sum + ex.sets.filter(s => s.completed).length,
      0
    );

    // Save to history
    const dateKey = new Date().toISOString().split('T')[0];
    const newHistory = { ...workoutHistory };
    
    if (!newHistory[dateKey]) {
      newHistory[dateKey] = [];
    }

    newHistory[dateKey].push({
      id: `workout_${Date.now()}`,
      day: activeWorkout,
      exercises: currentDayData.exercises,
      duration: durationMinutes,
      totalSets,
      completedSets,
      timestamp: endTime.toISOString(),
    });

    saveWorkoutHistory(newHistory);
    setShowCompletionModal(true);
  };

  const cancelWorkout = () => {
    Alert.alert(
      'Cancel Workout',
      'Are you sure you want to cancel this workout? Your progress will not be saved.',
      [
        { text: 'Continue Workout', style: 'cancel' },
        {
          text: 'Cancel Workout',
          style: 'destructive',
          onPress: () => {
            setActiveWorkout(null);
            setWorkoutStartTime(null);
          },
        },
      ]
    );
  };

  const renderSet = (day, exercise, set, setIndex) => (
    <View key={setIndex} style={styles.setRow}>
      <Text style={styles.setNumber}>{set.set}</Text>
      <TextInput
        style={styles.setInput}
        placeholder="Reps"
        value={set.reps}
        onChangeText={(value) => updateSet(day, exercise.id, setIndex, 'reps', value)}
        keyboardType="numeric"
        editable={!!activeWorkout}
        placeholderTextColor={COLORS.textSecondary}
      />
      <TextInput
        style={styles.setInput}
        placeholder="Weight"
        value={set.weight}
        onChangeText={(value) => updateSet(day, exercise.id, setIndex, 'weight', value)}
        keyboardType="decimal-pad"
        editable={!!activeWorkout}
        placeholderTextColor={COLORS.textSecondary}
      />
      <TouchableOpacity
        style={[
          styles.checkButton,
          set.completed && styles.checkButtonCompleted,
        ]}
        onPress={() => toggleSetComplete(day, exercise.id, setIndex)}
        disabled={!activeWorkout}
      >
        <Text style={styles.checkButtonText}>
          {set.completed ? '✓' : ''}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderExercise = (day, exercise) => {
    const exerciseData = getExerciseById(exercise.exerciseId);
    
    return (
      <View key={exercise.id} style={styles.exerciseCard}>
        <View style={styles.exerciseHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            {exerciseData && (
              <Text style={styles.exerciseMuscle}>{exerciseData.muscleGroup}</Text>
            )}
          </View>
          {!activeWorkout && (
            <TouchableOpacity
              onPress={() => removeExercise(day, exercise.id)}
              style={styles.removeButton}
            >
              <Text style={styles.removeButtonText}>🗑️</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.setsHeader}>
          <Text style={styles.setsHeaderText}>Set</Text>
          <Text style={styles.setsHeaderText}>Reps</Text>
          <Text style={styles.setsHeaderText}>Weight (kg)</Text>
          <Text style={styles.setsHeaderText}>✓</Text>
        </View>

        {exercise.sets.map((set, setIndex) =>
          renderSet(day, exercise, set, setIndex)
        )}

        {!activeWorkout && (
          <TouchableOpacity
            style={styles.addSetButton}
            onPress={() => addSet(day, exercise.id)}
          >
            <Text style={styles.addSetButtonText}>+ Add Set</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const currentDay = DAYS_OF_WEEK[selectedDay];
  const currentDayData = workoutPlan[currentDay] || { exercises: [] };
  const hasExercises = currentDayData.exercises.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Workout Program</Text>
        {activeWorkout && workoutStartTime && (
          <View style={styles.activeWorkoutBadge}>
            <Text style={styles.activeWorkoutText}>⏱️ Workout In Progress</Text>
          </View>
        )}
      </View>

      {/* Day Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.daySelector}
        contentContainerStyle={styles.daySelectorContent}
      >
        {DAY_ABBREVIATIONS.map((day, index) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayButton,
              selectedDay === index && styles.dayButtonActive,
            ]}
            onPress={() => !activeWorkout && setSelectedDay(index)}
            disabled={activeWorkout && activeWorkout !== DAYS_OF_WEEK[index]}
          >
            <Text
              style={[
                styles.dayButtonText,
                selectedDay === index && styles.dayButtonTextActive,
              ]}
            >
              {day}
            </Text>
            {workoutPlan[DAYS_OF_WEEK[index]]?.exercises.length > 0 && (
              <View style={styles.dayBadge}>
                <Text style={styles.dayBadgeText}>
                  {workoutPlan[DAYS_OF_WEEK[index]].exercises.length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.dayHeader}>
          <Text style={styles.dayTitle}>{currentDay}</Text>
          {!activeWorkout && hasExercises && (
            <TouchableOpacity
              style={styles.startButton}
              onPress={startWorkout}
            >
              <Text style={styles.startButtonText}>Start Workout</Text>
            </TouchableOpacity>
          )}
        </View>

        {hasExercises ? (
          <>
            {currentDayData.exercises.map(exercise =>
              renderExercise(currentDay, exercise)
            )}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateEmoji}>💪</Text>
            <Text style={styles.emptyStateText}>No exercises planned for {currentDay}</Text>
            <Text style={styles.emptyStateSubtext}>
              Add exercises to build your workout
            </Text>
          </View>
        )}

        {!activeWorkout && (
          <TouchableOpacity
            style={styles.addExerciseButton}
            onPress={handleAddExercise}
          >
            <Text style={styles.addExerciseButtonText}>+ Add Exercise</Text>
          </TouchableOpacity>
        )}

        {activeWorkout && (
          <View style={styles.workoutActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={cancelWorkout}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.finishButton]}
              onPress={finishWorkout}
            >
              <Text style={styles.finishButtonText}>Finish Workout</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Completion Modal */}
      <Modal
        visible={showCompletionModal}
        animationType="fade"
        transparent
        onRequestClose={() => {
          setShowCompletionModal(false);
          setActiveWorkout(null);
          setWorkoutStartTime(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.completionModal}>
            <Text style={styles.completionEmoji}>🎉</Text>
            <Text style={styles.completionTitle}>Workout Complete!</Text>
            <Text style={styles.completionText}>
              Great job finishing your workout!
            </Text>
            <TouchableOpacity
              style={styles.completionButton}
              onPress={() => {
                setShowCompletionModal(false);
                setActiveWorkout(null);
                setWorkoutStartTime(null);
              }}
            >
              <Text style={styles.completionButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.textPrimary,
  },
  activeWorkoutBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    marginTop: SPACING.sm,
    alignSelf: 'flex-start',
  },
  activeWorkoutText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.weights.semiBold,
  },
  daySelector: {
    marginBottom: SPACING.md,
  },
  daySelectorContent: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  dayButton: {
    backgroundColor: COLORS.cardBackground,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    minWidth: 60,
    alignItems: 'center',
    position: 'relative',
  },
  dayButtonActive: {
    backgroundColor: COLORS.primary,
  },
  dayButtonText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.weights.semiBold,
  },
  dayButtonTextActive: {
    color: COLORS.white,
  },
  dayBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayBadgeText: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.weights.bold,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  dayTitle: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.textPrimary,
  },
  startButton: {
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  startButtonText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.weights.semiBold,
  },
  exerciseCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  exerciseName: {
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.weights.semiBold,
  },
  exerciseMuscle: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.primary,
    marginTop: SPACING.xs,
  },
  removeButton: {
    padding: SPACING.xs,
  },
  removeButtonText: {
    fontSize: 20,
  },
  setsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.sm,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  setsHeaderText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.weights.semiBold,
    flex: 1,
    textAlign: 'center',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  setNumber: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.textPrimary,
    width: 30,
    textAlign: 'center',
  },
  setInput: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.sm,
    marginHorizontal: SPACING.xs,
    textAlign: 'center',
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.textPrimary,
  },
  checkButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkButtonCompleted: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  checkButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: TYPOGRAPHY.weights.bold,
  },
  addSetButton: {
    marginTop: SPACING.sm,
    padding: SPACING.sm,
    alignItems: 'center',
  },
  addSetButtonText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.weights.semiBold,
  },
  emptyState: {
    alignItems: 'center',
    padding: SPACING.xxl,
    marginTop: SPACING.xxl,
  },
  emptyStateEmoji: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyStateText: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.semiBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  emptyStateSubtext: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  addExerciseButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginVertical: SPACING.lg,
    ...SHADOWS.medium,
  },
  addExerciseButtonText: {
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.weights.bold,
  },
  workoutActions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginVertical: SPACING.lg,
  },
  actionButton: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  cancelButton: {
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelButtonText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.weights.semiBold,
  },
  finishButton: {
    backgroundColor: COLORS.success,
  },
  finishButtonText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.weights.bold,
  },
  // Completion Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completionModal: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xxl,
    alignItems: 'center',
    width: '80%',
    ...SHADOWS.large,
  },
  completionEmoji: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  completionTitle: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  completionText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  completionButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    ...SHADOWS.medium,
  },
  completionButtonText: {
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.weights.bold,
  },
});

export default ProgrammeScreen;
