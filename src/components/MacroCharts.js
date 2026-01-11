import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart, ProgressChart, PieChart } from 'react-native-chart-kit';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, COMMON_STYLES } from '../constants/theme';

const screenWidth = Dimensions.get('window').width;

/**
 * MacroCharts Component
 * Reusable data visualization components for nutrition and fitness tracking
 * Uses react-native-chart-kit with light theme styling
 */

// ============================================
// 1. CALORIES RING/PROGRESS CHART
// ============================================
export const CaloriesRingChart = ({ consumed, target }) => {
  const styles = createStyles(COLORS, SPACING, BORDER_RADIUS, COMMON_STYLES, TYPOGRAPHY);
  const percentage = Math.min((consumed / target), 1); // Cap at 100%
  
  const data = {
    data: [percentage],
    colors: [COLORS.chartColors.calories],
  };

  const chartConfig = {
    backgroundGradientFrom: COLORS.transparent,
    backgroundGradientTo: COLORS.transparent,
    color: (opacity = 1) => `rgba(227, 26, 137, ${opacity})`, // Pink
    strokeWidth: 2,
  };

  return (
    <View style={[styles.chartContainer, { backgroundColor: COLORS.cardBackground }]}>
      <Text style={[styles.chartTitle, { color: COLORS.textPrimary }]}>Daily Calories</Text>
      <View style={styles.ringChartWrapper}>
        <ProgressChart
          data={data}
          width={screenWidth - SPACING.lg * 4}
          height={220}
          strokeWidth={16}
          radius={70}
          chartConfig={chartConfig}
          hideLegend={true}
          style={styles.chart}
        />
        <View style={styles.ringCenterText}>
          <Text style={[styles.ringValue, { color: COLORS.textPrimary }]}>{consumed}</Text>
          <Text style={[styles.ringUnit, { color: COLORS.textSecondary }]}>of {target}</Text>
          <Text style={[styles.ringLabel, { color: COLORS.textSecondary }]}>kcal</Text>
        </View>
      </View>
      <View style={[styles.chartFooter, { backgroundColor: COLORS.divider }]}>
        <Text style={[styles.footerText, { color: COLORS.textSecondary }]}>
          {target - consumed > 0 ? `${target - consumed} kcal remaining` : 'Goal reached!'}
        </Text>
      </View>
    </View>
  );
};

// ============================================
// 2. MACRO BREAKDOWN PIE CHART
// ============================================
export const MacroPieChart = ({ protein, carbs, fats }) => {
  const styles = createStyles(COLORS, SPACING, BORDER_RADIUS, COMMON_STYLES, TYPOGRAPHY);
  const total = protein + carbs + fats;
  
  const data = [
    {
      name: 'Protein',
      amount: protein,
      color: COLORS.chartColors.protein,
      legendFontColor: COLORS.textPrimary,
      legendFontSize: 14,
    },
    {
      name: 'Carbs',
      amount: carbs,
      color: COLORS.chartColors.carbs,
      legendFontColor: COLORS.textPrimary,
      legendFontSize: 14,
    },
    {
      name: 'Fats',
      amount: fats,
      color: COLORS.chartColors.fats,
      legendFontColor: COLORS.textPrimary,
      legendFontSize: 14,
    },
  ];

  const chartConfig = {
    backgroundGradientFrom: COLORS.transparent,
    backgroundGradientTo: COLORS.transparent,
    color: (opacity = 1) => COLORS.textPrimary,
    strokeWidth: 2,
  };

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Macro Breakdown</Text>
      <PieChart
        data={data}
        width={screenWidth - SPACING.lg * 2}
        height={220}
        chartConfig={chartConfig}
        accessor="amount"
        backgroundColor={COLORS.transparent}
        paddingLeft="15"
        absolute
        style={styles.chart}
      />
      <View style={styles.macroLegend}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>
              {item.name}: {item.amount}g ({Math.round((item.amount / total) * 100)}%)
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// ============================================
// 3. WEIGHT PROGRESSION LINE CHART
// ============================================
export const WeightLineChart = ({ weightData }) => {
  const styles = createStyles(COLORS, SPACING, BORDER_RADIUS, COMMON_STYLES, TYPOGRAPHY);
  // weightData format: [{ date: 'Jan 1', weight: 75.5 }, ...]
  const labels = weightData.map(d => d.date);
  const weights = weightData.map(d => d.weight);

  const data = {
    labels: labels,
    datasets: [
      {
        data: weights,
        color: (opacity = 1) => `rgba(1, 181, 116, ${opacity})`, // Teal
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: COLORS.transparent,
    backgroundGradientFrom: COLORS.cardBackground,
    backgroundGradientTo: COLORS.cardBackground,
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(67, 24, 255, ${opacity})`,
    labelColor: (opacity = 1) => COLORS.textSecondary,
    style: {
      borderRadius: BORDER_RADIUS.md,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: COLORS.chartColors.weight,
    },
    propsForBackgroundLines: {
      strokeDasharray: '', // solid lines
      stroke: COLORS.border,
      strokeWidth: 1,
    },
  };

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Weight Progression</Text>
      <LineChart
        data={data}
        width={screenWidth - SPACING.lg * 2}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withInnerLines={true}
        withOuterLines={true}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        fromZero={false}
      />
      <View style={styles.chartFooter}>
        <Text style={styles.footerText}>
          Change: {(weights[weights.length - 1] - weights[0]).toFixed(1)} kg
        </Text>
      </View>
    </View>
  );
};

// ============================================
// 4. MINI PROGRESS BAR (Bonus - for inline stats)
// ============================================
export const MiniProgressBar = ({ current, target, color, label }) => {
  const styles = createStyles(COLORS, SPACING, BORDER_RADIUS, COMMON_STYLES, TYPOGRAPHY);
  const resolvedColor = color || COLORS.primary;
  const percentage = Math.min((current / target) * 100, 100);

  return (
    <View style={styles.miniProgressContainer}>
      {label && <Text style={styles.miniProgressLabel}>{label}</Text>}
      <View style={styles.progressBarBackground}>
        <View 
          style={[
            styles.progressBarFill, 
            { width: `${percentage}%`, backgroundColor: resolvedColor }
          ]} 
        />
      </View>
      <Text style={styles.miniProgressText}>
        {current} / {target} ({Math.round(percentage)}%)
      </Text>
    </View>
  );
};

// ============================================
// STYLES
// ============================================
const createStyles = (COLORS, SPACING, BORDER_RADIUS, COMMON_STYLES, TYPOGRAPHY) => StyleSheet.create({
  chartContainer: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.base,
    marginVertical: SPACING.md,
    ...COMMON_STYLES.card,
  },
  
  chartTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.semiBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  
  chart: {
    marginVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  
  chartFooter: {
    marginTop: SPACING.md,
    alignItems: 'center',
  },
  
  footerText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.textSecondary,
  },
  
  // Ring Chart Specific
  ringChartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  
  ringCenterText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  ringValue: {
    fontSize: 32,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.textPrimary,
  },
  
  ringUnit: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  
  ringLabel: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.textMuted,
  },
  
  // Macro Legend
  macroLegend: {
    marginTop: SPACING.md,
  },
  
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: SPACING.sm,
  },
  
  legendText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.textPrimary,
  },
  
  // Mini Progress Bar
  miniProgressContainer: {
    marginVertical: SPACING.sm,
  },
  
  miniProgressLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  
  progressBarBackground: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
  },
  
  progressBarFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.sm,
  },
  
  miniProgressText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
});

export default {
  CaloriesRingChart,
  MacroPieChart,
  WeightLineChart,
  MiniProgressBar,
};
