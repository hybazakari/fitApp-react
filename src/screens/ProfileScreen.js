import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS, COMMON_STYLES } from '../constants/theme';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [progressionScore, setProgressionScore] = useState(0);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showLockedModal, setShowLockedModal] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const profileJson = await AsyncStorage.getItem('@myfit_profile');
      if (profileJson) {
        setProfile(JSON.parse(profileJson));
      }

      const scoreJson = await AsyncStorage.getItem('@myfit_progression_score');
      if (scoreJson) {
        setProgressionScore(parseInt(scoreJson));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleChangeGoal = async () => {
    // Check if progression score is >= 85%
    if (progressionScore < 85) {
      setShowLockedModal(true);
      return;
    }

    // Allow goal change
    setShowGoalModal(true);
  };

  const confirmGoalChange = async (newGoal) => {
    try {
      const updatedProfile = { ...profile, goal: newGoal };
      await AsyncStorage.setItem('@myfit_profile', JSON.stringify(updatedProfile));
      setProfile(updatedProfile);
      
      // Recalculate daily targets based on new goal
      const { calculateDailyTargets } = require('../utils/macroCalculator');
      const dailyTargets = calculateDailyTargets(
        updatedProfile.gender,
        updatedProfile.age,
        updatedProfile.weight,
        updatedProfile.height,
        updatedProfile.activityLevel,
        newGoal
      );
      
      await AsyncStorage.setItem('@myfit_daily_targets', JSON.stringify(dailyTargets));
      
      setShowGoalModal(false);
      Alert.alert('Success', `Your goal has been changed to ${newGoal}. Your daily targets have been updated.`);
    } catch (error) {
      console.error('Error changing goal:', error);
      Alert.alert('Error', 'Failed to update goal. Please try again.');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: () => logout(), style: 'destructive' },
      ]
    );
  };

  const getGoalLabel = (goal) => {
    switch (goal) {
      case 'weightLoss':
        return 'Weight Loss';
      case 'maintenance':
        return 'Maintenance';
      case 'muscleGain':
        return 'Muscle Gain';
      default:
        return 'Not set';
    }
  };

  const renderInfoCard = (icon, label, value) => (
    <View style={styles.infoCard}>
      <View style={styles.infoIconContainer}>
        <Ionicons name={icon} size={24} color={COLORS.primary} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || 'Not set'}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={50} color={COLORS.buttonText} />
          </View>
          <Text style={styles.name}>
            {profile?.name || user?.prenom || 'User'}
          </Text>
          <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
          
          {/* Progression Score Badge */}
          <View style={[
            styles.scoreBadge,
            { backgroundColor: progressionScore >= 85 ? COLORS.success : progressionScore >= 50 ? COLORS.warning : COLORS.error }
          ]}>
            <Text style={styles.scoreBadgeText}>
              {progressionScore}% Progression Score
            </Text>
          </View>
        </View>

        {/* Profile Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          {renderInfoCard('person', 'Name', profile?.name)}
          {renderInfoCard('mail', 'Email', user?.email)}
          {renderInfoCard('man', 'Gender', profile?.gender === 'male' ? 'Male' : 'Female')}
          {renderInfoCard('calendar', 'Age', profile?.age ? `${profile.age} years` : null)}
          {renderInfoCard('fitness', 'Weight', profile?.weight ? `${profile.weight} kg` : null)}
          {renderInfoCard('resize', 'Height', profile?.height ? `${profile.height} cm` : null)}
          {renderInfoCard('trophy', 'Goal', getGoalLabel(profile?.goal))}
          {renderInfoCard('walk', 'Activity Level', profile?.activityLevel)}
        </View>

        {/* Goal Section with Lock */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fitness Goal</Text>
          
          <TouchableOpacity 
            style={styles.goalCard}
            onPress={handleChangeGoal}
          >
            <View style={styles.goalInfo}>
              <Text style={styles.goalLabel}>Current Goal</Text>
              <Text style={styles.goalValue}>{getGoalLabel(profile?.goal)}</Text>
              {progressionScore < 85 && (
                <View style={styles.lockBadge}>
                  <Ionicons name="lock-closed" size={14} color={COLORS.buttonText} />
                  <Text style={styles.lockText}>Unlock at 85%</Text>
                </View>
              )}
            </View>
            <Ionicons 
              name={progressionScore >= 85 ? "pencil" : "lock-closed"} 
              size={24} 
              color={progressionScore >= 85 ? COLORS.primary : COLORS.textSecondary} 
            />
          </TouchableOpacity>

          <Text style={styles.goalHint}>
            💡 {progressionScore >= 85 
              ? 'You can now change your goal!' 
              : `Reach 85% progression score to unlock goal changes. Current: ${progressionScore}%`
            }
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Progress')}
          >
            <Ionicons name="stats-chart" size={24} color={COLORS.textPrimary} />
            <Text style={styles.actionButtonText}>View Progress</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="settings-outline" size={24} color={COLORS.textPrimary} />
            <Text style={styles.actionButtonText}>Settings</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="help-circle-outline" size={24} color={COLORS.textPrimary} />
            <Text style={styles.actionButtonText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="information-circle-outline" size={24} color={COLORS.textPrimary} />
            <Text style={styles.actionButtonText}>About</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color={COLORS.buttonText} />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Goal Selection Modal */}
      <Modal
        visible={showGoalModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGoalModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Your Goal</Text>
            <Text style={styles.modalSubtitle}>
              Select your new fitness goal. Your daily targets will be recalculated.
            </Text>

            <TouchableOpacity 
              style={styles.goalOption}
              onPress={() => confirmGoalChange('weightLoss')}
            >
              <Text style={styles.goalOptionEmoji}>📉</Text>
              <View style={styles.goalOptionInfo}>
                <Text style={styles.goalOptionTitle}>Weight Loss</Text>
                <Text style={styles.goalOptionDescription}>Calorie deficit for fat loss</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.goalOption}
              onPress={() => confirmGoalChange('maintenance')}
            >
              <Text style={styles.goalOptionEmoji}>⚖️</Text>
              <View style={styles.goalOptionInfo}>
                <Text style={styles.goalOptionTitle}>Maintenance</Text>
                <Text style={styles.goalOptionDescription}>Maintain current weight</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.goalOption}
              onPress={() => confirmGoalChange('muscleGain')}
            >
              <Text style={styles.goalOptionEmoji}>💪</Text>
              <View style={styles.goalOptionInfo}>
                <Text style={styles.goalOptionTitle}>Muscle Gain</Text>
                <Text style={styles.goalOptionDescription}>Calorie surplus for muscle growth</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={() => setShowGoalModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Goal Locked Modal */}
      <Modal
        visible={showLockedModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLockedModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.lockIcon}>
              <Ionicons name="lock-closed" size={50} color={COLORS.warning} />
            </View>
            <Text style={styles.modalTitle}>Goal Change Locked</Text>
            <Text style={styles.modalSubtitle}>
              You need an 85% progression score to change your goal.
            </Text>

            <View style={styles.scoreProgress}>
              <View style={styles.scoreProgressBar}>
                <View 
                  style={[
                    styles.scoreProgressFill,
                    { 
                      width: `${progressionScore}%`,
                      backgroundColor: progressionScore >= 50 ? COLORS.warning : COLORS.error
                    }
                  ]}
                />
              </View>
              <Text style={styles.scoreProgressText}>
                Current: {progressionScore}% / Required: 85%
              </Text>
            </View>

            <View style={styles.tipsCard}>
              <Text style={styles.tipsTitle}>💡 How to improve your score:</Text>
              <Text style={styles.tipText}>• Log all your meals and hit your macro targets</Text>
              <Text style={styles.tipText}>• Complete your scheduled workouts</Text>
              <Text style={styles.tipText}>• Stay consistent for 30 days</Text>
            </View>

            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => setShowLockedModal(false)}
            >
              <Text style={styles.modalButtonText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...COMMON_STYLES.container,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.cardBackground,
    marginBottom: SPACING.md,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  name: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.weights.bold,
    marginBottom: SPACING.xs,
  },
  email: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  scoreBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    marginTop: SPACING.sm,
  },
  scoreBadgeText: {
    ...TYPOGRAPHY.small,
    color: COLORS.buttonText,
    fontWeight: TYPOGRAPHY.weights.semiBold,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.weights.bold,
    marginBottom: SPACING.md,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.small,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.weights.semiBold,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.small,
  },
  goalInfo: {
    flex: 1,
  },
  goalLabel: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  goalValue: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.weights.bold,
    marginBottom: SPACING.xs,
  },
  lockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warning,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: 'flex-start',
    gap: 4,
  },
  lockText: {
    ...TYPOGRAPHY.tiny,
    color: COLORS.buttonText,
    fontWeight: TYPOGRAPHY.weights.semiBold,
  },
  goalHint: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.small,
  },
  actionButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    flex: 1,
    marginLeft: SPACING.md,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.error,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  logoutButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.buttonText,
    fontWeight: TYPOGRAPHY.weights.semiBold,
    marginLeft: SPACING.sm,
  },
  bottomSpacer: {
    height: SPACING.xl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.weights.bold,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  modalSubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  lockIcon: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  goalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  goalOptionEmoji: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  goalOptionInfo: {
    flex: 1,
  },
  goalOptionTitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.weights.semiBold,
    marginBottom: 2,
  },
  goalOptionDescription: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
  },
  modalCancelButton: {
    alignItems: 'center',
    padding: SPACING.md,
    marginTop: SPACING.sm,
  },
  modalCancelText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.weights.semiBold,
  },
  scoreProgress: {
    marginBottom: SPACING.lg,
  },
  scoreProgressBar: {
    height: 8,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  scoreProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  scoreProgressText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  tipsCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  tipsTitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.weights.semiBold,
    marginBottom: SPACING.sm,
  },
  tipText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  modalButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
  },
  modalButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.buttonText,
    fontWeight: TYPOGRAPHY.weights.semiBold,
  },
});

export default ProfileScreen;
