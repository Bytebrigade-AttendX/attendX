import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import * as Location from "expo-location";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { Toast } from "react-native-toast-notifications";

type AttendanceState = "idle" | "inProgress" | "completed";

const RADIUS = 65;
const STROKE_WIDTH = 10;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const dummyStudents = Array(5).fill({
  name: "FirstName LastName",
  regNo: "Reg No",
});

export default function AttendanceScreen() {
  const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || "";
  const router = useRouter();
  const [attendanceState, setAttendanceState] =
    useState<AttendanceState>("idle");
  const [timer, setTimer] = useState(180); // in seconds
  const [markedPresent, setMarkedPresent] = useState(17);
  const totalStudents = 86;
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const { branch, semester, subject } = useLocalSearchParams();

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (attendanceState === "inProgress" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          const newTime = prev - 1;
          animatedValue.setValue(((180 - newTime) / 180) * CIRCUMFERENCE);
          return newTime;
        });
      }, 1000);
    } else if (timer <= 0 && attendanceState === "inProgress") {
      setAttendanceState("completed");
    }

    return () => clearInterval(interval);
  }, [attendanceState, timer]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Location permission denied");
        return;
      }
    })();
  }, []);
  const formatTime = (sec: number) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const renderStudent = ({ item }: any) => (
    <View style={styles.studentCard}>
      <View style={{ flexDirection: "column", marginLeft: 10 }}>
        <Text>{item.name}</Text>
        <Text>{item.regNo}</Text>
      </View>

      <View>
        <BouncyCheckbox
          size={25}
          fillColor="#4CAF50"
          iconStyle={{ borderColor: "#4CAF50" }}
          onPress={(isChecked) => {}}
        />
      </View>
    </View>
  );

  const handleStartAttendance = async () => {
    try {
      const { coords } = await Location.getCurrentPositionAsync({});

      const token = await AsyncStorage.getItem("token");

      const response = await axios.post(
        `${API_BASE_URL}/api/v1/attendance/startSession`,
        {
          branch,
          semester,
          subjectName: subject,
          token,
          latitude: coords.latitude,
          longitude: coords.longitude,
        }
      );

      setAttendanceState("inProgress");
      setTimer(180);
      animatedValue.setValue(0);
      console.log("Session started:", response.data);
    } catch (error) {
      console.error("Start session error:", error);
      Toast.show("Failed to start attendance", {
        type: "danger",
        placement: "top",
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Take Attendance</Text>
      </View>
      {/* Spacer below header */}
      <View style={{ height: 80 }} />
      {/* Timer / Checkmark */}
      <View style={styles.circleWrapper}>
        {attendanceState === "completed" ? (
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
            <View style={{ position: "absolute", alignItems: "center" }}>
              <Text style={{ fontSize: 36, fontWeight: "bold" }}>
                {formatTime(timer)}
              </Text>
              <Text style={{ fontSize: 18, fontWeight: "600" }}>min left</Text>
            </View>
          </>
        )}
      </View>
      {/* Spacer below timer */}
      <View style={{ height: 20 }} />
      {(attendanceState === "idle" || attendanceState === "inProgress") && (
        <>
          <Text style={styles.info}>Branch : CSE</Text>
          <Text style={styles.info}>Sem: III</Text>
          <Text style={styles.info}>Subject: OOPS</Text>
        </>
      )}
      ` `
      <View style={styles.buttonGroup}>
        {attendanceState === "idle" && (
          <>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => {
                handleStartAttendance();
              }}
            >
              <Text style={styles.buttonText}>Start Attendance</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.homeButton}
              onPress={() => router.replace("/teacher/home")}
            >
              <Text style={styles.buttonText}>Back To Home</Text>
            </TouchableOpacity>
          </>
        )}

        {attendanceState === "inProgress" && (
          <TouchableOpacity
            style={styles.stopButton}
            onPress={() => setAttendanceState("completed")}
          >
            <Text style={styles.buttonText}>Stop Attendance</Text>
          </TouchableOpacity>
        )}

        {attendanceState === "completed" && (
          <>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => router.replace("/teacher/home")}
            >
              <Text style={styles.buttonText}>Save Attendance</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      {attendanceState === "completed" && (
        <>
          <Text style={styles.subHeading}>List of Students</Text>
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
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  circleWrapper: {
    paddingTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  timerText: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 8,
  },
  info: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
  buttonGroup: {
    alignItems: "center",
    marginVertical: 20,
  },
  startButton: {
    backgroundColor: "#fe406e",
    padding: 15,
    width: "80%",
    borderRadius: 20,
    marginBottom: 10,
  },
  stopButton: {
    backgroundColor: "#fe406e",
    padding: 15,
    width: "80%",
    borderRadius: 20,
  },
  homeButton: {
    backgroundColor: "#777",
    padding: 15,
    width: "80%",
    borderRadius: 20,
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "#FF4D6D",
    padding: 15,
    width: "80%",
    borderRadius: 20,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "#FF4D6D",
    padding: 15,
    width: "80%",
    borderRadius: 20,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  subHeading: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 20,
  },
  studentCard: {
    backgroundColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    justifyContent: "space-between",
  },
});
