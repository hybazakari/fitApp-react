/**
 * MyFit App - Centralized Design System
 * Clean White / Light Theme with Professional Color Palette
 */

export const COLORS = {
  // Backgrounds
  background: '#FFFFFF',           // Pure White main background
  cardBackground: '#F4F7FE',       // Very light grey-blue for cards/surfaces
  
  // Brand & Primary
  primary: '#4318FF',              // Primary Brand (Purple/Blue)
  primaryLight: '#7551FF',         // Hover/Active states
  primaryDark: '#3311DD',          // Pressed states
  
  // Status Colors
  success: '#05CD99',              // Success indicators, completion, healthy metrics
  successLight: '#39D9B0',         // Lighter success
  warning: '#FFB547',              // Warning states
  error: '#EE5D50',                // Error states, delete actions
  info: '#4299E1',                 // Info badges
  
  // Text Colors
  textPrimary: '#2B3674',          // Primary text (Dark Navy - softer than black)
  textSecondary: '#A3AED0',        // Secondary text, labels (Grey)
  textMuted: '#B5BFD9',            // Disabled, placeholder text
  
  // UI Elements
  border: '#E9EDF7',               // Border colors (light)
  divider: '#F4F7FE',              // Divider lines
  shadow: 'rgba(112, 144, 176, 0.12)', // Shadow color (subtle blue tint)
  overlay: 'rgba(43, 54, 116, 0.4)', // Modal overlay
  
  // Additional
  white: '#FFFFFF',
  black: '#2B3674',
  transparent: 'transparent',
  
  // Chart Colors (for data visualization)
  chartColors: {
    protein: '#4318FF',    // Purple
    carbs: '#05CD99',      // Green
    fats: '#FFB547',       // Orange
    calories: '#E31A89',   // Pink
    weight: '#01B574',     // Teal
  },
};

export const TYPOGRAPHY = {
  // Font Families (Using default React Native fonts)
  fontRegular: 'System',
  fontMedium: 'System',
  fontBold: 'System',
  
  // Font Sizes
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 40,
  },
  
  // Font Weights
  weights: {
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
  },
  
  // Line Heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

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

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const SHADOWS = {
  small: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  },
  large: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 5,
  },
};

/**
 * Common Component Styles
 */
export const COMMON_STYLES = {
  // Container
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  contentContainer: {
    padding: SPACING.lg,
  },
  
  // Cards
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.base,
    ...SHADOWS.medium,
  },
  
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  
  // Buttons
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.base,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  
  buttonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.semiBold,
  },
  
  buttonSecondary: {
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  
  buttonSecondaryText: {
    color: COLORS.textPrimary,
  },
  
  // Inputs
  input: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.base,
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  
  inputFocused: {
    borderColor: COLORS.primary,
  },
  
  inputLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  
  // Typography
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
    lineHeight: TYPOGRAPHY.sizes.xl * TYPOGRAPHY.lineHeights.normal,
  },
  
  body: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.regular,
    color: COLORS.textPrimary,
    lineHeight: TYPOGRAPHY.sizes.base * TYPOGRAPHY.lineHeights.normal,
  },
  
  bodySecondary: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.regular,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.sizes.base * TYPOGRAPHY.lineHeights.normal,
  },
  
  caption: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.regular,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.sizes.sm * TYPOGRAPHY.lineHeights.normal,
  },
  
  // Layout
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Divider
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SPACING.base,
  },
};

/**
 * Animation Durations
 */
export const ANIMATION = {
  fast: 200,
  normal: 300,
  slow: 500,
};

export default {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  COMMON_STYLES,
  ANIMATION,
};
