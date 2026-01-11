import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const PageExercicesScreen = () => {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Ionicons name="barbell" size={48} color="#4ECDC4" />
          <Text style={styles.headerText}>Liste de vos exercices</Text>
        </View>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            Aucun exercice pour le moment
          </Text>
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
  placeholder: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#7F8C8D',
  },
});

export default PageExercicesScreen;
