import axios from "axios";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import React, { useRef, useState, useEffect } from "react";
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function AttendanceOverlay({ visible, onClose }) {
  const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || "";
  const router = useRouter();

  const [branchOpen, setBranchOpen] = useState(false);
  const [semesterOpen, setSemesterOpen] = useState(false);
  const [subjectOpen, setSubjectOpen] = useState(false);

  const [branch, setBranch] = useState(null);
  const [semester, setSemester] = useState(null);
  const [subject, setSubject] = useState(null);

  const [branchItems] = useState([
    { label: "CSE", value: "CSE" },
    { label: "IT", value: "IT" },
    { label: "ECE", value: "ECE" },
  ]);
  const [semesterItems] = useState([
    { label: "Sem I", value: "I" },
    { label: "Sem III", value: "III" },
    { label: "Sem V", value: "V" },
    { label: "Sem VII", value: "VII" },
  ]);
  const [subjectItems] = useState([
    { label: "DSA", value: "CS201" },
    { label: "EMaths", value: "MA101" },
    { label: "DBMS", value: "DBMS" },
  ]);

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const allSelected = branch && semester && subject;

  const triggerShake = () => {
    Vibration.vibrate(100);
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 6,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -6,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleStart = async () => {
    if (allSelected) {
      router.navigate({
        pathname: "/teacher-others/attendancetimer",
        params: {
          branch,
          semester,
          subject,
        },
      });
    } else {
      triggerShake();
    }
  };

  return (
    <Modal transparent animationType="none" visible={visible}>
      <BlurView intensity={80} style={StyleSheet.absoluteFill}>
        <Pressable style={styles.blurArea} onPress={onClose} />
      </BlurView>

      <Animated.View
        style={[
          styles.cardContainer,
          { transform: [{ translateX: shakeAnim }] },
        ]}
      >
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Text style={styles.backArrow}>{"\u2190"}</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Take Attendance</Text>

        <View style={styles.dropdownContainer}>
          <DropDownPicker
            open={branchOpen}
            value={branch}
            items={branchItems}
            setOpen={setBranchOpen}
            setValue={setBranch}
            placeholder="Choose Branch"
            zIndex={3000}
            zIndexInverse={1000}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownBox}
          />

          <DropDownPicker
            open={semesterOpen}
            value={semester}
            items={semesterItems}
            setOpen={setSemesterOpen}
            setValue={setSemester}
            placeholder="Choose Semester"
            zIndex={2000}
            zIndexInverse={2000}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownBox}
          />

          <DropDownPicker
            open={subjectOpen}
            value={subject}
            items={subjectItems}
            setOpen={setSubjectOpen}
            setValue={setSubject}
            placeholder="Choose Subject"
            zIndex={1000}
            zIndexInverse={3000}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownBox}
          />
        </View>

        <TouchableOpacity
          style={[styles.startButton, { opacity: allSelected ? 1 : 0.7 }]}
          onPress={handleStart}
        >
          <Text style={styles.startButtonText}>Start Attendance</Text>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  blurArea: {
    flex: 1,
  },
  cardContainer: {
    position: "absolute",
    top: "20%",
    alignSelf: "center",
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    elevation: 10,
  },
  backButton: {
    marginBottom: 10,
  },
  backArrow: {
    fontSize: 22,
    fontWeight: "600",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  dropdownContainer: {
    gap: 15,
    zIndex: 10,
  },
  dropdown: {
    backgroundColor: "#fff",
    borderColor: "#ddd",
  },
  dropdownBox: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
  },
  startButton: {
    backgroundColor: "#FF4D6D",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 30,
    alignItems: "center",
  },
  startButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
