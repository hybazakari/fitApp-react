import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { COLORS, SPACING, TYPOGRAPHY, COMMON_STYLES } from '../../constants/theme';
import SafeHeader from '../../components/SafeHeader';

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordRef = useRef(null);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    const res = await login(email.trim(), password);
    setLoading(false);

    if (!res.success) {
      Alert.alert('Connexion échouée', res.error);
    }
  };

  return (
    <SafeAreaView style={COMMON_STYLES.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >

          <SafeHeader
            title="Welcome Back"
            subtitle="Sign in to continue"
            showBackButton={false}
          />

          <View style={styles.form}>

            {/* EMAIL */}
            <View style={COMMON_STYLES.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={COLORS.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current.focus()}
              />
            </View>

            {/* PASSWORD */}
            <View style={COMMON_STYLES.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.textMuted} />
              <TextInput
                ref={passwordRef}
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={COLORS.textMuted}
                />
              </TouchableOpacity>
            </View>

            {/* LOGIN BUTTON */}
            <TouchableOpacity
              style={[COMMON_STYLES.buttonPrimary, loading && styles.disabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={COMMON_STYLES.buttonText}>
                {loading ? 'Connexion...' : 'Se connecter'}
              </Text>
            </TouchableOpacity>

            {/* Spacer between buttons */}
            <View style={{ height: SPACING.md }} />

            {/* REGISTER */}
            <TouchableOpacity
              style={COMMON_STYLES.buttonSecondary}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={COMMON_STYLES.buttonTextSecondary}>
                Créer un compte
              </Text>
            </TouchableOpacity>

            {/* Forgot Password */}
            <TouchableOpacity
              style={[COMMON_STYLES.buttonSecondary, { marginTop: SPACING.sm }]}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={COMMON_STYLES.buttonTextSecondary}>
                Mot de passe oublié
              </Text>
            </TouchableOpacity>

          </View>

        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  form: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: TYPOGRAPHY.sizes.base,
    marginLeft: SPACING.sm,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default LoginScreen;
