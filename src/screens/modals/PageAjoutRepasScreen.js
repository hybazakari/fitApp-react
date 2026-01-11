import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, COMMON_STYLES } from '../../constants/theme';
import apiService from '../../services/apiService';

const PageAjoutRepasScreen = ({ navigation }) => {
  const [meal, setMeal] = useState({
    nom: '',
    calories: '',
    proteines: '',
    glucides: '',
    lipides: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field, value) => {
    setMeal(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!meal.nom || !meal.calories) {
      Alert.alert('Erreur', 'Veuillez au moins renseigner le nom et les calories');
      return;
    }

    setIsLoading(true);
    try {
      await apiService.post('/meals', {
        ...meal,
        calories: parseFloat(meal.calories) || 0,
        proteines: parseFloat(meal.proteines) || 0,
        glucides: parseFloat(meal.glucides) || 0,
        lipides: parseFloat(meal.lipides) || 0,
      });
      Alert.alert('Succès', 'Repas ajouté avec succès', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ajouter le repas');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Ionicons name="restaurant" size={48} color="#FF6B6B" />
          <Text style={styles.headerText}>Ajouter un repas à votre journal</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom du repas *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Poulet grillé avec riz"
              value={meal.nom}
              onChangeText={(value) => handleChange('nom', value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Calories (kcal) *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 450"
              value={meal.calories}
              onChangeText={(value) => handleChange('calories', value)}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.macrosContainer}>
            <View style={[styles.inputGroup, styles.macroInput]}>
              <Text style={styles.label}>Protéines (g)</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                value={meal.proteines}
                onChangeText={(value) => handleChange('proteines', value)}
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputGroup, styles.macroInput]}>
              <Text style={styles.label}>Glucides (g)</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                value={meal.glucides}
                onChangeText={(value) => handleChange('glucides', value)}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Lipides (g)</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              value={meal.lipides}
              onChangeText={(value) => handleChange('lipides', value)}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.submitButton, isLoading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? 'Ajout...' : 'Ajouter'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerText: {
    fontSize: 18,
    color: '#2C3E50',
    marginTop: 12,
    textAlign: 'center',
  },
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2C3E50',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroInput: {
    flex: 1,
    marginRight: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#7F8C8D',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#FF6B6B',
    marginLeft: 8,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default PageAjoutRepasScreen;
