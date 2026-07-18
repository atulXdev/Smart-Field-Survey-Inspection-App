import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

function CustomDrawerContent(props: any) {
  const colorScheme = useColorScheme();
  const theme = colorScheme ?? 'light';
  const router = useRouter();

  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: Colors[theme].background }}>
      <DrawerItem 
        label="Dashboard" 
        icon={({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />}
        onPress={() => router.push('/')}
        activeTintColor={Colors[theme].tint}
        inactiveTintColor={Colors[theme].text}
      />
      <DrawerItem 
        label="New Survey" 
        icon={({ color, size }) => <Ionicons name="add-circle-outline" size={size} color={color} />}
        onPress={() => router.push('/new-survey')}
        activeTintColor={Colors[theme].tint}
        inactiveTintColor={Colors[theme].text}
      />
      <DrawerItem 
        label="Survey History" 
        icon={({ color, size }) => <Ionicons name="time-outline" size={size} color={color} />}
        onPress={() => router.push('/history')}
        activeTintColor={Colors[theme].tint}
        inactiveTintColor={Colors[theme].text}
      />
      <DrawerItem 
        label="Profile" 
        icon={({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />}
        onPress={() => router.push('/profile')}
        activeTintColor={Colors[theme].tint}
        inactiveTintColor={Colors[theme].text}
      />
      <DrawerItem 
        label="Settings" 
        icon={({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />}
        onPress={() => {}}
        activeTintColor={Colors[theme].tint}
        inactiveTintColor={Colors[theme].text}
      />
      <DrawerItem 
        label="Help" 
        icon={({ color, size }) => <Ionicons name="help-circle-outline" size={size} color={color} />}
        onPress={() => {}}
        activeTintColor={Colors[theme].tint}
        inactiveTintColor={Colors[theme].text}
      />
      <DrawerItem 
        label="About" 
        icon={({ color, size }) => <Ionicons name="information-circle-outline" size={size} color={color} />}
        onPress={() => {}}
        activeTintColor={Colors[theme].tint}
        inactiveTintColor={Colors[theme].text}
      />
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme ?? 'light';

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
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
          drawerItemStyle: { display: 'none' },
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
          drawerItemStyle: { display: 'none' },
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
          drawerItemStyle: { display: 'none' },
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
          drawerItemStyle: { display: 'none' },
          drawerIcon: ({ color, size }) => (
            <Ionicons name="clipboard-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}
