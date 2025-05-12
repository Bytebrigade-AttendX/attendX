import {
  View,
  Text,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

const AnimatedButton = ({
  onPress,
  children,
  style,
}: {
  onPress: () => void;
  children: React.ReactNode;
  style: any;
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 3,
      tension: 40,
    }).start();
    onPress();
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default function AttendanceConfirmation() {
  const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl;
  const router = useRouter();
  const { branch, semester, subject, attendanceId } = useLocalSearchParams();

  const [markComplete, setMarkComplete] = useState(false);
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Location permission denied");
        return;
      }
    })();
  }, []);
  const handleMarkPresent = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const { coords } = await Location.getCurrentPositionAsync({});
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/attendance/getMarked`,
        {
          attendanceId,
          token,
          studentLat: coords.latitude,
          studentLon: coords.longitude,
        }
      );
      const data = await response.data;
      console.log("attendance logging", data);
    } catch (error) {}
    setMarkComplete(true);
    setTimeout(() => router.replace("/student/home"), 1000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Attendance Confirmation</Text>

      <View style={styles.detailBox}>
        <Text style={styles.label}>Subject:</Text>
        <Text style={styles.value}>{subject}</Text>

        <Text style={styles.label}>Branch:</Text>
        <Text style={styles.value}>{branch}</Text>

        <Text style={styles.label}>Semester:</Text>
        <Text style={styles.value}>{semester}</Text>
      </View>

      <View style={styles.buttonGroup}>
        {!markComplete && (
          <AnimatedButton
            onPress={handleMarkPresent}
            style={styles.activeButton}
          >
            <Text style={styles.buttonText}>Register Attendance</Text>
          </AnimatedButton>
        )}

        {markComplete && (
          <View style={styles.disabledButton}>
            <Text style={styles.buttonText}>Back to Home</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  detailBox: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
    alignItems: "center",
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#444",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: "#111",
  },
  buttonGroup: {
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#FF4D6D",
    paddingVertical: 16,
    paddingHorizontal: 22,
    borderRadius: 12,
    alignItems: "center",
    width: "75%",
  },
  disabledButton: {
    backgroundColor: "#aaa",
    paddingVertical: 16,
    paddingHorizontal: 22,
    borderRadius: 12,
    alignItems: "center",
    width: "75%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
