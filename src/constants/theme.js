import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// ============================================
// MINIMAL PREMIUM PALETTE - Fitness Pro
// ============================================
export const COLORS = {
  // Backgrounds
  background: '#F8F9FA',           // Ultra-light grey
  surface: '#FFFFFF',              // Pure white for cards/inputs
  
  // Brand Colors
  primary: '#007AFF',              // iOS Blue (Professional)
  primaryLight: '#E3F2FD',         // Light blue tint
  primaryDark: '#0051D5',          // Dark blue
  
  // Semantic
  success: '#34C759',              // Green
  warning: '#FF9500',              // Orange
  error: '#FF3B30',                // Red
  info: '#5AC8FA',                 // Light blue
  
  // Text
  textPrimary: '#2C3E50',          // Anthracite grey
  textSecondary: '#6C757D',        // Medium grey
  textMuted: '#ADB5BD',            // Light grey
  textWhite: '#FFFFFF',            // White
  
  // UI Elements
  border: '#E9ECEF',               // Very light border
  borderFocus: '#007AFF',          // Blue border on focus
  divider: '#DEE2E6',              // Divider
  shadow: 'rgba(44, 62, 80, 0.08)', // Soft shadow
  overlay: 'rgba(0, 0, 0, 0.4)',   // Modal overlay
  
  // Feature specific
  chartColors: {
    protein: '#007AFF',
    carbs: '#34C759',
    fats: '#FF9500',
    calories: '#FF3B30',
  },
};

// ============================================
// TYPOGRAPHY - Clean Sans-Serif
// ============================================
export const TYPOGRAPHY = {
  sizes: {
    tiny: 10,
    xs: 12,
    sm: 14,
    base: 16,
    md: 18,
    lg: 20,
    xl: 24,
    xxl: 28,
    xxxl: 32,
    huge: 40,
  },
  
  weights: {
    light: '300',
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
    extraBold: '800',
  },
  
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// ============================================
// SPACING - Breathable Layout
// ============================================
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

// ============================================
// BORDER RADIUS - Modern Curves
// ============================================
export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

// ============================================
// SHADOWS - Subtle Elevation
// ============================================
export const SHADOWS = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  
  small: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  
  medium: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  
  large: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
  },
};

// ============================================
// COMMON STYLES - Reusable Components
// ============================================
export const COMMON_STYLES = {
  // Containers
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  // Cards
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.small,
  },
  
  // Inputs - STANDARDIZED
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.base,
    paddingHorizontal: SPACING.base,
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.weights.regular,
  },
  
  inputFocused: {
    borderColor: COLORS.borderFocus,
    ...SHADOWS.small,
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.base,
    marginBottom: SPACING.base,
  },
  
  // Buttons - STANDARDIZED
  buttonPrimary: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.base,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.base - 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  buttonText: {
    color: COLORS.textWhite,
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.semiBold,
  },
  
  buttonTextSecondary: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.semiBold,
  },
  
  // Typography - CLEAN
  h1: {
    fontSize: TYPOGRAPHY.sizes.xxxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.textPrimary,
    lineHeight: TYPOGRAPHY.sizes.xxxl * TYPOGRAPHY.lineHeights.tight,
  },
  
  h2: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.textPrimary,
    lineHeight: TYPOGRAPHY.sizes.xxl * TYPOGRAPHY.lineHeights.tight,
  },
  
  h3: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.semiBold,
    color: COLORS.textPrimary,
    lineHeight: TYPOGRAPHY.sizes.xl * TYPOGRAPHY.lineHeights.tight,
  },
  
  body: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.regular,
    color: COLORS.textPrimary,
    lineHeight: TYPOGRAPHY.sizes.base * TYPOGRAPHY.lineHeights.normal,
  },
  
  bodyMedium: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.textPrimary,
    lineHeight: TYPOGRAPHY.sizes.base * TYPOGRAPHY.lineHeights.normal,
  },
  
  bodyBold: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.semiBold,
    color: COLORS.textPrimary,
    lineHeight: TYPOGRAPHY.sizes.base * TYPOGRAPHY.lineHeights.normal,
  },
  
  caption: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.regular,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.sizes.sm * TYPOGRAPHY.lineHeights.normal,
  },
  
  tiny: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: TYPOGRAPHY.weights.regular,
    color: COLORS.textMuted,
    lineHeight: TYPOGRAPHY.sizes.xs * TYPOGRAPHY.lineHeights.normal,
  },
  
  // Error
  errorText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.error,
    marginTop: SPACING.xs,
    fontWeight: TYPOGRAPHY.weights.regular,
  },
};

export const LAYOUT = {
  screenWidth: width,
  screenHeight: height,
  isSmallDevice: width < 375,
  contentPadding: SPACING.lg,
};

export default {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  COMMON_STYLES,
  LAYOUT,
};