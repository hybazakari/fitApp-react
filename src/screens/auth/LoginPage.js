import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, COMMON_STYLES, SHADOWS } from '../../constants/theme';
import { AuthContext } from '../../context/AuthContext';

const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    // Dismiss keyboard
    Keyboard.dismiss();
    
    // Validation
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    
    try {
      // Call your auth service here
      await login(email, password);
      // Navigation will be handled by AuthContext
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  const navigateToForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in to continue your fitness journey
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={[
                  styles.input,
                  emailFocused && styles.inputFocused
                ]}
                placeholder="Enter your email"
                placeholderTextColor={COLORS.textMuted}
                value={email}
                onChangeText={setEmail}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={[
                  styles.input,
                  passwordFocused && styles.inputFocused
                ]}
                placeholder="Enter your password"
                placeholderTextColor={COLORS.textMuted}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={navigateToForgotPassword}
              disabled={loading}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            {/* Register Link */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={navigateToRegister} disabled={loading}>
                <Text style={styles.registerLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom Spacing for Keyboard */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...COMMON_STYLES.container,
  },
  
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  
  header: {
    marginBottom: SPACING.xxxl,
    alignItems: 'center',
  },
  
  title: {
    ...COMMON_STYLES.h1,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  
  subtitle: {
    ...COMMON_STYLES.bodySecondary,
    textAlign: 'center',
  },
  
  formContainer: {
    width: '100%',
  },
  
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  
  label: {
    ...COMMON_STYLES.inputLabel,
  },
  
  input: {
    ...COMMON_STYLES.input,
    height: 56,
  },
  
  inputFocused: {
    ...COMMON_STYLES.inputFocused,
    ...SHADOWS.small,
  },
  
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.xl,
  },
  
  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  
  loginButton: {
    ...COMMON_STYLES.button,
    height: 56,
    marginBottom: SPACING.lg,
  },
  
  loginButtonDisabled: {
    opacity: 0.6,
  },
  
  loginButtonText: {
    ...COMMON_STYLES.buttonText,
    fontSize: TYPOGRAPHY.sizes.lg,
  },
  
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },
  
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.divider,
  },
  
  dividerText: {
    ...COMMON_STYLES.caption,
    marginHorizontal: SPACING.base,
  },
  
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  registerText: {
    ...COMMON_STYLES.bodySecondary,
  },
  
  registerLink: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.semiBold,
  },
  
  bottomSpacer: {
    height: SPACING.xl,
  },
});

export default LoginPage;
