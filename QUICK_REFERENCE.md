# MyFit Mobile - Quick Reference Guide

## 🎨 Light Theme Colors Quick Reference

```javascript
import { COLORS } from '../constants/theme';

// Backgrounds
COLORS.background        // #FFFFFF (Pure White)
COLORS.cardBackground    // #F4F7FE (Light Grey-Blue)

// Brand
COLORS.primary           // #4318FF (Purple/Blue)
COLORS.success           // #05CD99 (Green)

// Text
COLORS.textPrimary       // #2B3674 (Dark Navy)
COLORS.textSecondary     // #A3AED0 (Grey)
COLORS.textMuted         // #B5BFD9 (Light Grey)

// Chart Colors
COLORS.chartColors.protein   // #4318FF (Purple)
COLORS.chartColors.carbs     // #05CD99 (Green)
COLORS.chartColors.fats      // #FFB547 (Orange)
COLORS.chartColors.calories  // #E31A89 (Pink)
COLORS.chartColors.weight    // #01B574 (Teal)
```

---

## 📊 Chart Components Quick Reference

### 1. Calorie Ring Chart
```javascript
import { CaloriesRingChart } from '../components/MacroCharts';

<CaloriesRingChart
  consumed={1850}
  target={2200}
/>
```

### 2. Macro Pie Chart
```javascript
import { MacroPieChart } from '../components/MacroCharts';

<MacroPieChart
  protein={120}
  carbs={180}
  fats={55}
/>
```

### 3. Weight Line Chart
```javascript
import { WeightLineChart } from '../components/MacroCharts';

const data = [
  { date: 'Jan 1', weight: 76.0 },
  { date: 'Jan 8', weight: 75.5 }
];

<WeightLineChart weightData={data} />
```

### 4. Mini Progress Bar
```javascript
import { MiniProgressBar } from '../components/MacroCharts';

<MiniProgressBar
  current={120}
  target={150}
  color={COLORS.success}
  label="Protein Goal"
/>
```

---

## 💪 Workout Screen Quick Reference

### Import
```javascript
import WorkoutScreen from '../screens/WorkoutScreen';
```

### Navigation Setup
```javascript
<Tab.Screen 
  name="Programme" 
  component={WorkoutScreen}
  options={{ title: 'Workout Program' }}
/>
```

### Data Structure
```javascript
{
  "Monday": "Chest",
  "Tuesday": "Back",
  "Wednesday": "Legs",
  "Thursday": "Shoulders",
  "Friday": "Arms",
  "Saturday": "Core",
  "Sunday": "Rest"
}
```

### AsyncStorage Key
```javascript
const STORAGE_KEY = '@myfit_workout_plan';
```

---

## 🔧 Common Tasks

### Task 1: Update StatusBar
```javascript
// App.js
import { StatusBar } from 'expo-status-bar';

<StatusBar style="dark" />
```

### Task 2: Add Charts to Dashboard
```javascript
import { CaloriesRingChart, MacroPieChart } from '../components/MacroCharts';

// In your render method
<CaloriesRingChart consumed={1850} target={2200} />
<MacroPieChart protein={120} carbs={180} fats={55} />
```

### Task 3: Load Workout Plan from AsyncStorage
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

const loadPlan = async () => {
  const plan = await AsyncStorage.getItem('@myfit_workout_plan');
  return plan ? JSON.parse(plan) : defaultPlan;
};
```

### Task 4: Save Workout Plan to AsyncStorage
```javascript
const savePlan = async (plan) => {
  await AsyncStorage.setItem('@myfit_workout_plan', JSON.stringify(plan));
};
```

---

## 📦 Required Dependencies

```bash
# Charts
npx expo install react-native-chart-kit react-native-svg

# AsyncStorage
npx expo install @react-native-async-storage/async-storage
```

---

## 🎯 Component Props Reference

### StatCard Props
| Prop | Type | Required | Example |
|------|------|----------|---------|
| title | string | ✅ | "Calories" |
| value | number/string | ✅ | 1850 |
| unit | string | ❌ | "kcal" |
| subtitle | string | ❌ | "350 remaining" |
| color | string | ❌ | COLORS.primary |
| trend | string | ❌ | "-12%" |
| onPress | function | ❌ | () => {} |

### CaloriesRingChart Props
| Prop | Type | Required |
|------|------|----------|
| consumed | number | ✅ |
| target | number | ✅ |

### MacroPieChart Props
| Prop | Type | Required |
|------|------|----------|
| protein | number | ✅ |
| carbs | number | ✅ |
| fats | number | ✅ |

### WeightLineChart Props
| Prop | Type | Required |
|------|------|----------|
| weightData | array | ✅ |

### MiniProgressBar Props
| Prop | Type | Required |
|------|------|----------|
| current | number | ✅ |
| target | number | ✅ |
| color | string | ❌ |
| label | string | ❌ |

---

## 🐛 Quick Troubleshooting

### Problem: Text is white/invisible
**Fix:** Use `COLORS.textPrimary` instead of `COLORS.white`

### Problem: Charts not showing
**Fix:** Ensure libraries installed:
```bash
npx expo install react-native-chart-kit react-native-svg
```

### Problem: Workout plan not persisting
**Fix:** Install AsyncStorage:
```bash
npx expo install @react-native-async-storage/async-storage
```

### Problem: StatusBar icons not visible
**Fix:** Change to dark style in App.js:
```javascript
<StatusBar style="dark" />
```

---

## 📱 Testing Checklist

- [ ] White background visible (#FFFFFF)
- [ ] Dark text readable on white (#2B3674)
- [ ] StatusBar icons are dark/visible
- [ ] Charts render with data
- [ ] Workout plan saves and loads
- [ ] Day selector scrolls horizontally
- [ ] Edit modal opens and saves
- [ ] Pull-to-refresh works
- [ ] Cards have subtle shadows

---

## 🎨 Design Tokens At-a-Glance

### Spacing
```javascript
SPACING.xs: 4      SPACING.sm: 8      SPACING.md: 12
SPACING.base: 16   SPACING.lg: 20     SPACING.xl: 24
SPACING.xxl: 32    SPACING.xxxl: 40
```

### Typography
```javascript
sizes.xs: 12      sizes.sm: 14      sizes.base: 16
sizes.lg: 18      sizes.xl: 20      sizes.xxl: 24
sizes.xxxl: 32    sizes.display: 40
```

### Border Radius
```javascript
sm: 8     md: 12     lg: 16     xl: 20     full: 9999
```

---

## 🚀 File Locations

```
myfit-mobile/
├── App.js                                    [UPDATED]
├── src/
│   ├── constants/
│   │   └── theme.js                          [UPDATED]
│   ├── components/
│   │   ├── MacroCharts.js                    [NEW]
│   │   ├── StatCard.js                       [EXISTING]
│   │   ├── ListItem.js                       [EXISTING]
│   │   ├── INTEGRATION_EXAMPLES.js           [NEW]
│   │   └── USAGE_EXAMPLES.js                 [EXISTING]
│   └── screens/
│       ├── WorkoutScreen.js                  [NEW]
│       ├── DashboardScreen.js                [EXISTING]
│       └── DashboardScreen.UPDATED.js        [NEW - EXAMPLE]
```

---

## 💡 Pro Tips

1. **Always import COLORS from theme.js** - Never hardcode colors
2. **Use SPACING constants** - Consistent spacing throughout
3. **Test on both iOS and Android** - StatusBar behaves differently
4. **Use AsyncStorage for local data** - No API required
5. **Charts auto-resize** - They use Dimensions.get('window').width

---

## 📞 Support

**Documentation Files:**
- `LIGHT_THEME_UPDATE.md` - Complete migration guide
- `IMPLEMENTATION_GUIDE.md` - Original dark theme guide
- `INTEGRATION_EXAMPLES.js` - Copy-paste code examples
- `USAGE_EXAMPLES.js` - Component usage patterns

**Key Concepts:**
- Light theme with professional colors
- Data visualization with react-native-chart-kit
- Workout program with AsyncStorage
- Mobile-first UI patterns

---

**Last Updated:** January 1, 2026  
**Version:** 2.0 - Light Theme Edition
