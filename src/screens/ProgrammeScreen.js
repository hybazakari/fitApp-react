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
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, TYPOGRAPHY, COMMON_STYLES } from '../constants/theme';
import SafeHeader from '../components/SafeHeader';

const { width } = Dimensions.get('window');
const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_ABBREVIATIONS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const ProgrammeScreen = ({ navigation }) => {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
  const [workoutPlan, setWorkoutPlan] = useState({});
  const [workoutHistory, setWorkoutHistory] = useState({});
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
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
      console.error('Error loading data:', error);
    }
  };

  const saveWorkoutPlan = async () => {
    try {
      await AsyncStorage.setItem('@myfit_workout_plan_v2', JSON.stringify(workoutPlan));
    } catch (error) {
      console.error('Error saving workout plan:', error);
    }
  };

  const removeExercise = (day, exerciseId) => {
    setWorkoutPlan(prev => ({
      ...prev,
      [day]: {
        exercises: prev[day].exercises.filter(ex => ex.id !== exerciseId)
      }
    }));
  };

  const updateSet = (day, exerciseId, setIndex, field, value) => {
    setWorkoutPlan(prev => ({
      ...prev,
      [day]: {
        exercises: prev[day].exercises.map(ex => {
          if (ex.id === exerciseId) {
            const newSets = [...ex.sets];
            newSets[setIndex] = { ...newSets[setIndex], [field]: value };
            return { ...ex, sets: newSets };
          }
          return ex;
        })
      }
    }));
  };

  const handleAddExercise = () => {
    navigation.navigate('ExerciseLibrary', {
      onSelectExercise: (exercise) => {
        const currentDay = DAYS_OF_WEEK[selectedDay];
        const newExercise = {
          id: Date.now().toString(),
          name: exercise.name,
          sets: [
            { set: 1, reps: '', weight: '' },
            { set: 2, reps: '', weight: '' },
            { set: 3, reps: '', weight: '' },
          ],
        };

        setWorkoutPlan(prev => ({
          ...prev,
          [currentDay]: {
            exercises: [...(prev[currentDay]?.exercises || []), newExercise]
          }
        }));
      },
      userLocation: 'gym',
    });
  };

  const handleCompleteWorkout = async () => {
    try {
      const currentDay = DAYS_OF_WEEK[selectedDay];
      const dayData = workoutPlan[currentDay];

      if (!dayData || dayData.exercises.length === 0) {
        Alert.alert('No Exercises', 'Please add exercises before completing the workout.');
        return;
      }

      const hasData = dayData.exercises.some(ex => 
        ex.sets.some(set => set.reps || set.weight)
      );

      if (!hasData) {
        Alert.alert('No Data', 'Please fill in at least some reps or weights.');
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      const workoutEntry = {
        date: today,
        day: currentDay,
        exercises: dayData.exercises.map(ex => ({
          name: ex.name,
          sets: ex.sets.filter(set => set.reps || set.weight)
        })),
        timestamp: new Date().toISOString()
      };

      const historyJson = await AsyncStorage.getItem('@myfit_workout_history');
      const history = historyJson ? JSON.parse(historyJson) : {};

      if (!history[today]) {
        history[today] = [];
      }
      history[today].push(workoutEntry);

      await AsyncStorage.setItem('@myfit_workout_history', JSON.stringify(history));
      setShowCompletionModal(true);

      setTimeout(() => {
        setShowCompletionModal(false);
        navigation.navigate('Progress');
      }, 2000);

    } catch (error) {
      console.error('Error completing workout:', error);
      Alert.alert('Error', 'Failed to save workout. Please try again.');
    }
  };

  // ✅ OPTIMISÉ : Rendu compact du set avec Reps et Weight côte à côte
  const renderSet = (day, exercise, set, setIndex) => (
    <View key={setIndex} style={styles.setRow}>
      <View style={styles.setNumberContainer}>
        <Text style={styles.setNumber}>{set.set}</Text>
      </View>
      
      {/* Reps Input */}
      <TextInput
        style={[styles.setInput, styles.repsInput]}
        placeholder="Reps"
        placeholderTextColor={COLORS.textSecondary}
        value={String(set.reps || '')}
        onChangeText={(text) => updateSet(day, exercise.id, setIndex, 'reps', text)}
        keyboardType="numeric"
      />

      {/* Weight Input - Côte à côte avec Reps */}
      <TextInput
        style={[styles.setInput, styles.weightInput]}
        placeholder="Kg"
        placeholderTextColor={COLORS.textSecondary}
        value={String(set.weight || '')}
        onChangeText={(text) => updateSet(day, exercise.id, setIndex, 'weight', text)}
        keyboardType="decimal-pad"
      />
    </View>
  );

  const renderExercises = () => {
    const currentDay = DAYS_OF_WEEK[selectedDay];
    const dayData = workoutPlan[currentDay] || { exercises: [] };

    if (dayData.exercises.length === 0) {
      return (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="barbell-outline" size={48} color={COLORS.textSecondary} />
          </View>
          <Text style={styles.emptyStateText}>No exercises yet</Text>
          
          <TouchableOpacity 
            style={styles.addExerciseButton}
            onPress={handleAddExercise}
          >
            <Ionicons name="add-circle" size={24} color={COLORS.white} style={{ marginRight: SPACING.sm }} />
            <Text style={styles.addExerciseButtonText}>Add Exercise</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <>
        {dayData.exercises.map((exercise) => (
          <View key={exercise.id} style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
              </View>
              <TouchableOpacity 
                onPress={() => removeExercise(currentDay, exercise.id)}
                style={styles.deleteButton}
              >
                <Ionicons name="trash-outline" size={18} color={COLORS.error} />
              </TouchableOpacity>
            </View>

            {/* Sets compacts */}
            <View style={styles.setsContainer}>
              {exercise.sets && exercise.sets.map((set, index) => renderSet(currentDay, exercise, set, index))}
            </View>
          </View>
        ))}

        <TouchableOpacity 
          style={styles.completeWorkoutButton}
          onPress={handleCompleteWorkout}
        >
          <Ionicons name="checkmark-circle" size={22} color={COLORS.white} style={{ marginRight: SPACING.sm }} />
          <Text style={styles.completeWorkoutButtonText}>Complete Workout</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.floatingAddButton} onPress={handleAddExercise}>
          <Ionicons name="add" size={28} color={COLORS.white} />
        </TouchableOpacity>
      </>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeHeader 
        navigation={navigation} 
        title="Workout" 
        subtitle={DAYS_OF_WEEK[selectedDay]}
      />
      
      {/* ✅ OPTIMISÉ : Jour Selector ultra-compact */}
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
              selectedDay === index && styles.dayButtonActive
            ]} 
            onPress={() => setSelectedDay(index)}
          >
            <Text style={[
              styles.dayButtonText, 
              selectedDay === index && styles.dayButtonTextActive
            ]}>
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView 
          style={{ flex: 1 }} 
          contentContainerStyle={styles.exercisesList}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {renderExercises()}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Completion Modal */}
      <Modal visible={showCompletionModal} animationType="fade" transparent onRequestClose={() => setShowCompletionModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.completionModal}>
            <Text style={styles.completionEmoji}>🎉</Text>
            <Text style={styles.completionTitle}>Workout Complete!</Text>
            <Text style={styles.completionSubtitle}>Great job! Your progress has been saved.</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ✅ OPTIMISÉ : Header compact
  header: { 
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: SPACING.sm,
    marginRight: SPACING.sm,
  },
  headerTitle: { 
    fontSize: TYPOGRAPHY.sizes.lg, 
    fontWeight: TYPOGRAPHY.weights.bold, 
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },

  // ✅ OPTIMISÉ : Jour selector ultra-compact
  daySelector: { 
    maxHeight: 48,
    backgroundColor: COLORS.background,
  },
  daySelectorContent: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    gap: SPACING.xs,
  },
  dayButton: { 
    backgroundColor: COLORS.cardBackground, 
    paddingHorizontal: SPACING.md, 
    paddingVertical: SPACING.sm, 
    borderRadius: BORDER_RADIUS.md,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dayButtonActive: { 
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dayButtonText: { 
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.weights.semiBold,
    fontSize: TYPOGRAPHY.sizes.xs,
  },
  dayButtonTextActive: { 
    color: COLORS.white,
  },

  // ✅ OPTIMISÉ : Exercise list avec plus d'espace
  exercisesList: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    paddingBottom: 140,
  },

  // ✅ OPTIMISÉ : Exercise card compact
  exerciseCard: { 
    backgroundColor: COLORS.white, 
    borderRadius: BORDER_RADIUS.md, 
    padding: SPACING.md, 
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  exerciseHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  exerciseName: { 
    fontSize: TYPOGRAPHY.sizes.base, 
    color: COLORS.textPrimary, 
    fontWeight: TYPOGRAPHY.weights.semiBold,
  },
  deleteButton: {
    padding: SPACING.xs,
  },

  // ✅ OPTIMISÉ : Sets container compact
  setsContainer: {
    gap: SPACING.xs,
  },
  setRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: SPACING.xs,
  },
  setNumberContainer: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setNumber: { 
    textAlign: 'center', 
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.weights.bold,
    fontSize: TYPOGRAPHY.sizes.xs,
  },
  setInput: { 
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.sm, 
    padding: SPACING.sm,
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  repsInput: {
    flex: 2,
  },
  weightInput: {
    flex: 1.5,
  },

  // Empty state
  emptyState: { 
    alignItems: 'center', 
    paddingVertical: SPACING.xxl,
    marginTop: SPACING.xl,
  },
  emptyIconContainer: {
    marginBottom: SPACING.lg,
  },
  emptyStateText: { 
    fontSize: TYPOGRAPHY.sizes.lg, 
    color: COLORS.textSecondary, 
    fontWeight: TYPOGRAPHY.weights.semiBold,
    marginBottom: SPACING.md,
  },
  addExerciseButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.lg,
  },
  addExerciseButtonText: {
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.weights.semiBold,
    fontSize: TYPOGRAPHY.sizes.sm,
  },

  // Buttons
  completeWorkoutButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.success,
    margin: SPACING.lg,
    marginTop: SPACING.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  completeWorkoutButtonText: {
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.weights.bold,
    fontSize: TYPOGRAPHY.sizes.base,
  },
  floatingAddButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.large,
  },

  // Modal
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  completionModal: { 
    backgroundColor: COLORS.white, 
    borderRadius: BORDER_RADIUS.xl, 
    padding: SPACING.xxl, 
    alignItems: 'center',
    width: '85%',
    ...SHADOWS.large,
  },
  completionEmoji: { 
    fontSize: 56, 
    marginBottom: SPACING.md,
  },
  completionTitle: { 
    fontSize: TYPOGRAPHY.sizes.lg, 
    fontWeight: TYPOGRAPHY.weights.bold, 
    color: COLORS.textPrimary, 
    marginBottom: SPACING.sm,
  },
  completionSubtitle: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default ProgrammeScreen;