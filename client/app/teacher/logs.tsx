import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TeacherLogsScreen() {
  const router = useRouter();
  const [logs, setLogs] = useState({});

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const mockData = [
      {
        subject: 'DBMS',
        branch: 'CSE',
        semester: '6',
        total: 60,
        present: 52,
        absent: 8,
        time: '09:00:00',
        date: '2025-05-08',
      },
      {
        subject: 'OOPS',
        branch: 'ECE',
        semester: '4',
        total: 55,
        present: 50,
        absent: 5,
        time: '10:30:00',
        date: '2025-05-08',
      },
      {
        subject: 'DSA',
        branch: 'CSE',
        semester: '6',
        total: 60,
        present: 58,
        absent: 2,
        time: '11:30:00',
        date: '2025-05-07',
      },
      {
        subject: 'ML',
        branch: 'IT',
        semester: '5',
        total: 40,
        present: 30,
        absent: 10,
        time: '13:00:00',
        date: '2025-05-07',
      },
      {
        subject: 'PSQ',
        branch: 'ME',
        semester: '3',
        total: 45,
        present: 42,
        absent: 3,
        time: '09:30:00',
        date: '2025-05-06',
      },
      {
        subject: 'DES',
        branch: 'CSE',
        semester: '4',
        total: 50,
        present: 48,
        absent: 2,
        time: '11:00:00',
        date: '2025-05-06',
      },
      {
        subject: 'AI',
        branch: 'ECE',
        semester: '6',
        total: 60,
        present: 57,
        absent: 3,
        time: '12:30:00',
        date: '2025-05-05',
      },
      {
        subject: 'TOC',
        branch: 'CSE',
        semester: '5',
        total: 52,
        present: 49,
        absent: 3,
        time: '14:00:00',
        date: '2025-05-05',
      },
      {
        subject: 'CN',
        branch: 'IT',
        semester: '5',
        total: 47,
        present: 46,
        absent: 1,
        time: '09:15:00',
        date: '2025-05-04',
      },
      {
        subject: 'SE',
        branch: 'CSE',
        semester: '6',
        total: 60,
        present: 60,
        absent: 0,
        time: '10:45:00',
        date: '2025-05-03',
      },
      {
        subject: 'DM',
        branch: 'ME',
        semester: '3',
        total: 40,
        present: 37,
        absent: 3,
        time: '08:30:00',
        date: '2025-05-02',
      },
      {
        subject: 'Maths-IV',
        branch: 'ECE',
        semester: '4',
        total: 55,
        present: 53,
        absent: 2,
        time: '11:30:00',
        date: '2025-05-01',
      },
      {
        subject: 'DBMS',
        branch: 'IT',
        semester: '6',
        total: 42,
        present: 40,
        absent: 2,
        time: '13:30:00',
        date: '2025-04-30',
      },
      {
        subject: 'OOPS',
        branch: 'CSE',
        semester: '5',
        total: 60,
        present: 56,
        absent: 4,
        time: '15:00:00',
        date: '2025-04-29',
      },
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
        <TouchableOpacity onPress={() => router.replace('/teacher/home')}>
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
                  <Text style={styles.subject}>{log.subject} - Sem {log.semester}, {log.branch}</Text>
                  <Text style={styles.status}>
                    Total: {log.total} | Present: {log.present} | Absent: {log.absent}
                  </Text>
                </View>
                <View style={styles.logRight}>
                  <Text style={styles.time}>{log.time}</Text>
                  <Text style={styles.date}>{dayjs(log.date).format('DD-MM-YYYY')}</Text>
                </View>
                <MaterialIcons
                  name="assignment"
                  size={24}
                  color="#888"
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
    color: '#444',
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
