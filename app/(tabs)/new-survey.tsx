import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  ScrollView, 
  Pressable, 
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SurveyContext } from '../context/SurveyContext';

export default function NewSurveyScreen() {
  const { addSurvey } = useContext(SurveyContext);
  const router = useRouter();
  const [siteName, setSiteName] = useState('');
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium'); // Low, Medium, High
  const [surveyDate, setSurveyDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    // Close the picker on Android after selection
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setSurveyDate(selectedDate);
    }
  };

  const handleSubmit = () => {
    // 1. Validate required fields
    if (!siteName.trim()) {
      Alert.alert('Validation Error', 'Please enter a Site Name.');
      return;
    }
    if (!clientName.trim()) {
      Alert.alert('Validation Error', 'Please enter a Client Name.');
      return;
    }
    if (!surveyDate) {
      Alert.alert('Validation Error', 'Please select a Survey Date.');
      return;
    }

    // 2. Process submission
    const formattedDate = surveyDate.toLocaleDateString();
    const newSurvey = {
      id: Date.now().toString(),
      siteName,
      clientName,
      description,
      priority,
      date: formattedDate,
    };
    addSurvey(newSurvey);

    Alert.alert('Success', 'Survey has been created successfully!', [
      { text: 'OK', onPress: () => router.push('/') }
    ]);
    
    // 3. Clear form
    setSiteName('');
    setClientName('');
    setDescription('');
    setPriority('Medium');
    setSurveyDate(new Date());
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <Text style={styles.title}>Create Survey</Text>
            <Text style={styles.subtitle}>Fill in the details for the new inspection.</Text>
          </View>

          <View style={styles.formCard}>
            
            {/* Site Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Site Name <Text style={styles.requiredAsterisk}>*</Text></Text>
              <View style={styles.inputContainer}>
                <Ionicons name="location-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Downtown Plaza"
                  placeholderTextColor="#9CA3AF"
                  value={siteName}
                  onChangeText={setSiteName}
                />
              </View>
            </View>

            {/* Client Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Client Name <Text style={styles.requiredAsterisk}>*</Text></Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Acme Corp"
                  placeholderTextColor="#9CA3AF"
                  value={clientName}
                  onChangeText={setClientName}
                />
              </View>
            </View>

            {/* Date Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date <Text style={styles.requiredAsterisk}>*</Text></Text>
              <Pressable 
                style={styles.inputContainer}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                <Text style={[styles.input, { paddingTop: Platform.OS === 'ios' ? 15 : 12 }]}>
                  {surveyDate.toLocaleDateString()}
                </Text>
              </Pressable>

              {/* Show inline on iOS, or as a popup when requested on Android */}
              {(showDatePicker || Platform.OS === 'ios') && (
                <View style={{ marginTop: Platform.OS === 'ios' ? 10 : 0 }}>
                  <DateTimePicker
                    value={surveyDate}
                    mode="date"
                    display="default"
                    onChange={onChangeDate}
                  />
                </View>
              )}
            </View>

            {/* Priority Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Priority</Text>
              <View style={styles.priorityContainer}>
                {['Low', 'Medium', 'High'].map((level) => (
                  <Pressable
                    key={level}
                    style={[
                      styles.priorityButton,
                      priority === level && styles.priorityButtonActive
                    ]}
                    onPress={() => setPriority(level)}
                  >
                    <Text 
                      style={[
                        styles.priorityText,
                        priority === level && styles.priorityTextActive
                      ]}
                    >
                      {level}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Description Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description (Optional)</Text>
              <View style={[styles.inputContainer, styles.textAreaContainer]}>
                <TextInput
                  style={styles.textArea}
                  placeholder="Add any extra details here..."
                  placeholderTextColor="#9CA3AF"
                  value={description}
                  onChangeText={setDescription}
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* Submit Button */}
            <Pressable 
              style={({ pressed }) => [
                styles.submitButton,
                pressed && styles.submitButtonPressed
              ]}
              onPress={handleSubmit}
            >
              <Ionicons name="save-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.submitButtonText}>Save Survey</Text>
            </Pressable>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    marginTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  requiredAsterisk: {
    color: '#EF4444',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    height: '100%',
  },
  textAreaContainer: {
    height: 100,
    paddingVertical: 12,
    alignItems: 'flex-start',
  },
  textArea: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    width: '100%',
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  priorityButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  priorityButtonActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#4F46E5',
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  priorityTextActive: {
    color: '#4F46E5',
  },
  submitButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 10,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  }
});
