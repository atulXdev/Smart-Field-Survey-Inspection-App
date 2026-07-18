import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function DrawerLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme ?? 'light';

  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        headerTintColor: Colors[theme].text,
        headerStyle: {
          backgroundColor: Colors[theme].background,
        },
        drawerActiveTintColor: Colors[theme].tint,
        drawerInactiveTintColor: Colors[theme].text,
        drawerStyle: {
          backgroundColor: Colors[theme].background,
        },
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: 'Dashboard',
          title: 'Smart Survey',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="camera"
        options={{
          drawerLabel: 'Camera',
          title: 'Camera',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="camera-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="contacts"
        options={{
          drawerLabel: 'Contacts',
          title: 'Contacts',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="location"
        options={{
          drawerLabel: 'Location',
          title: 'Location',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="location-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="clipboard"
        options={{
          drawerLabel: 'Clipboard',
          title: 'Clipboard',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="clipboard-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}
