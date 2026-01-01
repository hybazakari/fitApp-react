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
import apiService from '../../services/apiService';

const PageAddExerciceScreen = ({ navigation }) => {
  const [exercise, setExercise] = useState({
    nom: '',
    categorie: '',
    description: '',
    muscles: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field, value) => {
    setExercise(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!exercise.nom || !exercise.categorie) {
      Alert.alert('Erreur', 'Veuillez au moins renseigner le nom et la catégorie');
      return;
    }

    setIsLoading(true);
    try {
      await apiService.post('/exercises', exercise);
      Alert.alert('Succès', 'Exercice ajouté avec succès', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ajouter l\'exercice');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Ionicons name="add-circle" size={48} color="#956CE6" />
          <Text style={styles.headerText}>Créer un nouvel exercice</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom de l'exercice *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Développé couché"
              value={exercise.nom}
              onChangeText={(value) => handleChange('nom', value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Catégorie *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Pectoraux"
              value={exercise.categorie}
              onChangeText={(value) => handleChange('categorie', value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Muscles ciblés</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Pectoraux, Triceps, Épaules"
              value={exercise.muscles}
              onChangeText={(value) => handleChange('muscles', value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Décrivez l'exercice..."
              value={exercise.description}
              onChangeText={(value) => handleChange('description', value)}
              multiline
              numberOfLines={4}
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
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
    backgroundColor: '#956CE6',
    marginLeft: 8,
    shadowColor: '#956CE6',
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

export default PageAddExerciceScreen;
