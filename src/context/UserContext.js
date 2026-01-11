import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateDailyTargets } from '../utils/macroCalculator';
import { useAuth } from './AuthContext';
import { MOCK_NUTRITION, MOCK_WORKOUTS } from '../constants/mocks';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [dailyTargets, setDailyTargets] = useState(null);
  const [progressionScore, setProgressionScore] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);

  // Mocked data states
  const [nutritionData, setNutritionData] = useState(MOCK_NUTRITION);
  const [workoutHistory, setWorkoutHistory] = useState(MOCK_WORKOUTS);

  // ✅ CRITICAL: Watch for auth user changes
  useEffect(() => {
    loadUserData();
  }, [authUser]);

  useEffect(() => {
    if (profile) {
      calculateAndSetTargets();
    }
  }, [profile]);

  const loadUserData = async () => {
    try {
      setLoading(true);

      if (!authUser) {
        setUser(null);
        setHasCompletedOnboarding(false);
        setProfile(null);
        setLoading(false);
        return;
      }

      const [profileData, onboardingStatus, streakData, scoreData] = await Promise.all([
        AsyncStorage.getItem('@myfit_profile'),
        AsyncStorage.getItem('@myfit_onboarding_complete'),
        AsyncStorage.getItem('@myfit_streak'),
        AsyncStorage.getItem('@myfit_progression_score'),
      ]);

      setUser(authUser);
      if (profileData) setProfile(JSON.parse(profileData));

      // Prefer the flag from the current mock user
      const isOnboardingComplete =
        authUser?.hasCompletedOnboarding ?? 
        (onboardingStatus === 'true' && profileData !== null);
      setHasCompletedOnboarding(!!isOnboardingComplete);

      if (streakData) setCurrentStreak(parseInt(streakData));
      if (scoreData) setProgressionScore(parseFloat(scoreData));
    } catch (error) {
      console.error('Error loading user data:', error);
      setUser(authUser);
      setHasCompletedOnboarding(false);
    } finally {
      setLoading(false);
    }
  };

  const calculateAndSetTargets = () => {
    if (!profile) return;

    const targets = calculateDailyTargets(
      profile.gender,
      profile.age,
      profile.weight,
      profile.height,
      profile.activityLevel,
      profile.goal
    );

    setDailyTargets(targets);
  };

  const updateProfile = async (newProfileData) => {
    try {
      const updatedProfile = { ...profile, ...newProfileData };
      await AsyncStorage.setItem('@myfit_profile', JSON.stringify(updatedProfile));
      setProfile(updatedProfile);
      return { success: true };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error };
    }
  };

  // ✅ CRITICAL: Enhanced completeOnboarding with multi-storage sync
  const completeOnboarding = async (profileData) => {
    try {
      // Save profile
      await AsyncStorage.setItem('@myfit_profile', JSON.stringify(profileData));
      
      // ✅ CRITICAL: Mark onboarding as complete
      await AsyncStorage.setItem('@myfit_onboarding_complete', 'true');
      
      // ✅ CRITICAL: Update userData with completion flag
      const userDataJson = await AsyncStorage.getItem('userData');
      if (userDataJson) {
        const userData = JSON.parse(userDataJson);
        userData.hasCompletedOnboarding = true;
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
      }
      
      // ✅ CRITICAL: Update mockUsers database
      const storedUsersJson = await AsyncStorage.getItem('mockUsers');
      if (storedUsersJson) {
        const users = JSON.parse(storedUsersJson);
        const userDataParsed = JSON.parse(userDataJson || '{}');
        const userIndex = users.findIndex(u => u.id === userDataParsed.id);
        
        if (userIndex !== -1) {
          users[userIndex].hasCompletedOnboarding = true;
          await AsyncStorage.setItem('mockUsers', JSON.stringify(users));
        }
      }
      
      // Update local state
      setProfile(profileData);
      setHasCompletedOnboarding(true);
      
      return { success: true };
    } catch (error) {
      console.error('Error completing onboarding:', error);
      return { success: false, error };
    }
  };

  const updateProgressionScore = async (score) => {
    try {
      await AsyncStorage.setItem('@myfit_progression_score', score.toString());
      setProgressionScore(score);
    } catch (error) {
      console.error('Error updating progression score:', error);
    }
  };

  const updateStreak = async (streak) => {
    try {
      await AsyncStorage.setItem('@myfit_streak', streak.toString());
      setCurrentStreak(streak);
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  const canChangeGoal = () => {
    return progressionScore >= 85;
  };

  // ✅ CRITICAL: Clear all user data on logout
  const clearAllUserData = async () => {
    try {
      // Clear all AsyncStorage keys related to user data
      const keysToRemove = [
        '@myfit_user',
        '@myfit_profile',
        '@myfit_onboarding_complete',
        '@myfit_daily_targets',
        '@myfit_progression_score',
        '@myfit_streak',
        '@myfit_achievements',
        '@myfit_weight_logs',
        '@myfit_workout_plan_v2',
        '@myfit_workout_history',
      ];

      // Get all nutrition logs keys (dynamic dates)
      const allKeys = await AsyncStorage.getAllKeys();
      const nutritionKeys = allKeys.filter(key => 
        key.startsWith('@myfit_nutrition_logs_') || 
        key.startsWith('@myfit_water_')
      );

      // Combine and remove all keys
      await AsyncStorage.multiRemove([...keysToRemove, ...nutritionKeys]);

      // ✅ CRITICAL: Reset all state variables
      setUser(null);
      setProfile(null);
      setHasCompletedOnboarding(false);
      setDailyTargets(null);
      setProgressionScore(0);
      setCurrentStreak(0);

      console.log('All user data cleared successfully');
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };


  const logout = async () => {
    try {
      await AsyncStorage.multiRemove([
        '@myfit_user',
        '@myfit_auth_token',
        '@myfit_onboarding_complete',
      ]);
      setUser(null);
      setHasCompletedOnboarding(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Reset to mock data instead of clearing everything
  const resetToMocks = () => {
    setNutritionData(MOCK_NUTRITION);
    setWorkoutHistory(MOCK_WORKOUTS);
    setProfile(null);
    setDailyTargets(null);
    setProgressionScore(0);
    setCurrentStreak(0);
    setHasCompletedOnboarding(authUser?.hasCompletedOnboarding ?? false);
  };

  const value = {
    user,
    setUser,
    profile,
    updateProfile,
    loading,
    hasCompletedOnboarding,
    completeOnboarding,
    dailyTargets,
    progressionScore,
    updateProgressionScore,
    currentStreak,
    updateStreak,
    canChangeGoal,
    logout,
    clearAllUserData,
    // expose mocks
    nutritionData,
    workoutHistory,
    resetToMocks,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;