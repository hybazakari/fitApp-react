import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, COMMON_STYLES, SHADOWS } from '../constants/theme';

/**
 * ListItem Component (BONUS)
 * Reusable optimized list item for Meals & Workouts
 * Uses FlatList-ready structure for performance
 * 
 * @param {string} title - Main title (e.g., Meal name or Workout name)
 * @param {string} subtitle - Secondary info (e.g., time, duration)
 * @param {string|number} value - Main value to display (e.g., calories, sets)
 * @param {string} unit - Unit of measurement
 * @param {string} icon - Emoji icon to display
 * @param {function} onPress - Callback when item is tapped
 * @param {function} onDelete - Callback when delete is triggered
 * @param {object} style - Additional custom styles
 */
const ListItem = ({
  title,
  subtitle,
  value,
  unit,
  icon = '📋',
  onPress,
  onDelete,
  style,
  badge,
  badgeColor = COLORS.success,
}) => {
  
  const handleDelete = () => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${title}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: onDelete,
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Left Section: Icon */}
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      {/* Middle Section: Content */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {badge && (
            <View style={[styles.badge, { backgroundColor: badgeColor }]}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          )}
        </View>
        
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      {/* Right Section: Value & Delete */}
      <View style={styles.rightSection}>
        {value && (
          <View style={styles.valueContainer}>
            <Text style={styles.value}>{value}</Text>
            {unit && <Text style={styles.unit}>{unit}</Text>}
          </View>
        )}
        
        {onDelete && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.deleteIcon}>🗑️</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    ...COMMON_STYLES.card,
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.base,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background,
    ...COMMON_STYLES.center,
    marginRight: SPACING.md,
  },
  
  icon: {
    fontSize: 24,
  },
  
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  
  title: {
    ...COMMON_STYLES.body,
    fontWeight: TYPOGRAPHY.weights.semiBold,
    flex: 1,
  },
  
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginLeft: SPACING.sm,
  },
  
  badgeText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.weights.semiBold,
  },
  
  subtitle: {
    ...COMMON_STYLES.caption,
  },
  
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginLeft: SPACING.md,
  },
  
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: SPACING.xs,
  },
  
  value: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.primary,
  },
  
  unit: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  
  deleteButton: {
    padding: SPACING.xs,
  },
  
  deleteIcon: {
    fontSize: 18,
  },
});

export default ListItem;
