import { useLoading } from "@/context/LoadingContext";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import Constants from "expo-constants";
import { useLocalSearchParams } from "expo-router";
type MarkedDatesType = {
  [date: string]: {
    customStyles: {
      container?: object;
      text?: object;
    };
  };
};

const AttendanceScreen = () => {
  const { setLoading } = useLoading();
  const { subject_id } = useLocalSearchParams();
  const [attendanceData, setAttendanceData] = useState<MarkedDatesType>({});
  const router = useRouter();
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [rawAttendanceData, setRawAttendanceData] = useState<
    Record<string, "present" | "absent">
  >({});
  const fetchRecord = async (month: number, year: number) => {
    setLoading(true);
    try {
      console.log("called");

      const token = await AsyncStorage.getItem("token");
      const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || "";
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/student/getSubjectWiseMonthlyAttendance/${token}`,
        {
          params: {
            month,
            subject_id,
            year,
          },
        }
      );
      console.log(JSON.stringify(response.data.data));
      setRawAttendanceData(response.data.data); // Store API data in state
      // setSubjectsBySemester(response.data.data);
    } catch (error) {
      console.log(JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchRecord(selectedMonth, selectedYear);
    }, [selectedMonth, selectedYear])
  );
  useEffect(() => {
    const formatted: MarkedDatesType = {};

    for (const [date, status] of Object.entries(rawAttendanceData)) {
      formatted[date] = {
        customStyles: {
          container: {
            backgroundColor: status === "present" ? "#56C1AE" : "#FD346D",
            borderRadius: 999,
          },
          text: {
            color: "white",
            fontWeight: "bold",
          },
        },
      };
    }

    setAttendanceData(formatted);
  }, [rawAttendanceData]);
  // const fetchAttendanceFromDatabase = async () => {
  //   const [mockData, setMockData] = useState({
  //     "2025-05-09": "present",
  //     "2025-05-10": "absent",
  //     "2025-05-11": "present",
  //     "2025-05-16": "absent",
  //     "2025-05-22": "present",
  //     "2025-05-23": "absent",
  //   });

  //   const formatted: MarkedDatesType = {};
  //   for (const [date, status] of Object.entries(mockData)) {
  //     formatted[date] = {
  //       customStyles: {
  //         container: {
  //           backgroundColor: status === "present" ? "#56C1AE" : "#FD346D",
  //           borderRadius: 999,
  //         },
  //         text: {
  //           color: "white",
  //           fontWeight: "bold",
  //         },
  //       },
  //     };
  //   }

  //   setAttendanceData(formatted);
  // };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/student/home")}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Attendance</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.calendarWrapper}>
        <View style={styles.calendarCard}>
          <Calendar
            markingType={"custom"}
            markedDates={attendanceData}
            disableAllTouchEventsForDisabledDays={true}
            onDayPress={() => {}}
            onMonthChange={(date) => {
              setSelectedMonth(date.month);
              setSelectedYear(date.year);
            }}
            style={styles.calendarInner}
            hideExtraDays={true}
            theme={{
              textMonthFontWeight: "bold",
              textDayFontWeight: "500",
              todayTextColor: "#000",
              arrowColor: "black",
              backgroundColor: "transparent",
              calendarBackground: "transparent",
              monthTextColor: "#000",
              textSectionTitleColor: "#000",
            }}
          />
        </View>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: "#56C1AE" }]} />
            <Text style={styles.legendText}>Present</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: "#FD346D" }]} />
            <Text style={styles.legendText}>Absent</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AttendanceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  calendarWrapper: {
    marginTop: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  calendarCard: {
    backgroundColor: "#f1f1f1",
    borderRadius: 24,
    padding: 10,
    width: "90%",
    overflow: "hidden",
  },
  calendarInner: {
    borderRadius: 24,
  },
  legend: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 6,
  },
  legendText: {
    fontSize: 14,
    color: "#000",
  },
});
