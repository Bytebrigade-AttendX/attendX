import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle, G, Text as TextSvg } from 'react-native-svg';
import Icon from 'react-native-vector-icons/Ionicons';
import NotificationPanel from '../others/notification';

const subjects = [
  { id: 1, name: 'DBMS', subcode: 'SUBCODE', professor: 'Prof. Name', total: 22, present: 17 },
  { id: 2, name: 'Maths', subcode: 'MATH101', professor: 'Prof. Math', total: 25, present: 20 },
  { id: 3, name: 'OS', subcode: 'OS201', professor: 'Prof. OS', total: 30, present: 26 },
  { id: 4, name: 'CN', subcode: 'CN301', professor: 'Prof. CN', total: 28, present: 25 },
  { id: 5, name: 'AI', subcode: 'AI401', professor: 'Prof. AI', total: 18, present: 15 },
];

export default function HomeScreen() {
  const [expandedId, setExpandedId] = useState(subjects[0].id);
  const [showNotification, setShowNotification] = useState(false);
  const router = useRouter();

  const toggleExpand = (id: number) => setExpandedId(id);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.header}>Hello, Kuljeet</Text>
          <TouchableOpacity onPress={() => setShowNotification(true)}>
            <Icon name="notifications-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {subjects.map((subject) => (
          <SubjectTile
            key={subject.id}
            subject={subject}
            expanded={expandedId === subject.id}
            onPress={() => toggleExpand(subject.id)}
            onViewDetails={() => router.push('/others/attendance')}
          />
        ))}
      </ScrollView>

      {/* Render the Notification Panel */}
      <NotificationPanel visible={showNotification} onClose={() => setShowNotification(false)} />
    </SafeAreaView>
  );
}

function SubjectTile({ subject, expanded, onPress, onViewDetails }: any) {
  const { name, subcode, professor, total, present } = subject;
  const absent = total - present;
  const percentage = Math.round((present / total) * 100);

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const dashArray = (absent / total) * circumference;
  const chartSize = expanded ? 100 : 60;
  const strokeWidth = 20;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.tileWrapper}>
      <View style={[styles.tile, expanded && styles.tileExpanded]}>
        <View style={styles.tileHeader}>
          <View style={styles.leftSection}>
            <Text style={styles.subjectName}>{name}</Text>
            <Text style={styles.subDetails}>{subcode}</Text>
            <Text style={styles.subDetails}>{professor}</Text>

            {expanded && (
              <TouchableOpacity style={styles.viewButton} onPress={onViewDetails}>
                <Text style={styles.buttonText}>View Details</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.rightSection}>
            <Svg height={chartSize} width={chartSize} viewBox="0 0 100 100">
              <G rotation={-90} origin="50, 50">
                <Circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="#e0e0e0"
                  strokeWidth={strokeWidth}
                  fill="none"
                />
                <Circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="#e55373"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${dashArray} ${circumference}`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  fill="none"
                />
              </G>
              <TextSvg
                x="43"
                y="55"
                fontSize={expanded ? '20' : '16'}
                fill="#000"
                textAnchor="middle"
                fontWeight="bold"
              >
                {percentage}%
              </TextSvg>
            </Svg>

            {expanded && (
              <View style={styles.attendanceDetails}>
                <Text style={styles.detailText}>Total Classes : {total}</Text>
                <Text style={styles.detailText}>Present : {present}</Text>
                <Text style={styles.detailText}>Absent : {absent}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
  },
  tileWrapper: {
    marginBottom: 16,
  },
  tile: {
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,       
  },
  tileExpanded: {
    paddingVertical: 24,
  },
  tileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flex: 1,
    justifyContent: 'center',
  },
  rightSection: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 90,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subDetails: {
    color: '#666',
    fontSize: 12,
  },
  attendanceDetails: {
    alignItems: 'flex-start',
    marginTop: 8,
  },
  detailText: {
    fontSize: 13,
    color: '#444',
  },
  viewButton: {
    backgroundColor: '#e55373',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginTop: 16,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
