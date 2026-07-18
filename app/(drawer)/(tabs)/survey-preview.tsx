import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { SurveyContext } from '../../context/SurveyContext';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function SurveyPreviewScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { addSurvey } = useContext(SurveyContext);
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';

  const handleSubmit = () => {
    // Cast params back to expected types
    const surveyData = {
      id: params.id as string,
      siteName: params.siteName as string,
      clientName: params.clientName as string,
      description: params.description as string,
      priority: params.priority as string,
      date: params.date as string,
      contact: params.contact as string,
      location: params.location as string,
      photo: params.photo as string,
    };

    addSurvey(surveyData);
    
    Alert.alert('Success', 'Survey has been submitted successfully!', [
      { text: 'OK', onPress: () => router.push('/') }
    ]);
  };

  const handleCopySummary = async () => {
    const summary = `Site:\n${params.siteName}\n\nClient:\n${params.clientName}\n\nPriority:\n${params.priority}\n\nLocation:\n${params.location || 'N/A'}\n\nContact:\n${params.contact || 'N/A'}\n\nDate:\n${params.date}`;
    await Clipboard.setStringAsync(summary);
    Alert.alert('Copied!', 'Survey summary has been copied to your clipboard. You can now paste it into WhatsApp, Email, or Notes.');
  };

  const DetailRow = ({ icon, label, value }: { icon: any, label: string, value: string | undefined }) => (
    <View style={[styles.detailRow, { borderBottomColor: theme === 'dark' ? '#333' : '#F3F4F6' }]}>
      <View style={styles.detailLabelContainer}>
        <Ionicons name={icon} size={20} color={Colors[theme].tint} style={styles.detailIcon} />
        <Text style={styles.detailLabel}>{label}</Text>
      </View>
      <Text style={[styles.detailValue, { color: Colors[theme].text }]}>{value || 'Not provided'}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[theme].background }]} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors[theme].text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: Colors[theme].text }]}>Survey Preview</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, { backgroundColor: theme === 'dark' ? '#1c1c1e' : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: Colors[theme].text }]}>General Details</Text>
          <DetailRow icon="business-outline" label="Site Name" value={params.siteName as string} />
          <DetailRow icon="person-outline" label="Client" value={params.clientName as string} />
          <DetailRow icon="calendar-outline" label="Date" value={params.date as string} />
          <DetailRow icon="flag-outline" label="Priority" value={params.priority as string} />
        </View>

        <View style={[styles.card, { backgroundColor: theme === 'dark' ? '#1c1c1e' : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: Colors[theme].text }]}>Additional Info</Text>
          <DetailRow icon="call-outline" label="Contact" value={params.contact as string} />
          <DetailRow icon="location-outline" label="Location" value={params.location as string} />
          <DetailRow icon="image-outline" label="Photo" value={params.photo ? 'Photo Attached' : 'No photo'} />
        </View>

        <View style={[styles.card, { backgroundColor: theme === 'dark' ? '#1c1c1e' : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: Colors[theme].text }]}>Notes / Description</Text>
          <Text style={[styles.notesText, { color: params.description ? Colors[theme].text : '#888' }]}>
            {params.description || 'No notes provided.'}
          </Text>
        </View>

        <Pressable 
          style={[styles.copySummaryButton, { backgroundColor: theme === 'dark' ? '#333' : '#f0f0f0' }]} 
          onPress={handleCopySummary}
        >
          <Ionicons name="copy-outline" size={20} color={Colors[theme].text} />
          <Text style={[styles.copySummaryText, { color: Colors[theme].text }]}>Copy Survey Summary</Text>
        </Pressable>

        <View style={styles.actionButtons}>
          <Pressable 
            style={[styles.editButton, { borderColor: Colors[theme].tint }]} 
            onPress={() => router.back()}
          >
            <Ionicons name="pencil" size={20} color={Colors[theme].tint} />
            <Text style={[styles.editButtonText, { color: Colors[theme].tint }]}>Edit Survey</Text>
          </Pressable>
          
          <Pressable 
            style={[styles.submitButton, { backgroundColor: Colors[theme].tint }]} 
            onPress={handleSubmit}
          >
            <Ionicons name="checkmark-circle" size={20} color={theme === 'dark' ? '#000' : '#fff'} />
            <Text style={[styles.submitButtonText, { color: theme === 'dark' ? '#000' : '#fff' }]}>Submit Survey</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  detailLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailIcon: {
    marginRight: 10,
  },
  detailLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#888',
  },
  detailValue: {
    flex: 1.5,
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'right',
  },
  notesText: {
    fontSize: 15,
    lineHeight: 24,
  },
  copySummaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  copySummaryText: {
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 10,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    gap: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  submitButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
