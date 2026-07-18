import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  Image, 
  Alert, 
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions({ writeOnly: true });
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [captureTime, setCaptureTime] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  
  const cameraRef = useRef<CameraView>(null);

  // If permission is still loading
  if (!permission) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  // If permission is denied
  if (!permission.granted) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="camera-outline" size={64} color="#9CA3AF" />
        <Text style={styles.permissionText}>We need your permission to use the camera.</Text>
        <Pressable style={styles.primaryButton} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  // Take photo
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
        });
        
        if (photo?.uri) {
          setPhotoUri(photo.uri);
          
          // Format capture time beautifully
          const now = new Date();
          setCaptureTime(now.toLocaleTimeString() + ' on ' + now.toLocaleDateString());
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture.');
      }
    }
  };

  const handleRetake = () => {
    setPhotoUri(null);
    setCaptureTime(null);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setPhotoUri(null);
            setCaptureTime(null);
          }
        }
      ]
    );
  };

  const handleSaveToGallery = async () => {
    if (!photoUri) return;
    
    let currentPermission = mediaPermission;
    if (!currentPermission || currentPermission.status !== 'granted') {
      currentPermission = await requestMediaPermission();
    }
    
    if (currentPermission?.status === 'granted') {
      try {
        await MediaLibrary.saveToLibraryAsync(photoUri);
        Alert.alert('Saved!', 'Photo has been successfully saved to your gallery.');
      } catch (error) {
        Alert.alert('Error', 'Failed to save photo to gallery.');
      }
    } else {
      Alert.alert('Permission Required', 'We need gallery permission to save photos.');
    }
  };

  // Preview Mode
  if (photoUri) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.previewContainer}>
          <Image source={{ uri: photoUri }} style={styles.previewImage} />
          
          <View style={styles.timeOverlay}>
            <Text style={styles.timeText}>{captureTime}</Text>
          </View>

          <View style={styles.actionRow}>
            <Pressable style={[styles.actionButton, styles.retakeButton]} onPress={handleRetake}>
              <Ionicons name="refresh-outline" size={20} color="#FFF" />
              <Text style={styles.buttonText}>Retake</Text>
            </Pressable>

            <Pressable style={[styles.actionButton, styles.saveButton]} onPress={handleSaveToGallery}>
              <Ionicons name="download-outline" size={20} color="#FFF" />
              <Text style={styles.buttonText}>Save</Text>
            </Pressable>

            <Pressable style={[styles.actionButton, styles.deleteButton]} onPress={handleDelete}>
              <Ionicons name="trash-outline" size={20} color="#FFF" />
              <Text style={styles.buttonText}>Delete</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Camera Mode
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.cameraWrapper}>
        {!isReady && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text style={styles.loadingText}>Opening Camera...</Text>
          </View>
        )}
        <CameraView 
          style={styles.camera} 
          facing="back" 
          ref={cameraRef}
          onCameraReady={() => setIsReady(true)}
        />
        <View style={[styles.cameraOverlay, StyleSheet.absoluteFill]}>
          <View style={styles.captureContainer}>
            <Pressable style={styles.captureButton} onPress={takePicture}>
              <View style={styles.captureInnerCircle} />
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 24,
  },
  permissionText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  cameraWrapper: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    color: '#FFF',
    marginTop: 12,
    fontSize: 16,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 40,
    backgroundColor: 'transparent',
  },
  captureContainer: {
    alignItems: 'center',
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInnerCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  previewImage: {
    flex: 1,
    resizeMode: 'contain',
  },
  timeOverlay: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  timeText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 24,
    paddingBottom: 40,
    backgroundColor: '#000',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  retakeButton: {
    backgroundColor: '#4B5563',
  },
  saveButton: {
    backgroundColor: '#10B981',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
  }
});
