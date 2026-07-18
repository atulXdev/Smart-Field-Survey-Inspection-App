import { Ionicons } from '@expo/vector-icons';
import React, { useContext } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SurveyContext } from '../../context/SurveyContext';

export default function DashboardScreen() {
  const { surveys } = useContext(SurveyContext);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Custom App Header / Welcome Screen */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Good morning,</Text>
            <Text style={styles.userName}>Atul Singh</Text>
          </View>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>AS</Text>
          </View>
        </View>

        {/* Student Details Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="person-outline" size={20} color="#4F46E5" />
            <Text style={styles.cardTitle}>Student Profile</Text>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>ID Number</Text>
              <Text style={styles.infoValue}>STU-2023-001</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Course</Text>
              <Text style={styles.infoValue}>Field Surveying 101</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Batch</Text>
              <Text style={styles.infoValue}>Morning Session</Text>
            </View>
          </View>
        </View>

        {/* Today's Survey Count */}
        <View style={styles.highlightCard}>
          <View style={styles.highlightContent}>
            <Text style={styles.highlightTitle}>Today's Surveys</Text>
            <Text style={styles.subText}>Completed so far</Text>
          </View>
          <View style={styles.countCircle}>
            <Text style={styles.countText}>{surveys.length}</Text>
          </View>
        </View>

        {/* Quick Action Cards */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              styles.primaryButton,
              pressed && styles.buttonPressed
            ]}
            onPress={() => router.push('/new-survey')}
          >
            <Ionicons name="add-circle" size={24} color="#FFF" style={styles.actionIcon} />
            <Text style={styles.primaryActionText}>New Survey</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              styles.secondaryButton,
              pressed && styles.buttonPressed
            ]}
            onPress={() => router.push('/history')}
          >
            <Ionicons name="time" size={24} color="#4F46E5" style={styles.actionIcon} />
            <Text style={styles.secondaryActionText}>View History</Text>
          </Pressable>
        </View>

        {/* Recent Survey Summary */}
        <View style={styles.recentHeaderContainer}>
          <Text style={styles.sectionTitle}>Recent Surveys</Text>
          <Text style={styles.seeAllText}>See all</Text>
        </View>

        <View style={styles.listCard}>
          {surveys.slice(0, 3).map((survey, index) => (
            <React.Fragment key={survey.id}>
              <Pressable style={({ pressed }) => [styles.surveyItem, pressed && styles.itemPressed]}>
                <View style={styles.surveyIconContainer}>
                  <Ionicons name="location" size={20} color={index === 0 ? "#10B981" : "#F59E0B"} />
                </View>
                <View style={styles.surveyItemContent}>
                  <Text style={styles.surveyTitle}>{survey.siteName}</Text>
                  <Text style={styles.surveyClient}>Client: {survey.clientName}</Text>
                </View>
                <Text style={styles.surveyDate}>{survey.date}</Text>
              </Pressable>
              {index < Math.min(surveys.length, 3) - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
          {surveys.length === 0 && (
            <Text style={{ padding: 16, textAlign: 'center', color: '#6B7280' }}>No surveys yet.</Text>
          )}
        </View>

        {/* Bottom padding for scroll */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Modern light gray background
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
    marginTop: 10,
  },
  welcomeText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  avatarText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 8,
  },
  cardBody: {
    gap: 12, // React Native spacing between flex items
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  highlightCard: {
    backgroundColor: '#4F46E5', // Deep indigo
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  highlightContent: {
    flex: 1,
  },
  highlightTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  subText: {
    color: '#E0E7FF',
    fontSize: 14,
    fontWeight: '500',
  },
  countCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  countText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  primaryButton: {
    backgroundColor: '#4F46E5',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  actionIcon: {
    marginRight: 8,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  secondaryActionText: {
    color: '#4F46E5',
    fontWeight: '700',
    fontSize: 15,
  },
  recentHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seeAllText: {
    color: '#4F46E5',
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 16,
  },
  listCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  surveyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  itemPressed: {
    backgroundColor: '#F9FAFB',
  },
  surveyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  surveyItemContent: {
    flex: 1,
  },
  surveyTitle: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
    marginBottom: 4,
  },
  surveyClient: {
    fontSize: 13,
    color: '#6B7280',
  },
  surveyDate: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  bottomSpacer: {
    height: 30,
  }
});
