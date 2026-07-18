import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable, Alert, Linking, Platform } from 'react-native';
import * as Location from 'expo-location';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function LocationScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';

  // In dark mode, the tint color is white, so text on tint-colored background should be black.
  // In light mode, the tint color is blue, so text should be white.
  const buttonTextColor = theme === 'dark' ? '#000' : '#fff';

  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(currentLocation);
    } catch (error) {
      setErrorMsg('Failed to fetch location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (location) {
      const textToCopy = `Lat: ${location.coords.latitude}, Lon: ${location.coords.longitude}`;
      await Clipboard.setStringAsync(textToCopy);
      Alert.alert('Success', 'Location copied to clipboard!');
    }
  };

  const openInMaps = () => {
    if (location) {
      const lat = location.coords.latitude;
      const lng = location.coords.longitude;
      const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      Linking.openURL(url).catch(() => {
        Alert.alert('Error', 'Could not open maps application.');
      });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors[theme].background }]}>
      <Text style={[styles.header, { color: Colors[theme].text }]}>Current Location</Text>

      <View style={[styles.card, { backgroundColor: theme === 'dark' ? '#1c1c1e' : '#f9f9f9' }]}>
        <View style={[styles.iconContainer, { backgroundColor: theme === 'dark' ? '#2c2c2e' : '#e0e0e0' }]}>
          <Ionicons name="location-sharp" size={40} color={Colors[theme].tint} />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={Colors[theme].tint} style={styles.loader} />
        ) : errorMsg ? (
          <Text style={styles.errorText}>{errorMsg}</Text>
        ) : location ? (
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <View style={styles.labelContainer}>
                <Ionicons name="compass-outline" size={18} color="#888" style={styles.labelIcon} />
                <Text style={styles.detailLabel}>Latitude</Text>
              </View>
              <Text style={[styles.detailValue, { color: Colors[theme].text }]}>{location.coords.latitude.toFixed(6)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <View style={styles.labelContainer}>
                <Ionicons name="navigate-outline" size={18} color="#888" style={styles.labelIcon} />
                <Text style={styles.detailLabel}>Longitude</Text>
              </View>
              <Text style={[styles.detailValue, { color: Colors[theme].text }]}>{location.coords.longitude.toFixed(6)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <View style={styles.labelContainer}>
                <Ionicons name="locate-outline" size={18} color="#888" style={styles.labelIcon} />
                <Text style={styles.detailLabel}>Accuracy</Text>
              </View>
              <Text style={[styles.detailValue, { color: Colors[theme].text }]}>± {location.coords.accuracy?.toFixed(2)}m</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.errorText}>No location data available.</Text>
        )}
      </View>

      <View style={styles.actionsContainer}>
        <View style={styles.rowButtons}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: Colors[theme].tint, opacity: pressed ? 0.8 : 1 }
            ]}
            onPress={fetchLocation}
            disabled={loading}
          >
            <Ionicons name="refresh" size={20} color={buttonTextColor} />
            <Text style={[styles.buttonText, { color: buttonTextColor }]}>Refresh</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.buttonSecondary,
              { borderColor: Colors[theme].tint, opacity: (pressed || !location) ? 0.5 : 1 }
            ]}
            onPress={copyToClipboard}
            disabled={!location || loading}
          >
            <Ionicons name="copy-outline" size={20} color={Colors[theme].tint} />
            <Text style={[styles.buttonTextSecondary, { color: Colors[theme].tint }]}>Copy</Text>
          </Pressable>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.mapsButton,
            {
              backgroundColor: theme === 'dark' ? '#2c2c2e' : '#eaf2f8',
              borderColor: theme === 'dark' ? '#3a3a3c' : '#bee3f8',
              opacity: (pressed || !location) ? 0.5 : 1
            }
          ]}
          onPress={openInMaps}
          disabled={!location || loading}
        >
          <Ionicons name="map" size={22} color={theme === 'dark' ? '#fff' : '#0a7ea4'} />
          <Text style={[styles.mapsButtonText, { color: theme === 'dark' ? '#fff' : '#0a7ea4' }]}>Open in Google Maps</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  header: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 24,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 24,
    minHeight: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  loader: {
    marginVertical: 40,
  },
  errorText: {
    color: '#ff4444',
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 20,
  },
  detailsContainer: {
    width: '100%',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelIcon: {
    marginRight: 8,
  },
  detailLabel: {
    fontSize: 16,
    color: '#888',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 17,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(150, 150, 150, 0.15)',
  },
  actionsContainer: {
    flexDirection: 'column',
    gap: 16,
  },
  rowButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  buttonSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    gap: 8,
  },
  buttonTextSecondary: {
    fontSize: 16,
    fontWeight: '700',
  },
  mapsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },
  mapsButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
