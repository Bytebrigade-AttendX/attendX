import {
  View,
  Text,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  Easing,
  Dimensions,
  Vibration,
  ScrollView,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLoading } from "@/context/LoadingContext";
import { useToast } from "react-native-toast-notifications";

const { width } = Dimensions.get("window");

const AnimatedButton = ({ onPress, children, style }: any) => {
  const scale = useRef(new Animated.Value(1)).current;
  const ripple = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 0.95,
        useNativeDriver: true,
        tension: 200,
        friction: 7,
      }),
      Animated.timing(ripple, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 200,
        friction: 7,
      }),
      Animated.timing(ripple, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    onPress();
  };

  const rippleOpacity = ripple.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
  });

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              borderRadius: 12,
              opacity: rippleOpacity,
            },
          ]}
        />
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const InfoCard = ({ icon, label, value, delay = 0 }: any) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.infoItem,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={20} color="#FF4D6D" />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </Animated.View>
  );
};

// const AnimatedIcon = ({ status, animation }: any) => {
//   const rotateAnim = useRef(new Animated.Value(0)).current;
//   const pulseAnim = useRef(new Animated.Value(1)).current;
//   const backgroundAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     if (status !== "idle") {
//       // Rotation animation
//       Animated.timing(rotateAnim, {
//         toValue: 1,
//         duration: 500,
//         useNativeDriver: true,
//         easing: Easing.elastic(1.2),
//       }).start();

//       // Pulse animation
//       Animated.loop(
//         Animated.sequence([
//           Animated.timing(pulseAnim, {
//             toValue: 1.1,
//             duration: 800,
//             useNativeDriver: true,
//             easing: Easing.inOut(Easing.ease),
//           }),
//           Animated.timing(pulseAnim, {
//             toValue: 1,
//             duration: 800,
//             useNativeDriver: true,
//             easing: Easing.inOut(Easing.ease),
//           }),
//         ])
//       ).start();

//       // Background animation
//       Animated.timing(backgroundAnim, {
//         toValue: 1,
//         duration: 600,
//         useNativeDriver: true,
//         easing: Easing.out(Easing.ease),
//       }).start();
//     }
//   }, [status]);

//   const scaleAnim = animation.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0.3, 1],
//   });

//   const opacityAnim = animation.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, 1],
//   });

//   const rotation = rotateAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ["0deg", "360deg"],
//   });

//   const backgroundScale = backgroundAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0.5, 1],
//   });

//   const backgroundOpacity = backgroundAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, 0.1],
//   });

//   return (
//     <Animated.View
//       style={[styles.animatedIconContainer, { opacity: opacityAnim }]}
//     >
//       <Animated.View
//         style={[
//           styles.iconBackground,
//           {
//             backgroundColor: status === "success" ? "#28C76F" : "#FF4D4F",
//             opacity: backgroundOpacity,
//             transform: [{ scale: backgroundScale }],
//           },
//         ]}
//       />
//       <Animated.View
//         style={{
//           transform: [
//             { scale: Animated.multiply(scaleAnim, pulseAnim) },
//             { rotate: rotation },
//           ],
//         }}
//       >
//         <Ionicons
//           name={status === "success" ? "checkmark-circle" : "close-circle"}
//           size={100}
//           color={status === "success" ? "#28C76F" : "#FF4D4F"}
//         />
//       </Animated.View>
//       <Animated.View
//         style={[
//           styles.confirmTextContainer,
//           {
//             opacity: opacityAnim,
//             transform: [
//               {
//                 translateY: animation.interpolate({
//                   inputRange: [0, 1],
//                   outputRange: [20, 0],
//                 }),
//               },
//             ],
//           },
//         ]}
//       >
//         <Text style={styles.confirmText}>
//           {status === "success"
//             ? "Attendance Marked Successfully!"
//             : "Failed to Mark Attendance!"}
//         </Text>
//         <Text style={styles.confirmSubtext}>
//           {status === "success"
//             ? "You have been marked present for this session. Redirecting to home..."
//             : "Unable to record attendance. Please check your connection and try again."}
//         </Text>
//       </Animated.View>
//     </Animated.View>
//   );
// };

export default function AttendanceConfirmation() {
  const toast = useToast();
  const { setLoading } = useLoading();
  const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl;
  const router = useRouter();
  const { branch, semester, subject, attendanceId } = useLocalSearchParams();

  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  // const animation = useRef(new Animated.Value(0)).current;
  const headerAnimation = useRef(new Animated.Value(0)).current;
  const infoCardAnimation = useRef(new Animated.Value(1)).current;
  //location permission
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") console.warn("Location permission denied");
    })();

    // Animate header on mount
    Animated.timing(headerAnimation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  }, []);

  const handleMarkPresent = async () => {
    setLoading(true);
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
      // setStatus("success");
      toast.show("Attendance marked", {
        type: "success",
        placement: "top",
      });
      Vibration.vibrate([100, 50, 100]); //success vibration
    } catch (error) {
      toast.show("Device not in range", {
        type: "danger",
        placement: "top",
      });
      Vibration.vibrate([200, 100, 200, 100, 200]); // Error vibration pattern
    } finally {
      setLoading(false);
    }

    // Hide info card with animation
    // Animated.timing(infoCardAnimation, {
    //   toValue: 0,
    //   duration: 400,
    //   useNativeDriver: true,
    //   easing: Easing.out(Easing.ease),
    // }).start();

    // Enhanced animation for result
    // Animated.spring(animation, {
    //   toValue: 1,
    //   tension: 100,
    //   friction: 8,
    //   useNativeDriver: true,
    // }).start();

    setTimeout(() => router.replace("/student/home"), 1000); // Increased time
  };

  const headerOpacity = headerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const headerTranslateY = headerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 0],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Animated.View
          style={[
            styles.headerContainer,
            {
              opacity: headerOpacity,
              transform: [{ translateY: headerTranslateY }],
            },
          ]}
        >
          <Text style={styles.heading}>Attendance Confirmation</Text>
          <Text style={styles.subheading}>Session details</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.infoCard,
            {
              opacity: infoCardAnimation,
              transform: [{ scale: infoCardAnimation }],
            },
          ]}
        >
          <InfoCard
            icon="book-outline"
            label="Subject"
            value={subject}
            delay={200}
          />
          <InfoCard
            icon="construct-outline"
            label="Branch"
            value={branch}
            delay={400}
          />
          <InfoCard
            icon="school-outline"
            label="Semester"
            value={semester}
            delay={600}
          />
        </Animated.View>

        <View style={styles.buttonGroup}>
          {status === "idle" && (
            <AnimatedButton
              onPress={handleMarkPresent}
              style={styles.activeButton}
            >
              <View style={styles.buttonContent}>
                <Ionicons name="finger-print" size={24} color="#fff" />
                <Text style={styles.buttonText}>Register Attendance</Text>
              </View>
            </AnimatedButton>
          )}

          {/* {status !== "idle" && (
            <AnimatedIcon status={status} animation={animation} />
          )} */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 8,
  },
  subheading: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    fontWeight: "400",
  },
  infoCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 20,
    padding: 24,
    marginBottom: 40,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 77, 109, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    color: "#333",
    fontWeight: "600",
  },
  buttonGroup: {
    alignItems: "center",
    justifyContent: "center",
  },
  activeButton: {
    backgroundColor: "#FF4D6D",
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: "center",
    width: "85%",
    elevation: 4,
    shadowColor: "#FF4D6D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
    marginLeft: 8,
  },
  animatedIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  iconBackground: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    top: -50,
  },
  confirmTextContainer: {
    alignItems: "center",
    textAlign: "center",
    marginTop: 20,
  },
  confirmText: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    color: "#333",
  },
  confirmSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontWeight: "400",
    maxWidth: width * 0.8,
  },
});
