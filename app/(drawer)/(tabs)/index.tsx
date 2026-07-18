import { Ionicons } from '@expo/vector-icons';
import React, { useContext } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SurveyContext } from '../../context/SurveyContext';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function DashboardScreen() {
  const { surveys } = useContext(SurveyContext);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const activeColors = Colors[theme];

  // Get current date formatted like "Monday, Oct 24"
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeColors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back</Text>
            <Text style={[styles.userName, { color: activeColors.text }]}>Atul Singh</Text>
            <Text style={styles.dateText}>{currentDate}</Text>
          </View>
          <View style={[styles.avatar, { backgroundColor: activeColors.tint }]}>
            <Text style={styles.avatarText}>AS</Text>
          </View>
        </View>

        {/* Today's Overview */}
        <Text style={[styles.sectionTitle, { color: activeColors.text }]}>Today's Overview</Text>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
            <View style={[styles.statIconContainer, { backgroundColor: activeColors.tint + '10' }]}>
              <Ionicons name="checkmark-circle-outline" size={20} color={activeColors.tint} />
            </View>
            <Text style={[styles.statNumber, { color: activeColors.text }]}>{surveys.length}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
            <View style={[styles.statIconContainer, { backgroundColor: activeColors.warning + '10' }]}>
              <Ionicons name="time-outline" size={20} color={activeColors.warning} />
            </View>
            <Text style={[styles.statNumber, { color: activeColors.text }]}>4</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        {/* Primary Action */}
        <Pressable
          style={({ pressed }) => [
            styles.primaryActionBtn,
            { backgroundColor: activeColors.tint },
            pressed && styles.pressedState
          ]}
          onPress={() => router.push('/new-survey')}
        >
          <Ionicons name="play-outline" size={20} color="#FFF" style={styles.btnIcon} />
          <Text style={styles.primaryActionBtnText}>Continue Inspection</Text>
        </Pressable>

        {/* Recent Activity (More Important) */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: activeColors.text, marginBottom: 0 }]}>Recent Surveys</Text>
          <Pressable onPress={() => router.push('/history')}>
            <Text style={[styles.seeAllText, { color: activeColors.tint }]}>See all</Text>
          </Pressable>
        </View>

        <View style={[styles.listContainer, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
          {surveys.slice(0, 3).map((survey, index) => {
            const getPriorityColor = (priority: string) => {
              switch (priority) {
                case 'High': return activeColors.danger;
                case 'Medium': return activeColors.warning;
                case 'Low': return activeColors.success;
                default: return activeColors.icon;
              }
            };
            return (
              <React.Fragment key={survey.id}>
                <Pressable
                  style={({ pressed }) => [
                    styles.surveyItem,
                    pressed && { backgroundColor: theme === 'dark' ? '#2d3748' : '#f8fafc' }
                  ]}
                  onPress={() => router.push({ pathname: '/survey-details', params: { ...survey } })}
                >
                  <View style={[styles.surveyIcon, { backgroundColor: getPriorityColor(survey.priority) + '10' }]}>
                    <Ionicons name="business-outline" size={18} color={getPriorityColor(survey.priority)} />
                  </View>
                  <View style={styles.surveyMeta}>
                    <Text style={[styles.surveyTitleText, { color: activeColors.text }]} numberOfLines={1}>
                      {survey.siteName}
                    </Text>
                    <Text style={styles.surveySubText} numberOfLines={1}>
                      Client: {survey.clientName}
                    </Text>
                  </View>
                  <View style={styles.surveyRight}>
                    <Text style={styles.surveyDateText}>{survey.date.split(' ')[0]}</Text>
                    <Ionicons name="chevron-forward" size={16} color={activeColors.icon} />
                  </View>
                </Pressable>
                {index < Math.min(surveys.length, 3) - 1 && (
                  <View style={[styles.itemDivider, { backgroundColor: activeColors.border }]} />
                )}
              </React.Fragment>
            );
          })}
          {surveys.length === 0 && (
            <View style={styles.emptyRecent}>
              <Text style={styles.emptyRecentText}>No surveys completed today.</Text>
            </View>
          )}
        </View>

        {/* Quick Actions (Less Dominant) */}
        <Text style={[styles.sectionTitle, { color: activeColors.text, marginTop: 24 }]}>Quick Tools</Text>
        <View style={styles.quickToolsRow}>
          <Pressable
            style={({ pressed }) => [
              styles.quickToolBtn,
              { backgroundColor: activeColors.card, borderColor: activeColors.border },
              pressed && styles.pressedState
            ]}
            onPress={() => router.push('/camera')}
          >
            <Ionicons name="camera-outline" size={18} color={activeColors.text} />
            <Text style={[styles.quickToolLabel, { color: activeColors.text }]}>Camera</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.quickToolBtn,
              { backgroundColor: activeColors.card, borderColor: activeColors.border },
              pressed && styles.pressedState
            ]}
            onPress={() => router.push('/contacts')}
          >
            <Ionicons name="people-outline" size={18} color={activeColors.text} />
            <Text style={[styles.quickToolLabel, { color: activeColors.text }]}>Contacts</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.quickToolBtn,
              { backgroundColor: activeColors.card, borderColor: activeColors.border },
              pressed && styles.pressedState
            ]}
            onPress={() => router.push('/settings')}
          >
            <Ionicons name="settings-outline" size={18} color={activeColors.text} />
            <Text style={[styles.quickToolLabel, { color: activeColors.text }]}>Settings</Text>
          </Pressable>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
  },
  userName: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginTop: 2,
  },
  dateText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 30,
  },
  statLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  primaryActionBtn: {
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  primaryActionBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
  btnIcon: {
    marginRight: 8,
  },
  pressedState: {
    opacity: 0.8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  surveyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  surveyIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  surveyMeta: {
    flex: 1,
  },
  surveyTitleText: {
    fontSize: 15,
    fontWeight: '600',
  },
  surveySubText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  surveyRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  surveyDateText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  itemDivider: {
    height: 1,
  },
  emptyRecent: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyRecentText: {
    color: '#64748B',
    fontSize: 14,
  },
  quickToolsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  quickToolBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
  },
  quickToolLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 40,
  },
});
