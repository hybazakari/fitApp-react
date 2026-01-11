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

const RegisterScreen = ({ navigation }) => {
  const { register } = useAuth();
  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [loading, setLoading] = useState(false);

  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmRef = useRef(null);

  const handleRegister = async () => {
    if (!form.prenom || !form.nom || !form.email || !form.password) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires');
      return;
    }

    if (form.password !== form.confirm) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    const res = await register(
      form.prenom,
      form.nom,
      form.email.trim(),
      form.password
    );
    setLoading(false);

    if (!res.success) {
      Alert.alert('Erreur', res.error);
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
            title="Create Account"
            subtitle="Join MyFit today"
            showBackButton={false}
          />

          <View style={styles.form}>

            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={form.prenom}
              onChangeText={v => setForm({ ...form, prenom: v })}
              returnKeyType="next"
              onSubmitEditing={() => lastNameRef.current.focus()}
            />

            <TextInput
              ref={lastNameRef}
              style={styles.input}
              placeholder="Last Name"
              value={form.nom}
              onChangeText={v => setForm({ ...form, nom: v })}
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current.focus()}
            />

            <TextInput
              ref={emailRef}
              style={styles.input}
              placeholder="Email"
              value={form.email}
              onChangeText={v => setForm({ ...form, email: v })}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current.focus()}
            />

            <TextInput
              ref={passwordRef}
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={form.password}
              onChangeText={v => setForm({ ...form, password: v })}
              returnKeyType="next"
              onSubmitEditing={() => confirmRef.current.focus()}
            />

            <TextInput
              ref={confirmRef}
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry
              value={form.confirm}
              onChangeText={v => setForm({ ...form, confirm: v })}
              returnKeyType="done"
              onSubmitEditing={handleRegister}
            />

            <TouchableOpacity
              style={[COMMON_STYLES.buttonPrimary, loading && styles.disabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={COMMON_STYLES.buttonText}>
                {loading ? 'Création...' : 'Créer le compte'}
              </Text>
            </TouchableOpacity>

            {/* Spacer between buttons */}
            <View style={{ height: SPACING.md }} />

            {/* Login redirect under create account */}
            <TouchableOpacity
              style={COMMON_STYLES.buttonSecondary}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={COMMON_STYLES.buttonTextSecondary}>
                j'ai déjà un compte. Se connecter
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
    marginTop: SPACING.lg,
  },
  input: {
    height: 50,
    borderBottomWidth: 1,
    borderColor: COLORS.divider,
    marginBottom: SPACING.lg,
    fontSize: TYPOGRAPHY.sizes.base,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default RegisterScreen;
