import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Pressable, Alert } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const activeColors = Colors[theme];
  
  const [notifications, setNotifications] = useState(true);
  const [locationTracking, setLocationTracking] = useState(true);
  const [offlineSync, setOfflineSync] = useState(false);

  const handleExportData = () => {
    Alert.alert('Export Data', 'Survey database is compiled. Export as JSON/CSV?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Export CSV', onPress: () => Alert.alert('Export Complete', 'Exported to files/inspections_export.csv') }
    ]);
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear Survey Data',
      'This will permanently delete all locally saved inspection records. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All Data', style: 'destructive', onPress: () => Alert.alert('All local survey records cleared.') }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeColors.background }]} edges={['top']}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: activeColors.text }]}>Settings</Text>
        <Text style={styles.subtitle}>Configure client and system settings.</Text>
      </View>

      {/* Preferences Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: activeColors.text }]}>Preferences</Text>
        <View style={[styles.listContainer, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
          
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={18} color={activeColors.icon} style={styles.icon} />
              <Text style={[styles.settingText, { color: activeColors.text }]}>Push Notifications</Text>
            </View>
            <Switch 
              value={notifications} 
              onValueChange={setNotifications} 
              trackColor={{ true: activeColors.tint, false: activeColors.border }} 
            />
          </View>
          
          <View style={[styles.itemDivider, { backgroundColor: activeColors.border }]} />

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="location-outline" size={18} color={activeColors.icon} style={styles.icon} />
              <Text style={[styles.settingText, { color: activeColors.text }]}>Location Tracking</Text>
            </View>
            <Switch 
              value={locationTracking} 
              onValueChange={setLocationTracking} 
              trackColor={{ true: activeColors.tint, false: activeColors.border }} 
            />
          </View>

          <View style={[styles.itemDivider, { backgroundColor: activeColors.border }]} />

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="color-palette-outline" size={18} color={activeColors.icon} style={styles.icon} />
              <Text style={[styles.settingText, { color: activeColors.text }]}>System Theme</Text>
            </View>
            <Text style={styles.valueText}>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</Text>
          </View>

        </View>
      </View>

      {/* Data Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: activeColors.text }]}>Data</Text>
        <View style={[styles.listContainer, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
          
          <Pressable 
            style={({ pressed }) => [styles.settingRow, pressed && styles.pressedRow]} 
            onPress={handleExportData}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="download-outline" size={18} color={activeColors.icon} style={styles.icon} />
              <Text style={[styles.settingText, { color: activeColors.text }]}>Export Inspection Database</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={activeColors.icon} />
          </Pressable>

          <View style={[styles.itemDivider, { backgroundColor: activeColors.border }]} />

          <Pressable 
            style={({ pressed }) => [styles.settingRow, pressed && styles.pressedRow]} 
            onPress={handleClearData}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="trash-outline" size={18} color={activeColors.danger} style={styles.icon} />
              <Text style={[styles.settingText, { color: activeColors.danger, fontWeight: '500' }]}>Clear Survey Data</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={activeColors.icon} />
          </Pressable>

        </View>
      </View>

      {/* Version Card */}
      <View style={styles.footer}>
        <Text style={styles.versionLabel}>Smart Survey & Inspection Utility</Text>
        <Text style={styles.versionText}>Version 1.0.0 (Production)</Text>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  listContainer: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    height: 48,
  },
  pressedRow: {
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  settingText: {
    fontSize: 14,
    fontWeight: '400',
  },
  valueText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  itemDivider: {
    height: 1,
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingBottom: 24,
  },
  versionLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  versionText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
});
