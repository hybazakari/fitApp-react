import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import {
  MUSCLE_GROUPS,
  EQUIPMENT,
  DIFFICULTY,
  smartFilterExercises,
  getExerciseById,
} from '../../data/exerciseDatabase';

const ExerciseLibraryScreen = ({ route, navigation }) => {
  const { onSelectExercise, userLocation } = route.params || {};
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    filterExercises();
  }, [searchQuery, selectedMuscleGroup, selectedDifficulty]);

  const filterExercises = () => {
    const filtered = smartFilterExercises({
      query: searchQuery,
      muscleGroup: selectedMuscleGroup,
      difficulty: selectedDifficulty,
      location: userLocation,
    });
    setExercises(filtered);
  };

  const handleExercisePress = (exercise) => {
    setSelectedExercise(exercise);
    setShowDetailModal(true);
  };

  const handleSelectExercise = () => {
    if (onSelectExercise && selectedExercise) {
      onSelectExercise(selectedExercise);
      navigation.goBack();
    } else {
      setShowDetailModal(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case DIFFICULTY.BEGINNER:
        return COLORS.success;
      case DIFFICULTY.INTERMEDIATE:
        return COLORS.warning;
      case DIFFICULTY.ADVANCED:
        return COLORS.error;
      default:
        return COLORS.textSecondary;
    }
  };

  const renderExerciseCard = ({ item }) => (
    <TouchableOpacity
      style={styles.exerciseCard}
      onPress={() => handleExercisePress(item)}
    >
      <View style={styles.exerciseHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.exerciseName}>{item.name}</Text>
          <Text style={styles.exerciseMuscleGroup}>{item.muscleGroup}</Text>
        </View>
        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(item.difficulty) + '20' }]}>
          <Text style={[styles.difficultyText, { color: getDifficultyColor(item.difficulty) }]}>
            {item.difficulty}
          </Text>
        </View>
      </View>
      
      <View style={styles.exerciseDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Equipment:</Text>
          <Text style={styles.detailValue}>{item.equipment.join(', ')}</Text>
        </View>
        {item.secondaryMuscles.length > 0 && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Secondary:</Text>
            <Text style={styles.detailValue}>{item.secondaryMuscles.join(', ')}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderDetailModal = () => {
    if (!selectedExercise) return null;

    return (
      <Modal
        visible={showDetailModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowDetailModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowDetailModal(false)}>
              <Text style={styles.modalCloseButton}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{selectedExercise.name}</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.modalSection}>
              <View style={styles.modalInfoRow}>
                <View style={styles.modalInfoItem}>
                  <Text style={styles.modalInfoLabel}>Muscle Group</Text>
                  <Text style={styles.modalInfoValue}>{selectedExercise.muscleGroup}</Text>
                </View>
                <View style={styles.modalInfoItem}>
                  <Text style={styles.modalInfoLabel}>Difficulty</Text>
                  <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(selectedExercise.difficulty) + '20' }]}>
                    <Text style={[styles.difficultyText, { color: getDifficultyColor(selectedExercise.difficulty) }]}>
                      {selectedExercise.difficulty}
                    </Text>
                  </View>
                </View>
                <View style={styles.modalInfoItem}>
                  <Text style={styles.modalInfoLabel}>Location</Text>
                  <Text style={styles.modalInfoValue}>{selectedExercise.location}</Text>
                </View>
              </View>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Equipment Needed</Text>
              <View style={styles.equipmentTags}>
                {selectedExercise.equipment.map((eq, index) => (
                  <View key={index} style={styles.equipmentTag}>
                    <Text style={styles.equipmentTagText}>{eq}</Text>
                  </View>
                ))}
              </View>
            </View>

            {selectedExercise.secondaryMuscles.length > 0 && (
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Secondary Muscles</Text>
                <View style={styles.equipmentTags}>
                  {selectedExercise.secondaryMuscles.map((muscle, index) => (
                    <View key={index} style={[styles.equipmentTag, styles.secondaryMuscleTag]}>
                      <Text style={styles.equipmentTagText}>{muscle}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Instructions</Text>
              {selectedExercise.instructions.map((instruction, index) => (
                <View key={index} style={styles.instructionItem}>
                  <View style={styles.instructionNumber}>
                    <Text style={styles.instructionNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.instructionText}>{instruction}</Text>
                </View>
              ))}
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Tips & Form Cues</Text>
              {selectedExercise.tips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <Text style={styles.tipBullet}>💡</Text>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          </ScrollView>

          {onSelectExercise && (
            <TouchableOpacity style={styles.addButton} onPress={handleSelectExercise}>
              <Text style={styles.addButtonText}>Add to Workout</Text>
            </TouchableOpacity>
          )}
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Exercise Library</Text>
        <Text style={styles.headerSubtitle}>{exercises.length} exercises</Text>
      </View>

      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search exercises..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={COLORS.textSecondary}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterScrollContent}
      >
        <Text style={styles.filterLabel}>Muscle:</Text>
        <TouchableOpacity
          style={[styles.filterChip, !selectedMuscleGroup && styles.filterChipActive]}
          onPress={() => setSelectedMuscleGroup(null)}
        >
          <Text style={[styles.filterChipText, !selectedMuscleGroup && styles.filterChipTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        {Object.values(MUSCLE_GROUPS).map((group) => (
          <TouchableOpacity
            key={group}
            style={[
              styles.filterChip,
              selectedMuscleGroup === group && styles.filterChipActive,
            ]}
            onPress={() => setSelectedMuscleGroup(group)}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedMuscleGroup === group && styles.filterChipTextActive,
              ]}
            >
              {group}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterScrollContent}
      >
        <Text style={styles.filterLabel}>Level:</Text>
        <TouchableOpacity
          style={[styles.filterChip, !selectedDifficulty && styles.filterChipActive]}
          onPress={() => setSelectedDifficulty(null)}
        >
          <Text style={[styles.filterChipText, !selectedDifficulty && styles.filterChipTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        {Object.values(DIFFICULTY).map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.filterChip,
              selectedDifficulty === level && styles.filterChipActive,
            ]}
            onPress={() => setSelectedDifficulty(level)}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedDifficulty === level && styles.filterChipTextActive,
              ]}
            >
              {level}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={exercises}
        renderItem={renderExerciseCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.exerciseList}
        showsVerticalScrollIndicator={false}
      />

      {renderDetailModal()}
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
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  searchSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  searchInput: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
  },
  filterScroll: {
    marginBottom: SPACING.sm,
  },
  filterScrollContent: {
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  filterLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.weights.semiBold,
    marginRight: SPACING.xs,
  },
  filterChip: {
    backgroundColor: COLORS.cardBackground,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  filterChipTextActive: {
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.weights.semiBold,
  },
  exerciseList: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
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
    marginBottom: SPACING.sm,
  },
  exerciseName: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.weights.semiBold,
    marginBottom: SPACING.xs,
  },
  exerciseMuscleGroup: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
  },
  difficultyBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  difficultyText: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    fontWeight: TYPOGRAPHY.weights.semiBold,
  },
  exerciseDetails: {
    gap: SPACING.xs,
  },
  detailRow: {
    flexDirection: 'row',
  },
  detailLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginRight: SPACING.xs,
    fontWeight: TYPOGRAPHY.weights.semiBold,
  },
  detailValue: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textPrimary,
    flex: 1,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalCloseButton: {
    fontSize: 24,
    color: COLORS.textPrimary,
  },
  modalTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  modalContent: {
    flex: 1,
    padding: SPACING.lg,
  },
  modalSection: {
    marginBottom: SPACING.xl,
  },
  modalSectionTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  modalInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  modalInfoItem: {
    flex: 1,
    alignItems: 'center',
  },
  modalInfoLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  modalInfoValue: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.weights.semiBold,
  },
  equipmentTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  equipmentTag: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
  },
  secondaryMuscleTag: {
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  equipmentTagText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.weights.semiBold,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    backgroundColor: COLORS.cardBackground,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  instructionNumberText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.weights.bold,
  },
  instructionText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    flex: 1,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  tipBullet: {
    fontSize: 16,
    marginRight: SPACING.sm,
  },
  tipText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    flex: 1,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    margin: SPACING.lg,
    ...SHADOWS.medium,
  },
  addButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.weights.bold,
  },
});

export default ExerciseLibraryScreen;
