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
interface student {
  id: string;
  name: string;
  status: string;
}
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

  const [record, setRecord] = useState<student[]>([]);
  const [attendanceId, setAttendanceId] = useState("");
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

  const renderStudent = ({ item }: { item: Student }) => (
    <View style={styles.studentCard}>
      <View style={{ flexDirection: "column", marginLeft: 10 }}>
        <Text>{item.name}</Text>
        <Text
          style={{ color: item.status === "present" ? "#4CAF50" : "#FF4D6D" }}
        >
          Status: {item.status}
        </Text>
      </View>

      <View>
        <BouncyCheckbox
          size={25}
          fillColor="#4CAF50"
          iconStyle={{ borderColor: "#4CAF50" }}
          isChecked={item.status === "present"}
          onPress={() => alterRecord(item.id)}
        />
      </View>
    </View>
  );

  const handleStartAttendance = async () => {
    try {
      const { coords } = await Location.getCurrentPositionAsync({});
      const token = await AsyncStorage.getItem("token");
      Toast.show("Starting attendance session...", {
        type: "info",
        placement: "top",
      });

      const response = await axios.post(
        `${API_BASE_URL}/api/v1/attendance/startSession`,
        {
          branch,
          semester,
          subjectName: subject,
          token,
          teacherLatitude: String(coords.latitude),
          teacherLongitude: String(coords.longitude),
        }
      );
      console.log("API Response:", JSON.stringify(response.data, null, 2));
      // Only update state if the API call was successful
      Toast.show("Attendance session started successfully!", {
        type: "success",
        placement: "top",
      });

      setAttendanceState("inProgress");
      setTimer(180);
      animatedValue.setValue(0);
    } catch (error: any) {
      console.log(error.response);
      console.log("err");
      Toast.show(
        "Failed to start attendance: " +
          (error.response?.data?.message || error.message),
        {
          type: "danger",
          placement: "top",
          duration: 4000,
        }
      );
    }
  };
  const handleStopAttendance = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/attendance/endSession`,
        {
          token,
        }
      );
      setAttendanceState("completed");
      setRecord(response.data.data.combinedList);
      setAttendanceId(response.data.data.attendanceId);
      console.log(
        "API Response at stop:",
        JSON.stringify(response?.data, null, 2)
      );
    } catch (error: any) {
      console.log(error.response.data);
    }
  };
  const handleSaveAttedance = async () => {
    try {
      console.log("trying");

      const response = await axios.post(
        `${API_BASE_URL}/api/v1/attendance/storeRecords`,
        { attendanceRecords: record, attendanceId: attendanceId }
      );
      console.log(response);
      router.replace("/teacher/home");
    } catch (error: any) {
      console.log(error.response);
    }
  };
  useEffect(() => {
    console.log(record);
  }, [record]);
  useEffect(() => {
    console.log(attendanceId);
  }, [attendanceId]);
  const alterRecord = (id: string) => {
    setRecord((currentRecord) => {
      // Create a new array to avoid mutating state directly
      return currentRecord.map((student) => {
        if (student.id === id) {
          // Toggle the status for the matching student
          return {
            ...student,
            status: student.status === "absent" ? "present" : "absent",
          };
        }
        // Return other students unchanged
        return student;
      });
    });
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
            onPress={handleStopAttendance}
          >
            <Text style={styles.buttonText}>Stop Attendance</Text>
          </TouchableOpacity>
        )}

        {attendanceState === "completed" && (
          <>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveAttedance}
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
            data={record}
            keyExtractor={(item) => item.id}
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
