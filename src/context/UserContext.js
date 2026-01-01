import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateDailyTargets } from '../utils/macroCalculator';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [dailyTargets, setDailyTargets] = useState(null);
  const [progressionScore, setProgressionScore] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (profile) {
      calculateAndSetTargets();
    }
  }, [profile]);

  const loadUserData = async () => {
    try {
      const [
        userData,
        profileData,
        onboardingStatus,
        streakData,
        scoreData,
      ] = await Promise.all([
        AsyncStorage.getItem('@myfit_user'),
        AsyncStorage.getItem('@myfit_profile'),
        AsyncStorage.getItem('@myfit_onboarding_complete'),
        AsyncStorage.getItem('@myfit_streak'),
        AsyncStorage.getItem('@myfit_progression_score'),
      ]);

      if (userData) setUser(JSON.parse(userData));
      if (profileData) setProfile(JSON.parse(profileData));
      if (onboardingStatus) setHasCompletedOnboarding(true);
      if (streakData) setCurrentStreak(parseInt(streakData));
      if (scoreData) setProgressionScore(parseFloat(scoreData));
    } catch (error) {
      console.error('Error loading user data:', error);
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

  const completeOnboarding = async (profileData) => {
    try {
      await AsyncStorage.setItem('@myfit_profile', JSON.stringify(profileData));
      await AsyncStorage.setItem('@myfit_onboarding_complete', 'true');
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

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove([
        '@myfit_user',
        '@myfit_auth_token',
      ]);
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
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
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;
