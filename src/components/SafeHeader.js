import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';

/**
 * SafeHeader Component
 * Reusable header with safe back button handling
 * Only shows back button if navigation history exists
 */
const SafeHeader = ({
  navigation,
  title,
  subtitle,
  rightIcon,
  onRightPress,
  showBackButton,
  style,
}) => {
  const canGoBack = navigation?.canGoBack?.() ?? false;
  const shouldShowBack = showBackButton !== undefined ? showBackButton : canGoBack;

  return (
    <View style={[styles.container, style]}>
      {/* Left: Back Button or Placeholder */}
      {shouldShowBack ? (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (canGoBack) {
              navigation.goBack();
            }
          }}
          accessible={true}
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      ) : (
        <View style={styles.backButton} />
      )}

      {/* Center: Title and Subtitle */}
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      {/* Right: Optional Action Button */}
      {rightIcon ? (
        <TouchableOpacity
          style={styles.rightButton}
          onPress={onRightPress}
          accessible={true}
          accessibilityLabel={rightIcon}
        >
          <Ionicons name={rightIcon} size={24} color={COLORS.primary} />
        </TouchableOpacity>
      ) : (
        <View style={styles.rightButton} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.large,
    paddingVertical: SPACING.medium,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightBorder,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -SPACING.medium,
  },
  titleContainer: {
    flex: 1,
    marginHorizontal: SPACING.small,
    justifyContent: 'center',
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.large,
    fontWeight: '700',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.small,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  rightButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -SPACING.medium,
  },
});

export default SafeHeader;
