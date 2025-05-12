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
  View
} from 'react-native';

const screenWidth = Dimensions.get('window').width;

type NotificationPanelProps = {
  visible: boolean;
  onClose: () => void;
};

export default function NotificationPanel({ visible, onClose }: NotificationPanelProps) {
  const slideAnim = useRef(new Animated.Value(screenWidth)).current;
  const [renderModal, setRenderModal] = useState(visible);

  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayTitle, setOverlayTitle] = useState('');
  const [overlayBody, setOverlayBody] = useState('');

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

  const handleNotificationClick = (title: string, body: string) => {
    setOverlayTitle(title);
    setOverlayBody(body);
    setOverlayVisible(true);
  };

  if (!renderModal) return null;

  return (
    <Modal transparent animationType="none" visible>
      <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill}>
        <Pressable style={styles.blurBackground} onPress={onClose} />
      </BlurView>

      <Animated.View style={[styles.panel, { transform: [{ translateX: slideAnim }] }]}>
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
                  <TouchableOpacity
                    key={`${date}-${idx}`}
                    onPress={() => handleNotificationClick(date, note)}
                    style={styles.notificationCard}
                  >
                    <Text style={styles.notificationText}>{note}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Animated.View>
{/*
      <Modal transparent visible={overlayVisible} animationType="fade">
        <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />
        <View style={styles.overlayCard}>
          <Text style={styles.overlayTitle}>{overlayTitle}</Text>
          <Text style={styles.overlayBody}>{overlayBody}</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setOverlayVisible(false)}
          >
            <Text style={styles.closeButtonText}>Mark as Present</Text>
          </TouchableOpacity>
        </View>
      </Modal>

*/}
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
  overlayCard: {
    position: 'absolute',
    top: '30%',
    alignSelf: 'center',
    width: '85%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    elevation: 10,
  },
  backButton: {
    marginBottom: 10,
  },
  backArrow: {
    fontSize: 22,
    fontWeight: '600',
  },
  overlayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  overlayBody: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#444',
  },
  closeButton: {
    backgroundColor: '#FF4D6D',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});