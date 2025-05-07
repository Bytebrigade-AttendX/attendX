import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default function NotificationPanel({ visible, onClose }) {
  const slideAnim = useRef(new Animated.Value(screenWidth)).current;
  const [renderModal, setRenderModal] = useState(visible);

  // Simulated backend-style notification data
  const notificationsByDate = [
    {
      date: 'Today',
      items: [
        'You missed the attendance window for DBMS.',
        'You have attended PSQ Class.',
        'Daily attendance summary is ready.',
      ],
    },
    {
      date: 'Yesterday',
      items: [
        'Reminder: Project submission due today.',
        'You missed the attendance window for DSA.',
        'System maintenance completed successfully.',
      ],
    },
    {
      date: 'Monday, May 5',
      items: [
        'You have attended all classes.',
        'Lab attendance marked for DBMS.',
      ],
    },
    {
      date: 'Sunday, May 4',
      items: [
        'OOPS class rescheduled to 2 PM.',
        'Library book due reminder.',
      ],
    },
    {
      date: 'Saturday, May 3',
      items: [
        'Weekly performance summary uploaded.',
        'New assignment posted for PSQ.',
      ],
    },
    {
      date: 'Friday, May 2',
      items: [
        'Holiday announced for Monday.',
        'New grading policy updated.',
      ],
    },
  ];

  useEffect(() => {
    if (visible) {
      setRenderModal(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: screenWidth,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setRenderModal(false);
      });
    }
  }, [visible]);

  if (!renderModal) return null;

  return (
    <Modal transparent animationType="none" visible>
      <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill}>
        <Pressable style={styles.blurBackground} onPress={onClose} />
      </BlurView>

      <Animated.View
        style={[
          styles.panel,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Notification</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {notificationsByDate.map(({ date, items }) => (
              <View key={date}>
                <Text style={styles.sectionHeader}>{date}</Text>
                {items.map((note, idx) => (
                  <View key={`${date}-${idx}`} style={styles.notificationCard}>
                    <Text style={styles.notificationText}>{note}</Text>
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
  },
  panel: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%',
    width: screenWidth * 0.8,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    overflow: 'hidden',
  },
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
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  notificationCard: {
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  notificationText: {
    fontSize: 14,
    color: '#333',
  },
});
