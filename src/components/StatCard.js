import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, COMMON_STYLES, SHADOWS } from '../constants/theme';

/**
 * StatCard Component
 * Reusable card component for displaying statistics on the Dashboard
 * 
 * @param {string} title - The title of the stat (e.g., "Calories")
 * @param {string|number} value - The main value to display
 * @param {string} unit - The unit of measurement (e.g., "kcal", "g", "min")
 * @param {string} subtitle - Optional subtitle or secondary info (e.g., "remaining", "consumed")
 * @param {string} color - Color for the value text (default: primary)
 * @param {string} icon - Optional icon name (future enhancement)
 * @param {function} onPress - Optional callback when card is pressed
 * @param {object} style - Additional custom styles
 */
const StatCard = ({
  title,
  value,
  unit,
  subtitle,
  color = COLORS.primary,
  icon,
  onPress,
  style,
  trend, // Optional: 'up', 'down', or percentage change
  trendColor,
}) => {
  const CardWrapper = onPress ? TouchableOpacity : View;
  
  const formattedValue = typeof value === 'number' 
    ? value.toLocaleString() 
    : value;

  return (
    <CardWrapper
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {/* Header with Title */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {trend && (
          <View style={[styles.trendBadge, { backgroundColor: trendColor || COLORS.success }]}>
            <Text style={styles.trendText}>{trend}</Text>
          </View>
        )}
      </View>

      {/* Main Value */}
      <View style={styles.valueContainer}>
        <Text style={[styles.value, { color }]}>
          {formattedValue}
        </Text>
        {unit && (
          <Text style={[styles.unit, { color }]}>
            {unit}
          </Text>
        )}
      </View>

      {/* Subtitle/Additional Info */}
      {subtitle && (
        <Text style={styles.subtitle}>{subtitle}</Text>
      )}
    </CardWrapper>
  );
};

const styles = StyleSheet.create({
  card: {
    ...COMMON_STYLES.card,
    padding: SPACING.lg,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  
  title: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.weights.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  trendBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  
  trendText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.weights.semiBold,
  },
  
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: SPACING.xs,
  },
  
  value: {
    fontSize: TYPOGRAPHY.sizes.xxxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    lineHeight: TYPOGRAPHY.sizes.xxxl * 1.2,
  },
  
  unit: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.medium,
    marginLeft: SPACING.xs,
    opacity: 0.8,
  },
  
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.textMuted,
    fontWeight: TYPOGRAPHY.weights.regular,
  },
});

export default StatCard;
