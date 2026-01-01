import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { useUser } from '../../context/UserContext';

const OnboardingScreen = ({ navigation }) => {
  const { completeOnboarding } = useUser();
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState({
    // Step 2: Biometrics
    gender: 'male',
    age: '',
    weight: '',
    height: '',
    weightUnit: 'kg',
    heightUnit: 'cm',
    
    // Step 3: Goals & Lifestyle
    goal: 'maintenance',
    trainingLocation: 'gym',
    
    // Step 4: Activity Level
    activityLevel: 'moderate',
    workoutsPerWeek: 3,
  });

  const updateField = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!validateBiometrics()) return;
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    } else if (step === 4) {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const validateBiometrics = () => {
    const { age, weight, height } = profileData;
    
    if (!age || !weight || !height) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return false;
    }
    
    if (parseInt(age) < 13 || parseInt(age) > 120) {
      Alert.alert('Invalid Age', 'Please enter a valid age (13-120)');
      return false;
    }
    
    return true;
  };

  const handleComplete = async () => {
    // Convert units to metric if needed
    let weight = parseFloat(profileData.weight);
    let height = parseFloat(profileData.height);
    
    if (profileData.weightUnit === 'lbs') {
      weight = weight * 0.453592; // Convert lbs to kg
    }
    
    if (profileData.heightUnit === 'inches') {
      height = height * 2.54; // Convert inches to cm
    }

    const finalProfile = {
      ...profileData,
      weight,
      height,
      age: parseInt(profileData.age),
      createdAt: new Date().toISOString(),
    };

    const result = await completeOnboarding(finalProfile);
    
    if (result.success) {
      // Navigation will be handled by App.js based on hasCompletedOnboarding
    } else {
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    }
  };

  const renderWelcome = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.emoji}>🎯</Text>
      <Text style={styles.title}>Welcome to MyFit!</Text>
      <Text style={styles.subtitle}>
        Your personal fitness companion for tracking nutrition, workouts, and achieving your goals.
      </Text>
      
      <View style={styles.featuresList}>
        <View style={styles.featureItem}>
          <Text style={styles.featureEmoji}>🍎</Text>
          <Text style={styles.featureText}>Track your daily nutrition with precision</Text>
        </View>
        
        <View style={styles.featureItem}>
          <Text style={styles.featureEmoji}>💪</Text>
          <Text style={styles.featureText}>Build personalized workout programs</Text>
        </View>
        
        <View style={styles.featureItem}>
          <Text style={styles.featureEmoji}>📊</Text>
          <Text style={styles.featureText}>Monitor your progress with detailed charts</Text>
        </View>
        
        <View style={styles.featureItem}>
          <Text style={styles.featureEmoji}>🏆</Text>
          <Text style={styles.featureText}>Earn achievements and build streaks</Text>
        </View>
      </View>
      
      <Text style={styles.disclaimer}>
        Let's get started by setting up your profile. This will help us calculate your personalized nutrition targets.
      </Text>
    </View>
  );

  const renderBiometrics = () => (
    <ScrollView style={styles.stepContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.stepTitle}>Tell us about yourself</Text>
      <Text style={styles.stepSubtitle}>
        We'll use this information to calculate your daily calorie and macro targets.
      </Text>

      {/* Gender Selection */}
      <Text style={styles.label}>Gender</Text>
      <View style={styles.optionsRow}>
        <TouchableOpacity
          style={[styles.optionButton, profileData.gender === 'male' && styles.optionButtonActive]}
          onPress={() => updateField('gender', 'male')}
        >
          <Text style={[styles.optionText, profileData.gender === 'male' && styles.optionTextActive]}>
            👨 Male
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.optionButton, profileData.gender === 'female' && styles.optionButtonActive]}
          onPress={() => updateField('gender', 'female')}
        >
          <Text style={[styles.optionText, profileData.gender === 'female' && styles.optionTextActive]}>
            👩 Female
          </Text>
        </TouchableOpacity>
      </View>

      {/* Age */}
      <Text style={styles.label}>Age</Text>
      <TextInput
        style={styles.input}
        value={profileData.age}
        onChangeText={(text) => updateField('age', text)}
        placeholder="Enter your age"
        keyboardType="numeric"
        maxLength={3}
      />

      {/* Weight */}
      <Text style={styles.label}>Weight</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, styles.inputWithUnit]}
          value={profileData.weight}
          onChangeText={(text) => updateField('weight', text)}
          placeholder="Enter weight"
          keyboardType="decimal-pad"
        />
        <View style={styles.unitToggle}>
          <TouchableOpacity
            style={[styles.unitButton, profileData.weightUnit === 'kg' && styles.unitButtonActive]}
            onPress={() => updateField('weightUnit', 'kg')}
          >
            <Text style={[styles.unitText, profileData.weightUnit === 'kg' && styles.unitTextActive]}>kg</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.unitButton, profileData.weightUnit === 'lbs' && styles.unitButtonActive]}
            onPress={() => updateField('weightUnit', 'lbs')}
          >
            <Text style={[styles.unitText, profileData.weightUnit === 'lbs' && styles.unitTextActive]}>lbs</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Height */}
      <Text style={styles.label}>Height</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, styles.inputWithUnit]}
          value={profileData.height}
          onChangeText={(text) => updateField('height', text)}
          placeholder="Enter height"
          keyboardType="decimal-pad"
        />
        <View style={styles.unitToggle}>
          <TouchableOpacity
            style={[styles.unitButton, profileData.heightUnit === 'cm' && styles.unitButtonActive]}
            onPress={() => updateField('heightUnit', 'cm')}
          >
            <Text style={[styles.unitText, profileData.heightUnit === 'cm' && styles.unitTextActive]}>cm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.unitButton, profileData.heightUnit === 'inches' && styles.unitButtonActive]}
            onPress={() => updateField('heightUnit', 'inches')}
          >
            <Text style={[styles.unitText, profileData.heightUnit === 'inches' && styles.unitTextActive]}>in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  const renderGoals = () => (
    <ScrollView style={styles.stepContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.stepTitle}>What's your goal?</Text>
      <Text style={styles.stepSubtitle}>
        This will help us customize your nutrition and workout recommendations.
      </Text>

      {/* Fitness Goal */}
      <TouchableOpacity
        style={[styles.goalCard, profileData.goal === 'weightLoss' && styles.goalCardActive]}
        onPress={() => updateField('goal', 'weightLoss')}
      >
        <Text style={styles.goalEmoji}>🔥</Text>
        <View style={styles.goalContent}>
          <Text style={styles.goalTitle}>Weight Loss</Text>
          <Text style={styles.goalDescription}>
            Lose fat while preserving muscle. Higher protein, calorie deficit.
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.goalCard, profileData.goal === 'maintenance' && styles.goalCardActive]}
        onPress={() => updateField('goal', 'maintenance')}
      >
        <Text style={styles.goalEmoji}>⚖️</Text>
        <View style={styles.goalContent}>
          <Text style={styles.goalTitle}>Maintenance</Text>
          <Text style={styles.goalDescription}>
            Maintain current weight and stay healthy. Balanced macros.
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.goalCard, profileData.goal === 'muscleGain' && styles.goalCardActive]}
        onPress={() => updateField('goal', 'muscleGain')}
      >
        <Text style={styles.goalEmoji}>💪</Text>
        <View style={styles.goalContent}>
          <Text style={styles.goalTitle}>Muscle Gain</Text>
          <Text style={styles.goalDescription}>
            Build muscle mass. Higher carbs, calorie surplus.
          </Text>
        </View>
      </TouchableOpacity>

      {/* Training Location */}
      <Text style={[styles.label, { marginTop: SPACING.xl }]}>Where do you train?</Text>
      <View style={styles.optionsRow}>
        <TouchableOpacity
          style={[styles.optionButton, profileData.trainingLocation === 'gym' && styles.optionButtonActive]}
          onPress={() => updateField('trainingLocation', 'gym')}
        >
          <Text style={[styles.optionText, profileData.trainingLocation === 'gym' && styles.optionTextActive]}>
            🏋️ Gym
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.optionButton, profileData.trainingLocation === 'home' && styles.optionButtonActive]}
          onPress={() => updateField('trainingLocation', 'home')}
        >
          <Text style={[styles.optionText, profileData.trainingLocation === 'home' && styles.optionTextActive]}>
            🏠 Home
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderActivityLevel = () => (
    <ScrollView style={styles.stepContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.stepTitle}>Activity Level</Text>
      <Text style={styles.stepSubtitle}>
        How active are you in your daily life? This affects your calorie needs.
      </Text>

      <TouchableOpacity
        style={[styles.activityCard, profileData.activityLevel === 'sedentary' && styles.activityCardActive]}
        onPress={() => updateField('activityLevel', 'sedentary')}
      >
        <Text style={styles.activityTitle}>Sedentary</Text>
        <Text style={styles.activityDescription}>Little or no exercise, desk job</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.activityCard, profileData.activityLevel === 'light' && styles.activityCardActive]}
        onPress={() => updateField('activityLevel', 'light')}
      >
        <Text style={styles.activityTitle}>Lightly Active</Text>
        <Text style={styles.activityDescription}>Light exercise 1-3 days/week</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.activityCard, profileData.activityLevel === 'moderate' && styles.activityCardActive]}
        onPress={() => updateField('activityLevel', 'moderate')}
      >
        <Text style={styles.activityTitle}>Moderately Active</Text>
        <Text style={styles.activityDescription}>Moderate exercise 3-5 days/week</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.activityCard, profileData.activityLevel === 'active' && styles.activityCardActive]}
        onPress={() => updateField('activityLevel', 'active')}
      >
        <Text style={styles.activityTitle}>Very Active</Text>
        <Text style={styles.activityDescription}>Hard exercise 6-7 days/week</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.activityCard, profileData.activityLevel === 'veryActive' && styles.activityCardActive]}
        onPress={() => updateField('activityLevel', 'veryActive')}
      >
        <Text style={styles.activityTitle}>Extremely Active</Text>
        <Text style={styles.activityDescription}>Very hard exercise & physical job</Text>
      </TouchableOpacity>

      <Text style={[styles.label, { marginTop: SPACING.xl }]}>Workouts per Week</Text>
      <Text style={styles.helpText}>How many workout sessions do you plan to do?</Text>
      <View style={styles.workoutButtons}>
        {[2, 3, 4, 5, 6, 7].map((num) => (
          <TouchableOpacity
            key={num}
            style={[
              styles.workoutButton,
              profileData.workoutsPerWeek === num && styles.workoutButtonActive,
            ]}
            onPress={() => updateField('workoutsPerWeek', num)}
          >
            <Text
              style={[
                styles.workoutButtonText,
                profileData.workoutsPerWeek === num && styles.workoutButtonTextActive,
              ]}
            >
              {num}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return renderWelcome();
      case 2:
        return renderBiometrics();
      case 3:
        return renderGoals();
      case 4:
        return renderActivityLevel();
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(step / 4) * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>Step {step} of 4</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {renderStep()}
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        {step > 1 && (
          <TouchableOpacity style={styles.backButton} onPress={prevStep}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.nextButton, step === 1 && styles.nextButtonFull]}
          onPress={nextStep}
        >
          <Text style={styles.nextButtonText}>
            {step === 4 ? 'Complete Setup 🎉' : 'Continue →'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  progressContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  progressText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  stepContainer: {
    flex: 1,
  },
  emoji: {
    fontSize: 80,
    textAlign: 'center',
    marginVertical: SPACING.xl,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  featuresList: {
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  featureEmoji: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  featureText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    flex: 1,
  },
  disclaimer: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  stepTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  stepSubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
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
    marginBottom: SPACING.md,
  },
  inputRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  inputWithUnit: {
    flex: 1,
  },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  unitButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    minWidth: 50,
    alignItems: 'center',
  },
  unitButtonActive: {
    backgroundColor: COLORS.primary,
  },
  unitText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.weights.semiBold,
  },
  unitTextActive: {
    color: COLORS.white,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  optionButton: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionButtonActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  optionText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.weights.semiBold,
  },
  optionTextActive: {
    color: COLORS.primary,
  },
  goalCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBackground,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    ...SHADOWS.small,
  },
  goalCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  goalEmoji: {
    fontSize: 40,
    marginRight: SPACING.md,
  },
  goalContent: {
    flex: 1,
  },
  goalTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  goalDescription: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  activityCard: {
    backgroundColor: COLORS.cardBackground,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activityCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  activityTitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.weights.semiBold,
    marginBottom: SPACING.xs,
  },
  activityDescription: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  helpText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  workoutButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  workoutButton: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  workoutButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  workoutButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.weights.bold,
  },
  workoutButtonTextActive: {
    color: COLORS.white,
  },
  navigationContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    gap: SPACING.md,
  },
  backButton: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  backButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.weights.semiBold,
  },
  nextButton: {
    flex: 2,
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  nextButtonFull: {
    flex: 1,
  },
  nextButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.weights.bold,
  },
});

export default OnboardingScreen;
