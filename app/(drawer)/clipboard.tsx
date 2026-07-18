import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SurveyContext } from '../context/SurveyContext';

export default function ClipboardScreen() {
  const [notes, setNotes] = useState('');
  const { surveys } = useContext(SurveyContext);
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';

  const copySurveyId = async () => {
    const latestSurvey = surveys.length > 0 ? surveys[0].id : 'SRV-12345';
    await Clipboard.setStringAsync(latestSurvey);
    Alert.alert('Copied!', `Survey ID ${latestSurvey} copied to clipboard.`);
  };

  const copyContactNumber = async () => {
    const defaultNumber = '+1 (555) 123-4567';
    await Clipboard.setStringAsync(defaultNumber);
    Alert.alert('Copied!', `Contact number ${defaultNumber} copied to clipboard.`);
  };

  const copyLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required.');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      const coordsStr = `${loc.coords.latitude.toFixed(4)}, ${loc.coords.longitude.toFixed(4)}`;
      await Clipboard.setStringAsync(coordsStr);
      Alert.alert('Copied!', `Location coordinates ${coordsStr} copied.`);
    } catch (e) {
      Alert.alert('Error', 'Failed to get location.');
    }
  };

  const pasteNotes = async () => {
    const hasString = await Clipboard.hasStringAsync();
    if (hasString) {
      const text = await Clipboard.getStringAsync();
      setNotes((prev) => prev ? `${prev}\n${text}` : text);
      Alert.alert('Pasted!', 'Content pasted from clipboard.');
    } else {
      Alert.alert('Empty', 'No text found in clipboard.');
    }
  };

  const clearClipboard = async () => {
    await Clipboard.setStringAsync('');
    Alert.alert('Cleared!', 'Clipboard data has been cleared.');
  };

  const ActionCard = ({ title, icon, onPress, bgColor, textColor }: any) => (
    <Pressable 
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: bgColor, opacity: pressed ? 0.8 : 1 }
      ]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={24} color={textColor} />
      <Text style={[styles.cardText, { color: textColor }]}>{title}</Text>
    </Pressable>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: Colors[theme].background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.header, { color: Colors[theme].text }]}>Clipboard Actions</Text>
        
        <View style={styles.grid}>
          <ActionCard 
            title="Copy Survey ID" 
            icon="document-text-outline" 
            onPress={copySurveyId} 
            bgColor={theme === 'dark' ? '#2c2c2e' : '#f0f0f0'}
            textColor={Colors[theme].text}
          />
          <ActionCard 
            title="Copy Contact" 
            icon="call-outline" 
            onPress={copyContactNumber} 
            bgColor={theme === 'dark' ? '#2c2c2e' : '#f0f0f0'}
            textColor={Colors[theme].text}
          />
          <ActionCard 
            title="Copy Location" 
            icon="location-outline" 
            onPress={copyLocation} 
            bgColor={theme === 'dark' ? '#2c2c2e' : '#f0f0f0'}
            textColor={Colors[theme].text}
          />
          <ActionCard 
            title="Clear Clipboard" 
            icon="trash-outline" 
            onPress={clearClipboard} 
            bgColor={theme === 'dark' ? '#3a1c1c' : '#ffebeb'}
            textColor="#ff4444"
          />
        </View>

        <View style={[styles.notesSection, { backgroundColor: theme === 'dark' ? '#1c1c1e' : '#fff' }]}>
          <View style={styles.notesHeader}>
            <Text style={[styles.notesTitle, { color: Colors[theme].text }]}>Inspection Notes</Text>
            <Pressable onPress={pasteNotes} style={styles.pasteButton}>
              <Ionicons name="clipboard-outline" size={18} color={Colors[theme].tint} />
              <Text style={[styles.pasteText, { color: Colors[theme].tint }]}>Paste</Text>
            </Pressable>
          </View>
          
          <TextInput
            style={[styles.textInput, { 
              color: Colors[theme].text, 
              backgroundColor: theme === 'dark' ? '#2c2c2e' : '#f9f9f9',
              borderColor: theme === 'dark' ? '#333' : '#e0e0e0'
            }]}
            multiline
            placeholder="Type or paste notes here..."
            placeholderTextColor="#888"
            value={notes}
            onChangeText={setNotes}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 40,
    paddingBottom: 60,
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 32,
  },
  card: {
    width: '47%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    gap: 12,
  },
  cardText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  notesSection: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  notesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  notesTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  pasteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
  },
  pasteText: {
    fontSize: 14,
    fontWeight: '600',
  },
  textInput: {
    height: 150,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    fontSize: 16,
    lineHeight: 24,
  },
});
