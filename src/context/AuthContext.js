import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from '../services/apiService';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from AsyncStorage on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userData = await AsyncStorage.getItem('userData');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
        // Set token in API service for subsequent requests
        apiService.setAuthToken(token);
      }
    } catch (err) {
      console.error('Error checking auth status:', err);
      await clearStorage();
    } finally {
      setLoading(false);
    }
  };

  const clearStorage = async () => {
    try {
      await AsyncStorage.multiRemove(['authToken', 'userData', 'refreshToken']);
    } catch (err) {
      console.error('Error clearing storage:', err);
    }
  };

  // Login function (MOCK - No API required)
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get stored users from AsyncStorage
      const storedUsers = await AsyncStorage.getItem('mockUsers');
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      // Find user by email
      const foundUser = users.find(u => u.email === email);

      if (!foundUser) {
        setLoading(false);
        const errorMessage = 'Email non trouvé';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      if (foundUser.password !== password) {
        setLoading(false);
        const errorMessage = 'Mot de passe incorrect';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      // Create mock token and user data
      const token = `mock_token_${Date.now()}`;
      const userData = {
        id: foundUser.id,
        email: foundUser.email,
        prenom: foundUser.prenom,
        nom: foundUser.nom,
      };

      // Store auth data in AsyncStorage
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));

      // Set token in API service
      apiService.setAuthToken(token);
      
      setUser(userData);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      const errorMessage = 'Échec de la connexion';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Register function (MOCK - No API required)
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get existing users
      const storedUsers = await AsyncStorage.getItem('mockUsers');
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      // Check if email already exists
      const existingUser = users.find(u => u.email === userData.email);
      if (existingUser) {
        setLoading(false);
        const errorMessage = 'Cet email est déjà utilisé';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      // Create new user
      const newUser = {
        id: `user_${Date.now()}`,
        email: userData.email,
        prenom: userData.prenom,
        nom: userData.nom,
        password: userData.password, // In real app, this would be hashed
        createdAt: new Date().toISOString(),
      };

      // Add to users list
      users.push(newUser);
      await AsyncStorage.setItem('mockUsers', JSON.stringify(users));

      // Create mock token
      const token = `mock_token_${Date.now()}`;
      const userDataToStore = {
        id: newUser.id,
        email: newUser.email,
        prenom: newUser.prenom,
        nom: newUser.nom,
      };

      // Store auth data in AsyncStorage
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(userDataToStore));

      // Set token in API service
      apiService.setAuthToken(token);
      
      setUser(userDataToStore);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      const errorMessage = 'Échec de l\'inscription';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      
      // Call logout API if available
      try {
        await apiService.post('/auth/logout');
      } catch (err) {
        console.log('Logout API call failed, proceeding with local logout');
      }

      // Clear AsyncStorage
      await clearStorage();
      
      // Clear API service token
      apiService.setAuthToken(null);
      
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError('Erreur lors de la déconnexion');
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      setError(null);
      const response = await apiService.put('/user/profile', updates);
      
      const updatedUser = { ...user, ...response.data.user };
      
      // Update AsyncStorage
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Échec de la mise à jour du profil';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Get user profile from server
  const fetchProfile = async () => {
    try {
      const response = await apiService.get('/user/profile');
      const userData = response.data.user;
      
      // Update AsyncStorage
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Échec du chargement du profil';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      setError(null);
      await apiService.post('/auth/forgot-password', { email });
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Échec de l\'envoi de l\'email';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Reset password
  const resetPassword = async (token, newPassword) => {
    try {
      setError(null);
      await apiService.post('/auth/reset-password', { 
        token, 
        password: newPassword 
      });
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Échec de la réinitialisation du mot de passe';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Refresh token function
  const refreshAuthToken = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiService.post('/auth/refresh', { refreshToken });
      const { token } = response.data;

      await AsyncStorage.setItem('authToken', token);
      apiService.setAuthToken(token);

      return { success: true };
    } catch (err) {
      console.error('Token refresh failed:', err);
      await logout();
      return { success: false };
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    fetchProfile,
    forgotPassword,
    resetPassword,
    refreshAuthToken,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
