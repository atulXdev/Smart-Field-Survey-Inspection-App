import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  RefreshControl, 
  Pressable, 
  Alert,
  ActivityIndicator
} from 'react-native';
import * as Contacts from 'expo-contacts';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ContactsScreen() {
  const [contacts, setContacts] = useState<Contacts.Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contacts.Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';

  const fetchContacts = useCallback(async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      setPermissionGranted(status === 'granted');
      
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
          sort: Contacts.SortTypes.FirstName,
        });
        
        if (data.length > 0) {
          setContacts(data);
          setFilteredContacts(data);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch contacts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchContacts();
    setRefreshing(false);
  }, [fetchContacts]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text) {
      const filtered = contacts.filter((contact) => 
        contact.name?.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(contacts);
    }
  };

  const copyToClipboard = async (phoneNumber: string) => {
    await Clipboard.setStringAsync(phoneNumber);
    Alert.alert('Success', 'Phone number copied to clipboard!');
  };

  const getInitial = (name: string | undefined) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  const renderItem = ({ item }: { item: Contacts.Contact }) => {
    const phoneNumber = item.phoneNumbers && item.phoneNumbers.length > 0 
      ? item.phoneNumbers[0].number 
      : null;
      
    return (
      <View style={[styles.contactCard, { backgroundColor: theme === 'dark' ? '#1c1c1e' : '#fff' }]}>
        <View style={styles.contactLeft}>
          <View style={[styles.avatar, { backgroundColor: Colors[theme].tint }]}>
            <Text style={[styles.avatarText, { color: theme === 'dark' ? '#000' : '#fff' }]}>
              {getInitial(item.name)}
            </Text>
          </View>
          <View style={styles.contactInfo}>
            <Text style={[styles.contactName, { color: Colors[theme].text }]} numberOfLines={1}>
              {item.name || 'Unknown Contact'}
            </Text>
            <Text style={styles.contactNumber}>
              {phoneNumber || 'No Number'}
            </Text>
          </View>
        </View>
        
        {phoneNumber && (
          <Pressable 
            style={({ pressed }) => [
              styles.copyButton,
              { 
                backgroundColor: theme === 'dark' ? '#333' : '#f0f0f0',
                opacity: pressed ? 0.6 : 1
              }
            ]}
            onPress={() => copyToClipboard(phoneNumber)}
          >
            <Ionicons name="copy-outline" size={20} color={Colors[theme].tint} />
          </Pressable>
        )}
      </View>
    );
  };

  const renderEmptyState = () => {
    if (loading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <Ionicons 
          name={permissionGranted === false ? 'lock-closed-outline' : 'people-outline'} 
          size={80} 
          color="#888" 
        />
        <Text style={[styles.emptyTitle, { color: Colors[theme].text }]}>
          {permissionGranted === false ? 'Permission Denied' : 'No Contacts Found'}
        </Text>
        <Text style={styles.emptySubtitle}>
          {permissionGranted === false 
            ? 'Please enable contacts access in your settings.' 
            : 'Try adjusting your search or add some contacts.'}
        </Text>
        
        {permissionGranted === false && (
          <Pressable 
            style={[styles.refreshButton, { backgroundColor: Colors[theme].tint }]}
            onPress={fetchContacts}
          >
            <Text style={[styles.refreshButtonText, { color: theme === 'dark' ? '#000' : '#fff' }]}>
              Request Permission
            </Text>
          </Pressable>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors[theme].background }]}>
      <Text style={[styles.header, { color: Colors[theme].text }]}>Contacts</Text>
      
      <View style={[styles.searchContainer, { backgroundColor: theme === 'dark' ? '#1c1c1e' : '#f0f0f0' }]}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: Colors[theme].text }]}
          placeholder="Search Contacts"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => handleSearch('')}>
            <Ionicons name="close-circle" size={20} color="#888" />
          </Pressable>
        )}
      </View>

      <View style={styles.counterContainer}>
        <Text style={[styles.counterText, { color: Colors[theme].tint }]}>
          {filteredContacts.length} {filteredContacts.length === 1 ? 'Contact' : 'Contacts'}
        </Text>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors[theme].tint} />
        </View>
      ) : (
        <FlatList
          data={filteredContacts}
          keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
          renderItem={renderItem}
          contentContainerStyle={filteredContacts.length === 0 ? styles.emptyListContent : styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              tintColor={Colors[theme].tint}
              colors={[Colors[theme].tint]}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    fontSize: 32,
    fontWeight: '800',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  counterContainer: {
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  counterText: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  contactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  contactInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  contactName: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  contactNumber: {
    fontSize: 14,
    color: '#888',
  },
  copyButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  refreshButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  refreshButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
