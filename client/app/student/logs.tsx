import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LogsScreen() {
  const router = useRouter();
  const [logs, setLogs] = useState({});

  useEffect(() => {
    fetchLogsFromDatabase();
  }, []);

  const fetchLogsFromDatabase = async () => {
    const mockData = [
      { subject: 'PSQ', status: 'SUCCESS', time: '11:20:00', date: '2025-02-12' },
      { subject: 'DBMS', status: 'FAILED', time: '11:20:00', date: '2025-02-12' },
      { subject: 'DSA', status: 'SUCCESS', time: '11:20:00', date: '2025-02-12' },
      { subject: 'DES', status: 'FAILED', time: '11:20:00', date: '2025-02-12' },

      { subject: 'PSQ', status: 'SUCCESS', time: '11:10:00', date: '2025-02-11' },
      { subject: 'DBMS', status: 'SUCCESS', time: '11:10:00', date: '2025-02-11' },
      { subject: 'DSA', status: 'FAILED', time: '11:10:00', date: '2025-02-11' },
      { subject: 'DES', status: 'SUCCESS', time: '11:10:00', date: '2025-02-11' },

      { subject: 'PSQ', status: 'SUCCESS', time: '10:50:00', date: '2025-02-10' },
      { subject: 'DBMS', status: 'FAILED', time: '10:50:00', date: '2025-02-10' },

      { subject: 'DSA', status: 'SUCCESS', time: '10:30:00', date: '2025-02-09' },
      { subject: 'DES', status: 'SUCCESS', time: '10:30:00', date: '2025-02-09' },
      { subject: 'PSQ', status: 'FAILED', time: '10:30:00', date: '2025-02-09' },

      { subject: 'DBMS', status: 'SUCCESS', time: '10:00:00', date: '2025-02-08' },
      { subject: 'OOPS', status: 'FAILED', time: '10:00:00', date: '2025-02-08' },
      { subject: 'ML', status: 'SUCCESS', time: '10:00:00', date: '2025-02-08' },
    ];

    const grouped = mockData.reduce((acc, item) => {
      const label = getDateLabel(item.date);
      if (!acc[label]) acc[label] = [];
      acc[label].push(item);
      return acc;
    }, {});

    setLogs(grouped);
  };

  const getDateLabel = (dateStr) => {
    const today = dayjs();
    const target = dayjs(dateStr);
    if (target.isSame(today, 'day')) return 'Today';
    if (target.isSame(today.subtract(1, 'day'), 'day')) return 'Yesterday';
    return target.format('D MMM YYYY');
  };

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
      <TouchableOpacity onPress={() => router.replace('/student/home')}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Logs</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scroll}>
        {Object.keys(logs).map((dateLabel) => (
          <View key={dateLabel} style={styles.section}>
            <Text style={styles.dateLabel}>{dateLabel}</Text>
            {logs[dateLabel].map((log, idx) => (
              <View key={idx} style={styles.logItem}>
                <View style={styles.logLeft}>
                  <Text style={styles.subject}>{log.subject}</Text>
                  <Text style={[styles.status, { color: log.status === 'FAILED' ? '#FF6B81' : '#888' }]}>
                    {log.status}
                  </Text>
                </View>
                <View style={styles.logRight}>
                  <Text style={styles.time}>{log.time}</Text>
                  <Text style={styles.date}>{dayjs(log.date).format('DD-MM-YYYY')}</Text>
                </View>
                <MaterialIcons
                  name={log.status === 'FAILED' ? 'cancel' : 'check-circle'}
                  size={24}
                  color={log.status === 'FAILED' ? '#FF6B81' : '#888'}
                  style={{ marginLeft: 8 }}
                />
              </View>
            ))}
          </View>
        ))}
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
  section: {
    marginTop: 24,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 12,
  },
  logItem: {
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logLeft: {
    flex: 1,
  },
  subject: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  status: {
    fontSize: 12,
  },
  logRight: {
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 12,
    color: '#000',
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
});
