import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/theme';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';
import OnboardingDataScreen from '../screens/auth/OnboardingDataScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ProgrammeScreen from '../screens/ProgrammeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProgressScreen from '../screens/ProgressScreen';
import DailyNutritionScreen from '../screens/nutrition/DailyNutritionScreen';
import AddFoodScreen from '../screens/nutrition/AddFoodScreen';
import AboutScreen from '../screens/AboutScreen';
import HelpSupportScreen from '../screens/HelpSupportScreen';
import ExerciseLibraryScreen from '../screens/workout/ExerciseLibraryScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator avec 4 onglets principaux
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Nutrition') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'Programme') {
            iconName = focused ? 'fitness' : 'fitness-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={'#FFFFFF'} />;
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#FFFFFF',
        tabBarStyle: {
          backgroundColor: COLORS.primary,
          borderTopWidth: 1,
          borderTopColor: COLORS.primary,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: TYPOGRAPHY.sizes.xs,
          fontWeight: TYPOGRAPHY.weights.medium,
          color: '#FFFFFF',
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="Nutrition" 
        component={DailyNutritionScreen}
        options={{ tabBarLabel: 'Nutrition' }}
      />
      <Tab.Screen 
        name="Programme" 
        component={ProgrammeScreen}
        options={{ tabBarLabel: 'Workout' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { user, loading: authLoading } = useAuth();
  const { hasCompletedOnboarding, loading: userLoading } = useUser();

  if (authLoading || userLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          // ✅ Auth Stack with ALL auth screens
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            {/* ✅ CRITICAL: Add ForgotPassword screen here */}
            <Stack.Screen 
              name="ForgotPassword" 
              component={ForgotPasswordScreen}
              options={{
                presentation: 'card',
                animationEnabled: true,
              }}
            />
            {/* ✅ OPTIONAL: Add ResetPassword screen */}
            <Stack.Screen 
              name="ResetPassword" 
              component={ResetPasswordScreen}
              options={{
                presentation: 'card',
                animationEnabled: true,
              }}
            />
          </>
        ) : !hasCompletedOnboarding ? (
          // Onboarding Stack
          <Stack.Screen name="OnboardingData" component={OnboardingDataScreen} />
        ) : (
          // Main App with Tabs
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            
            {/* Modal/Overlay Screens - Open on top of tabs */}
            <Stack.Screen 
              name="AddFood" 
              component={AddFoodScreen}
              options={{ 
                presentation: 'modal',
                headerShown: false 
              }}
            />
            <Stack.Screen 
              name="ExerciseLibrary" 
              component={ExerciseLibraryScreen}
              options={{ 
                presentation: 'modal',
                headerShown: false 
              }}
            />
            <Stack.Screen 
              name="Progress" 
              component={ProgressScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="About" 
              component={AboutScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="HelpSupport" 
              component={HelpSupportScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.textPrimary,
  },
});

export default AppNavigator;