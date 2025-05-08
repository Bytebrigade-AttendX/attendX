import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser({
      name: 'Mr. Sachin Kumar',
      designation: 'Assistant Professor',
      department: 'Computer Science and Engineering',
      employeeId: 'TCH202531',
      phone: '+91 98765 12345',
      email: 'amandeep.kaur@university.edu',
      address: 'Block A, Faculty Quarters, Campus, India',
      avatar: 'https://via.placeholder.com/80',
    });
  }, []);

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 100 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/teacher/home')}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ height: 12 }} />

        <View style={styles.profileHeader}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <View style={{ marginLeft: 16 }}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.subTitle}>{user.designation}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>Employee ID: {user.employeeId}</Text>
          <Text style={styles.infoText}>Department: {user.department}</Text>
          <Text style={styles.infoText}>Phone: {user.phone}</Text>
          <Text style={styles.infoText}>Email: {user.email}</Text>
          <Text style={styles.infoText}>Address: {user.address}</Text>
        </View>

        <TouchableOpacity style={styles.contactCard} onPress={() => {}}>
          <Feather name="mail" size={20} color="#333" style={{ marginRight: 10 }} />
          <View>
            <Text style={styles.contactTitle}>Contact Support</Text>
            <Text style={styles.contactSub}>Reach out to admin for technical help.</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={() => {}}>
          <Ionicons name="log-out-outline" size={20} color="#fff" style={{ marginRight: 10 }} />
          <View>
            <Text style={styles.logoutText}>Log Out</Text>
            <Text style={styles.logoutSub}>Exit your account securely</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  scroll: {
    paddingHorizontal: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ddd',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  subTitle: {
    color: '#666',
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 6,
    color: '#333',
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6e6e6',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  contactTitle: {
    fontWeight: '600',
    fontSize: 14,
  },
  contactSub: {
    fontSize: 12,
    color: '#555',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff4d6d',
    borderRadius: 12,
    padding: 12,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  logoutSub: {
    fontSize: 12,
    color: '#fff',
  },
});
