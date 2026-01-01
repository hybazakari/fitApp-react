import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const PageSeanceScreen = () => {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Ionicons name="play-circle" size={48} color="#4ECDC4" />
          <Text style={styles.headerText}>Séance d'entraînement</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.infoText}>
            Commencez votre séance d'entraînement et suivez vos performances
          </Text>

          <TouchableOpacity style={styles.startButton}>
            <Ionicons name="play" size={32} color="#fff" />
            <Text style={styles.startButtonText}>Démarrer la séance</Text>
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
  content: {
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 32,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4ECDC4',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 12,
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
});

export default PageSeanceScreen;
