/**
 * App Configuration
 * Central configuration file for the MyFit Mobile app
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api', // Update this with your backend URL
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
};

// AsyncStorage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
  REFRESH_TOKEN: 'refreshToken',
  THEME: 'theme',
  LANGUAGE: 'language',
};

// App Theme Colors
export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  danger: '#FF3B30',
  warning: '#FF9500',
  info: '#5AC8FA',
  
  // Feature Colors
  calories: '#FF6B6B',
  protein: '#4ECDC4',
  carbs: '#FFE66D',
  fats: '#A8E6CF',
  workout: '#956CE6',
  
  // UI Colors
  background: '#F5F7FA',
  surface: '#FFFFFF',
  text: '#2C3E50',
  textSecondary: '#7F8C8D',
  border: '#E0E0E0',
  placeholder: '#BDC3C7',
  
  // Semantic Colors
  error: '#FF3B30',
  errorLight: '#FFEBEE',
  successLight: '#E8F5E9',
  warningLight: '#FFF3E0',
};

// Typography
export const FONTS = {
  regular: {
    fontWeight: '400',
  },
  medium: {
    fontWeight: '500',
  },
  semiBold: {
    fontWeight: '600',
  },
  bold: {
    fontWeight: '700',
  },
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border Radius
export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
};

// Shadow Styles
export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

// API Endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
  },
  DASHBOARD: '/dashboard',
  MEALS: '/meals',
  EXERCISES: '/exercises',
  WORKOUTS: '/workouts',
};

// Validation Rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
};

// App Constants
export const APP_CONFIG = {
  NAME: 'MyFit',
  VERSION: '1.0.0',
  DEFAULT_LANGUAGE: 'fr',
  SUPPORTED_LANGUAGES: ['fr', 'en'],
};

// Macro Goals Presets
export const MACRO_PRESETS = {
  MAINTENANCE: {
    name: 'Maintenance',
    protein: 0.30,
    carbs: 0.40,
    fats: 0.30,
  },
  BULKING: {
    name: 'Prise de Masse',
    protein: 0.30,
    carbs: 0.50,
    fats: 0.20,
  },
  CUTTING: {
    name: 'Sèche',
    protein: 0.40,
    carbs: 0.30,
    fats: 0.30,
  },
};

// Activity Levels
export const ACTIVITY_LEVELS = {
  SEDENTARY: {
    value: 'sedentary',
    label: 'Sédentaire',
    multiplier: 1.2,
    description: 'Peu ou pas d\'exercice',
  },
  LIGHT: {
    value: 'light',
    label: 'Légèrement actif',
    multiplier: 1.375,
    description: 'Exercice léger 1-3 jours/semaine',
  },
  MODERATE: {
    value: 'moderate',
    label: 'Modérément actif',
    multiplier: 1.55,
    description: 'Exercice modéré 3-5 jours/semaine',
  },
  ACTIVE: {
    value: 'active',
    label: 'Très actif',
    multiplier: 1.725,
    description: 'Exercice intense 6-7 jours/semaine',
  },
  VERY_ACTIVE: {
    value: 'veryActive',
    label: 'Extrêmement actif',
    multiplier: 1.9,
    description: 'Exercice très intense & travail physique',
  },
};

export default {
  API_CONFIG,
  STORAGE_KEYS,
  COLORS,
  FONTS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  ENDPOINTS,
  VALIDATION,
  APP_CONFIG,
  MACRO_PRESETS,
  ACTIVITY_LEVELS,
};
