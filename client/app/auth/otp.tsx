import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import Constants from "expo-constants";
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Vibration,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "react-native-toast-notifications";
export default function OTP() {
  const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || "";
  const [otp, setOtp] = useState("");
  const inputRef = useRef<TextInput>(null);
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();

  const scaleAnim = useRef(
    new Animated.Value(otp.length === 0 ? 0.95 : 1)
  ).current;
  const opacityAnim = useRef(new Animated.Value(0.7)).current;
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = await AsyncStorage.getItem("token");

      if (token) {
        const role = await AsyncStorage.getItem("role");
        if (role === "student") router.navigate("/student/home");
        else router.navigate("/teacher/home");
      } else return false;
    };
    checkLoggedIn();
  }, []);
  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: otp.length === 6 ? 1 : 0.95,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: otp.length === 6 ? 1 : 0.7,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [otp]);

  const handleChange = (text: string) => {
    const sanitized = text.replace(/[^0-9]/g, "");
    if (sanitized.length <= 6) setOtp(sanitized);
  };

  const handleVerify = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/user/loginOtpVerify`,
        { email, otp }
      );
      if (response.status === 200) {
        await AsyncStorage.setItem("token", response.data.data.token);
        await AsyncStorage.setItem("role", response.data.data.role);
        if (response.data.data.role === "student")
          router.navigate("/student/home");
        else router.navigate("/teacher/home");
      }
    } catch (error: any) {
      if (error.response.status === 400) {
        triggerShake();
        Vibration.vibrate(100);
      }
      Toast.show(error.response.data.message, {
        type: "danger",
        placement: "top",
      });
    }
  };

  const handleResend = () => {};
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const triggerShake = () => {
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

  const renderOtpBoxes = () => {
    return [...Array(6)].map((_, i) => {
      const isActive = otp.length === i;
      return (
        <Animated.View
          key={i}
          style={[
            styles.otpBox,
            isActive && {
              transform: [{ scale: 1.05 }],
              shadowColor: "#aaa",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 4,
            },
          ]}
        >
          <Text style={styles.otpText}>{otp[i] || ""}</Text>
        </Animated.View>
      );
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>
              Attend<Text style={styles.logoX}>X</Text>
            </Text>
          </View>

          <View style={styles.cardWrapper}>
            <Animated.View
              style={[styles.card, { transform: [{ translateX: shakeAnim }] }]}
            >
              <Text style={styles.label}>Enter OTP sent to</Text>
              <Text style={styles.email}>{email}</Text>

              <TouchableOpacity
                activeOpacity={1}
                onPress={() => inputRef.current?.focus()}
              >
                <View style={styles.otpContainer}>{renderOtpBoxes()}</View>
              </TouchableOpacity>

              <TextInput
                ref={inputRef}
                value={otp}
                onChangeText={handleChange}
                keyboardType="number-pad"
                style={styles.hiddenInput}
                maxLength={6}
                autoFocus
              />

              <View style={styles.footer}>
                <TouchableOpacity onPress={() => router.back()}>
                  <Text style={styles.footerText}>Change E-mail</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleResend}>
                  <Text style={styles.footerText}>Resend OTP</Text>
                </TouchableOpacity>
              </View>

              <Animated.View
                style={[
                  styles.animatedButton,
                  {
                    opacity: opacityAnim,
                    transform: [{ scale: scaleAnim }],
                    backgroundColor:
                      otp.length === 6 ? "#e55373" : "rgba(229, 83, 115, 0.7)",
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={handleVerify}
                  disabled={otp.length < 6}
                  style={styles.touchable}
                >
                  <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  inner: {
    flex: 1,
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
  },
  logoX: {
    color: "#e55373",
  },
  cardWrapper: {
    paddingHorizontal: 5,
  },
  card: {
    backgroundColor: "#eaeaea",
    padding: 30,
    paddingBottom: 40,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  label: {
    textAlign: "center",
    color: "#000",
    fontSize: 16,
    marginBottom: 4,
  },
  email: {
    textAlign: "center",
    marginBottom: 20,
    color: "#444",
    fontSize: 14,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  otpBox: {
    flex: 1,
    height: 52,
    marginHorizontal: 4,
    backgroundColor: "#fff",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  otpText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  hiddenInput: {
    position: "absolute",
    top: 0,
    left: 0,
    height: 0,
    width: 0,
    opacity: 0,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  footerText: {
    color: "#000",
    fontSize: 13,
  },
  animatedButton: {
    borderRadius: 28,
  },
  touchable: {
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 28,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
  },
});
