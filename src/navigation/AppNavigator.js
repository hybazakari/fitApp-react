import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';

// Main Screens
import DashboardScreen from '../screens/DashboardScreen';
import ProgrammeScreen from '../screens/ProgrammeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProgressScreen from '../screens/ProgressScreen';

// Nutrition Screens
import DailyNutritionScreen from '../screens/nutrition/DailyNutritionScreen';
import AddFoodScreen from '../screens/nutrition/AddFoodScreen';

// Workout Screens
import ExerciseLibraryScreen from '../screens/workout/ExerciseLibraryScreen';

// Modal Screens
import PageAjoutRepasScreen from '../screens/modals/PageAjoutRepasScreen';
import PageExercicesScreen from '../screens/modals/PageExercicesScreen';
import PageAddExerciceScreen from '../screens/modals/PageAddExerciceScreen';
import PageSeanceScreen from '../screens/modals/PageSeanceScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack Navigator (Public Routes)
const AuthStack = () => {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#fff' }
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
};

// Bottom Tab Navigator (Protected Routes)
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Nutrition') {
            iconName = focused ? 'nutrition' : 'nutrition-outline';
          } else if (route.name === 'Programme') {
            iconName = focused ? 'barbell' : 'barbell-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4318FF',
        tabBarInactiveTintColor: '#A3AED0',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen 
        name="Nutrition" 
        component={DailyNutritionScreen}
        options={{ title: 'Nutrition' }}
      />
      <Tab.Screen 
        name="Programme" 
        component={ProgrammeScreen}
        options={{ title: 'Workout' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

// Main App Stack (Protected with Modals)
const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Main" 
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      
      {/* Modal Screens - These slide up like native modals */}
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen 
          name="AddFood" 
          component={AddFoodScreen}
          options={{ 
            title: 'Add Food',
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="ExerciseLibrary" 
          component={ExerciseLibraryScreen}
          options={{ 
            title: 'Exercise Library',
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="Progress" 
          component={ProgressScreen}
          options={{ 
            title: 'Progress',
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="PageAjoutRepas" 
          component={PageAjoutRepasScreen}
          options={{ 
            title: 'Ajouter un Repas',
            headerStyle: { backgroundColor: '#007AFF' },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen 
          name="PageExercices" 
          component={PageExercicesScreen}
          options={{ 
            title: 'Exercices',
            headerStyle: { backgroundColor: '#007AFF' },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen 
          name="PageAddExercice" 
          component={PageAddExerciceScreen}
          options={{ 
            title: 'Ajouter un Exercice',
            headerStyle: { backgroundColor: '#007AFF' },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen 
          name="PageSeance" 
          component={PageSeanceScreen}
          options={{ 
            title: 'Séance d\'Entraînement',
            headerStyle: { backgroundColor: '#007AFF' },
            headerTintColor: '#fff',
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

// Root Navigator - Switches between Auth and App based on authentication status
const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4318FF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#4318FF',
    fontWeight: '500',
  },
});

export default AppNavigator;
