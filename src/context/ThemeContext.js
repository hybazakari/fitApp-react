import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTheme } from '../constants/theme';

const ThemeContext = createContext({});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load theme preference from AsyncStorage on app startup
  useEffect(() => {
    loadThemePreference();
  }, []);

  // ✅ Load saved theme preference from AsyncStorage
  const loadThemePreference = async () => {
    try {
      setLoading(true);
      const savedTheme = await AsyncStorage.getItem('@myfit_theme_preference');
      
      if (savedTheme !== null) {
        // Theme was previously saved
        const isDark = savedTheme === 'dark';
        setIsDarkMode(isDark);
      } else {
        // First time user - default to light theme
        setIsDarkMode(false);
        await AsyncStorage.setItem('@myfit_theme_preference', 'light');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
      // Fallback to light theme if error occurs
      setIsDarkMode(false);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Toggle theme and persist to AsyncStorage
  const toggleTheme = async () => {
    try {
      const newIsDarkMode = !isDarkMode;
      setIsDarkMode(newIsDarkMode);
      
      // Save preference to AsyncStorage
      const themeValue = newIsDarkMode ? 'dark' : 'light';
      await AsyncStorage.setItem('@myfit_theme_preference', themeValue);
    } catch (error) {
      console.error('Error saving theme preference:', error);
      // Revert state if save fails
      setIsDarkMode(prev => !prev);
    }
  };

  // ✅ Set theme explicitly (light or dark)
  const setTheme = async (theme) => {
    try {
      const newIsDarkMode = theme === 'dark';
      setIsDarkMode(newIsDarkMode);
      
      // Save preference to AsyncStorage
      await AsyncStorage.setItem('@myfit_theme_preference', theme);
    } catch (error) {
      console.error('Error setting theme:', error);
    }
  };

  // ✅ Get current theme object with all styles
  const currentTheme = getTheme(isDarkMode);

  const value = {
    isDarkMode,
    toggleTheme,
    setTheme,
    loading,
    theme: currentTheme,
    colors: currentTheme.colors,
    // Export complete theme objects for direct use
    COLORS: currentTheme.COLORS,
    SHADOWS: currentTheme.SHADOWS,
    COMMON_STYLES: currentTheme.COMMON_STYLES,
    TYPOGRAPHY: currentTheme.TYPOGRAPHY,
    SPACING: currentTheme.SPACING,
    LAYOUT: currentTheme.LAYOUT,
    BORDER_RADIUS: currentTheme.BORDER_RADIUS,
    ANIMATION: currentTheme.ANIMATION,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;