import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { View, Text, StyleSheet, Pressable } from 'react-native';

function CustomDrawerContent(props: any) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const activeColors = Colors[theme];
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { label: 'Dashboard', icon: 'home-outline', route: '/' },
    { label: 'New Survey', icon: 'add-circle-outline', route: '/new-survey' },
    { label: 'Survey History', icon: 'time-outline', route: '/history' },
    { label: 'Profile', icon: 'person-outline', route: '/profile' },
    { label: 'Settings', icon: 'settings-outline', route: '/settings' },
  ];

  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: activeColors.background }}>
      
      {/* Header Section */}
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: activeColors.tint }]}>
          <Text style={styles.avatarText}>AS</Text>
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={[styles.name, { color: activeColors.text }]}>Atul Singh</Text>
          <Text style={styles.role}>Senior Field Inspector</Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: activeColors.border }]} />

      {/* Menu items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item) => {
          // Determine if item is active
          const isActive = pathname === item.route || 
            (item.route === '/' && pathname === '/(drawer)/(tabs)');
          
          return (
            <Pressable
              key={item.label}
              style={[
                styles.menuItem,
                isActive && { backgroundColor: theme === 'dark' ? 'rgba(37, 99, 235, 0.1)' : 'rgba(37, 99, 235, 0.08)' }
              ]}
              onPress={() => router.push(item.route as any)}
            >
              {/* Active Left Indicator */}
              {isActive && (
                <View style={[styles.activeIndicator, { backgroundColor: activeColors.tint }]} />
              )}
              
              <Ionicons 
                name={item.icon as any} 
                size={20} 
                color={isActive ? activeColors.tint : activeColors.icon} 
                style={styles.menuIcon} 
              />
              <Text 
                style={[
                  styles.menuLabel, 
                  { color: isActive ? activeColors.tint : activeColors.text },
                  isActive && { fontWeight: '600' }
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const activeColors = Colors[theme];

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        headerTintColor: activeColors.text,
        headerStyle: {
          backgroundColor: activeColors.card,
          borderBottomWidth: 1,
          borderBottomColor: activeColors.border,
        },
        drawerActiveTintColor: activeColors.tint,
        drawerInactiveTintColor: activeColors.text,
        drawerStyle: {
          backgroundColor: activeColors.background,
          width: 280,
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
      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: 'Settings',
          title: 'Settings',
          drawerItemStyle: { display: 'none' },
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginTop: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  headerTextContainer: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
  },
  role: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  menuContainer: {
    paddingHorizontal: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 4,
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: 10,
    bottom: 10,
    width: 4,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  menuIcon: {
    marginRight: 12,
    marginLeft: 4,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
});
