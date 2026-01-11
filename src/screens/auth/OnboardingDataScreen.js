import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TYPOGRAPHY, COLORS, SPACING, BORDER_RADIUS, SHADOWS, COMMON_STYLES } from '../../constants/theme';
import { useUser } from '../../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OnboardingDataScreen = ({ navigation }) => {
  const { completeOnboarding } = useUser();
  const [formData, setFormData] = useState({
    gender: 'male',
    age: '',
    weight: '',
    height: '',
    goal: 'maintenance',
    activityLevel: 'moderate',
  });
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleComplete = async () => {
    // Validation
    if (!formData.age || !formData.weight || !formData.height) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsLoading(true);

    try {
      // Convert units and prepare final profile
      let weight = parseFloat(formData.weight);
      let height = parseFloat(formData.height);

      const finalProfile = {
        ...formData,
        weight,
        height,
        age: parseInt(formData.age),
        createdAt: new Date().toISOString(),
      };

      // ✅ CRITICAL: Call completeOnboarding from UserContext
      const result = await completeOnboarding(finalProfile);

      if (result.success) {
        // ✅ SUCCESS: Navigation happens automatically via AppNavigator
        Alert.alert(
          'Succès!', 
          'Votre profil a été créé. Bienvenue sur MyFit! 🎉',
          [{ text: 'OK' }]
        );
        // NO manual navigation needed - AppNavigator will detect hasCompletedOnboarding change
      } else {
        Alert.alert('Erreur', result.error || 'Impossible de sauvegarder le profil');
      }
    } catch (error) {
      console.error('Onboarding error:', error);
      Alert.alert('Erreur', 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="fitness-outline" size={48} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>Welcome to MyFit</Text>
          <Text style={styles.subtitle}>
            Let's create your profile to calculate personalized goals
          </Text>
        </View>

        {/* Genre */}
        <Text style={styles.label}>Gender *</Text>
        <View style={styles.optionsRow}>
          <TouchableOpacity
            style={[styles.optionButton, formData.gender === 'male' && styles.optionButtonActive]}
            onPress={() => updateField('gender', 'male')}
          >
            <Ionicons 
              name="male-outline" 
              size={24} 
              color={formData.gender === 'male' ? COLORS.textWhite : COLORS.textSecondary} 
              style={{ marginBottom: SPACING.xs }}
            />
            <Text style={[styles.optionText, formData.gender === 'male' && styles.optionTextActive]}>
              Male
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, formData.gender === 'female' && styles.optionButtonActive]}
            onPress={() => updateField('gender', 'female')}
          >
            <Ionicons 
              name="female-outline" 
              size={24} 
              color={formData.gender === 'female' ? COLORS.textWhite : COLORS.textSecondary} 
              style={{ marginBottom: SPACING.xs }}
            />
            <Text style={[styles.optionText, formData.gender === 'female' && styles.optionTextActive]}>
              Female
            </Text>
          </TouchableOpacity>
        </View>

        {/* Âge */}
        <Text style={styles.label}>Age (years) *</Text>
        <TextInput
          style={styles.input}
          value={formData.age}
          onChangeText={(text) => updateField('age', text)}
          placeholder="Ex: 25"
          keyboardType="number-pad"
        />

        {/* Poids */}
        <Text style={styles.label}>Weight (kg) *</Text>
        <TextInput
          style={styles.input}
          value={formData.weight}
          onChangeText={(text) => updateField('weight', text)}
          placeholder="Ex: 70"
          keyboardType="decimal-pad"
        />

        {/* Taille */}
        <Text style={styles.label}>Height (cm) *</Text>
        <TextInput
          style={styles.input}
          value={formData.height}
          onChangeText={(text) => updateField('height', text)}
          placeholder="Ex: 175"
          keyboardType="number-pad"
        />

        {/* Objectif */}
        <Text style={styles.label}>Goal *</Text>
        <TouchableOpacity
          style={[styles.goalCard, formData.goal === 'weightLoss' && styles.goalCardActive]}
          onPress={() => updateField('goal', 'weightLoss')}
        >
          <View style={styles.goalIconContainer}>
            <Ionicons 
              name="flame-outline" 
              size={28} 
              color={formData.goal === 'weightLoss' ? COLORS.primary : COLORS.textSecondary} 
            />
          </View>
          <View style={styles.goalContent}>
            <Text style={[styles.goalTitle, formData.goal === 'weightLoss' && styles.goalTitleActive]}>Weight Loss</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.goalCard, formData.goal === 'maintenance' && styles.goalCardActive]}
          onPress={() => updateField('goal', 'maintenance')}
        >
          <View style={styles.goalIconContainer}>
            <Ionicons 
              name="scale-outline" 
              size={28} 
              color={formData.goal === 'maintenance' ? COLORS.primary : COLORS.textSecondary} 
            />
          </View>
          <View style={styles.goalContent}>
            <Text style={[styles.goalTitle, formData.goal === 'maintenance' && styles.goalTitleActive]}>Maintenance</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.goalCard, formData.goal === 'muscleGain' && styles.goalCardActive]}
          onPress={() => updateField('goal', 'muscleGain')}
        >
          <View style={styles.goalIconContainer}>
            <Ionicons 
              name="barbell-outline" 
              size={28} 
              color={formData.goal === 'muscleGain' ? COLORS.primary : COLORS.textSecondary} 
            />
          </View>
          <View style={styles.goalContent}>
            <Text style={[styles.goalTitle, formData.goal === 'muscleGain' && styles.goalTitleActive]}>Muscle Gain</Text>
          </View>
        </TouchableOpacity>

        {/* Niveau d'activité */}
        <Text style={styles.label}>Activity Level *</Text>
        <TouchableOpacity
          style={[styles.activityCard, formData.activityLevel === 'sedentary' && styles.activityCardActive]}
          onPress={() => updateField('activityLevel', 'sedentary')}
        >
          <Text style={styles.activityTitle}>Sedentary</Text>
          <Text style={styles.activityDescription}>Little or no exercise</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.activityCard, formData.activityLevel === 'light' && styles.activityCardActive]}
          onPress={() => updateField('activityLevel', 'light')}
        >
          <Text style={styles.activityTitle}>Light</Text>
          <Text style={styles.activityDescription}>Exercise 1-3 days/week</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.activityCard, formData.activityLevel === 'moderate' && styles.activityCardActive]}
          onPress={() => updateField('activityLevel', 'moderate')}
        >
          <Text style={styles.activityTitle}>Moderate</Text>
          <Text style={styles.activityDescription}>Exercise 3-5 days/week</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.activityCard, formData.activityLevel === 'active' && styles.activityCardActive]}
          onPress={() => updateField('activityLevel', 'active')}
        >
          <Text style={styles.activityTitle}>Active</Text>
          <Text style={styles.activityDescription}>Exercise 6-7 days/week</Text>
        </TouchableOpacity>

        {/* Submit Button */}
        <TouchableOpacity 
          style={[styles.submitButton, isLoading && { opacity: 0.6 }]} 
          onPress={handleComplete}
          disabled={isLoading}
        >
          <Text style={styles.submitButtonText}>
            {isLoading ? 'Loading...' : 'Get Started'}
          </Text>
        </TouchableOpacity>

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
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.base,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    ...COMMON_STYLES.h1,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...COMMON_STYLES.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  label: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.weights.semiBold,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  input: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginHorizontal: SPACING.lg,
    ...TYPOGRAPHY.body,
    ...COMMON_STYLES.input,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  optionButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  optionButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  optionText: {
    ...COMMON_STYLES.bodyMedium,
  },
  optionTextActive: {
    color: COLORS.textWhite,
  },
  goalCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    borderWidth: 2,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  goalCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  goalIconContainer: {
    marginRight: SPACING.base,
  },
  goalContent: {
    flex: 1,
  },
  goalTitle: {
    ...COMMON_STYLES.bodyBold,
  },
  goalTitleActive: {
    color: COLORS.primary,
  },
  activityCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    borderWidth: 2,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  activityCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  activityTitle: {
    ...COMMON_STYLES.bodyBold,
    marginBottom: SPACING.xs,
  },
  activityDescription: {
    ...COMMON_STYLES.caption,
  },
  submitButton: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  submitButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.buttonText,
    fontWeight: TYPOGRAPHY.weights.bold,
  },
  bottomSpacer: {
    height: SPACING.xl,
  },
});

export default OnboardingDataScreen;