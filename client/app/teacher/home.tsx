import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AttendanceOverlay from '../teacher-others/attendanceoverlay';

const dummyData = [
  {
    semester: 'Sem I',
    subjects: [
      { name: 'DBMS', code: 'CS101', branch: 'CSE' },
      { name: 'OOPS', code: 'CS102', branch: 'IT' },
      { name: 'Mathematics I', code: 'MA101', branch: 'CSE' },
      { name: 'Physics', code: 'PH101', branch: 'ME' },
      { name: 'Basic Electronics', code: 'EC101', branch: 'ECE' },
    ],
  },
  {
    semester: 'Sem III',
    subjects: [
      { name: 'DSA', code: 'CS201', branch: 'CSE' },
      { name: 'Operating Systems', code: 'CS202', branch: 'IT' },
      { name: 'Discrete Maths', code: 'MA201', branch: 'CSE' },
      { name: 'Computer Architecture', code: 'CS203', branch: 'ECE' },
      { name: 'Digital Logic', code: 'EC202', branch: 'EEE' },
    ],
  },
  {
    semester: 'Sem V',
    subjects: [
      { name: 'Computer Networks', code: 'CS301', branch: 'CSE' },
      { name: 'Database Systems', code: 'CS302', branch: 'IT' },
      { name: 'Software Engineering', code: 'CS303', branch: 'CSE' },
      { name: 'Theory of Computation', code: 'CS304', branch: 'ECE' },
      { name: 'Elective I: AI', code: 'CS305', branch: 'CSE' },
    ],
  },
  {
    semester: 'Sem VII',
    subjects: [
      { name: 'Machine Learning', code: 'CS401', branch: 'CSE' },
      { name: 'Cloud Computing', code: 'CS402', branch: 'IT' },
      { name: 'Big Data', code: 'CS403', branch: 'ECE' },
      { name: 'Cyber Security', code: 'CS404', branch: 'CSE' },
      { name: 'Elective II: NLP', code: 'CS405', branch: 'CSE' },
    ],
  },
];

export default function TeacherHomeScreen() {
  const router = useRouter();
  const [expandedSemester, setExpandedSemester] = useState(dummyData[0].semester);
  const [subjectsBySemester, setSubjectsBySemester] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    setSubjectsBySemester(dummyData);
  }, []);

  const toggleSemester = (semester) => {
    setExpandedSemester(semester);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Half */}
      <View style={styles.topSection}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, Sachin</Text>
        </View>

        <View style={styles.centerButtonWrapper}>
        <TouchableOpacity
  style={styles.glowingButton}
  onPress={() => setShowOverlay(true)}
>
  <Text style={styles.plus}>+</Text>
</TouchableOpacity>

        </View>
      </View>

      {/* Bottom Half */}
      <View style={styles.bottomSection}>
        <FlatList
          data={subjectsBySemester}
          keyExtractor={(item) => item.semester}
          contentContainerStyle={styles.semesterList}
          renderItem={({ item }) => (
            <View style={styles.semesterBlock}>
              <View style={styles.semesterHeader}>
                <Text style={styles.semesterTitle}>{item.semester}</Text>
                <TouchableOpacity onPress={() => toggleSemester(item.semester)}>
                  <Text style={styles.toggleButton}>
                    {expandedSemester === item.semester ? 'Hide' : 'View'}
                  </Text>
                </TouchableOpacity>
              </View>
              {expandedSemester === item.semester && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {item.subjects.map((subject, idx) => (
                    <View key={idx} style={styles.subjectCard}>
                      <Text style={styles.subjectName}>{subject.name}</Text>
                      <Text style={styles.subjectDetails}>
                        {subject.code} | {subject.branch}
                      </Text>
                      <TouchableOpacity style={styles.detailsButton}>
                        <Text style={styles.detailsButtonText}>Details</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>
          )}
        />
      </View>
      {showOverlay && (
  <AttendanceOverlay visible={showOverlay} onClose={() => setShowOverlay(false)} />
)}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  topSection: { flex: 1, paddingHorizontal: 12 },
  bottomSection: {},

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  greeting: { fontSize: 20, fontWeight: 'bold' },

  centerButtonWrapper: {
    alignItems: 'center',
    marginTop: 100,
  },
  glowingButton: {
    width: 100,
    height: 100,
    borderRadius: 40,
    backgroundColor: '#F4F4F4',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF4D6D',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 5,
  },
  plus: {
    fontSize: 64,
    color: '#FF4D6D',
    fontWeight: '600',
  },

  semesterList: { paddingHorizontal: 16 },
  semesterBlock: {
    marginBottom: 20,
    backgroundColor: '#EDEDED',
    borderRadius: 12,
    padding: 10,
  },
  semesterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  semesterTitle: { fontSize: 16, fontWeight: 'bold' },
  toggleButton: {
    fontSize: 12,
    backgroundColor: '#FF4D6D',
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },

  subjectCard: {
    width: 150,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
  },
  subjectName: { fontSize: 16, fontWeight: 'bold' },
  subjectDetails: { fontSize: 12, color: '#666', marginTop: 4 },
  detailsButton: {
    marginTop: 8,
    backgroundColor: '#FF4D6D',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  detailsButtonText: { fontSize: 12, color: '#fff' },
});
