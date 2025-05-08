import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

type AttendanceState = 'idle' | 'inProgress' | 'completed';

const RADIUS = 65;
const STROKE_WIDTH = 10;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const dummyStudents = Array(5).fill({ name: 'FirstName LastName', regNo: 'Reg No' });

export default function AttendanceScreen() {
  const router = useRouter();
  const [attendanceState, setAttendanceState] = useState<AttendanceState>('idle');
  const [timer, setTimer] = useState(180); // in seconds
  const [markedPresent, setMarkedPresent] = useState(17);
  const totalStudents = 86;

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (attendanceState === 'inProgress' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          const newTime = prev - 1;
          animatedValue.setValue(((180 - newTime) / 180) * CIRCUMFERENCE);
          return newTime;
        });
      }, 1000);
    } else if (timer <= 0 && attendanceState === 'inProgress') {
      setAttendanceState('completed');
    }

    return () => clearInterval(interval);
  }, [attendanceState, timer]);

  const formatTime = (sec: number) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const renderStudent = ({ item }: any) => (
    <View style={styles.studentCard}>
      <Text>{item.name}</Text>
      <Text>{item.regNo}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Take Attendance</Text>
      </View>

      {/* Spacer below header */}
      <View style={{ height: 50 }} />

      {/* Timer / Checkmark */}
      <View style={styles.circleWrapper}>
  {attendanceState === 'completed' ? (
    <Ionicons name="checkmark-done-outline" size={80} color="#bbb" />
  ) : (
    <>
      <Svg height="160" width="160" viewBox="0 0 160 160">
        <Circle
          stroke="#eee"
          fill="none"
          cx="80"
          cy="80"
          r={RADIUS}
          strokeWidth={STROKE_WIDTH}
        />
        <AnimatedCircle
          stroke="#FF4D6D"
          fill="none"
          cx="80"
          cy="80"
          r={RADIUS}
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={`${CIRCUMFERENCE}, ${CIRCUMFERENCE}`}
          strokeDashoffset={animatedValue}
          strokeLinecap="round"
          rotation="-90"
          origin="80, 80"
        />
      </Svg>
      <View style={{ position: 'absolute', alignItems: 'center' }}>
        <Text style={{ fontSize: 36, fontWeight: 'bold' }}>{formatTime(timer)}</Text>
        <Text style={{ fontSize: 18, fontWeight: '600' }}>min left</Text>
      </View>
    </>
  )}
</View>


      {/* Spacer below timer */}
      <View style={{ height: 20}} />


      {attendanceState === 'idle' && (
        <>
          <Text style={styles.info}>Branch : CSE</Text>
          <Text style={styles.info}>Sem: III</Text>
          <Text style={styles.info}>Subject: OOPS</Text>
          <Text style={styles.info}>Total Student : {totalStudents}</Text>
        </>
      )}

      {attendanceState === 'inProgress' && (
        <>
          <Text style={styles.info}>Total Students : {totalStudents}</Text>
          <Text style={styles.info}>Marked Present : {markedPresent}</Text>
          <Text style={styles.info}>Pending : {totalStudents - markedPresent}</Text>
        </>
      )}

      {attendanceState === 'completed' && (
        <>
          <Text style={styles.info}>Total Students : {totalStudents}</Text>
          <Text style={styles.info}>Marked Present : {markedPresent}</Text>
          <Text style={styles.info}>Absent : {totalStudents - markedPresent}</Text>
        </>
      )}

      <View style={styles.buttonGroup}>
        {attendanceState === 'idle' && (
          <>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => {
                setAttendanceState('inProgress');
                setTimer(180);
                animatedValue.setValue(0);
              }}>
              <Text style={styles.buttonText}>Start Attendance</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.homeButton}
              onPress={() => router.replace('/teacher/home')}>
              <Text style={styles.buttonText}>Back To Home</Text>
            </TouchableOpacity>
          </>
        )}

        {attendanceState === 'inProgress' && (
          <TouchableOpacity
            style={styles.stopButton}
            onPress={() => setAttendanceState('completed')}>
            <Text style={styles.buttonText}>Stop Attendance</Text>
          </TouchableOpacity>
        )}

        {attendanceState === 'completed' && (
          <>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.buttonText}>Edit Attendance</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => router.replace('/teacher/home')}>
              <Text style={styles.buttonText}>Save Attendance</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {(attendanceState === 'inProgress' || attendanceState === 'completed') && (
        <>
          <Text style={styles.subHeading}>Students marked Present</Text>
          <FlatList
            data={dummyStudents}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderStudent}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        </>
      )}
    </View>
  );
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  circleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 8,
  },
  info: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  buttonGroup: {
    alignItems: 'center',
    marginVertical: 20,
  },
  startButton: {
    backgroundColor: '#fe406e',
    padding: 15,
    width: '80%',
    borderRadius: 20,
    marginBottom: 10,
  },
  stopButton: {
    backgroundColor: '#fe406e',
    padding: 15,
    width: '80%',
    borderRadius: 20,
  },
  homeButton: {
    backgroundColor: '#777',
    padding: 15,
    width: '80%',
    borderRadius: 20,
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#FF4D6D',
    padding: 15,
    width: '80%',
    borderRadius: 20,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#FF4D6D',
    padding: 15,
    width: '80%',
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  subHeading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 20,
  },
  studentCard: {
    backgroundColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
});
