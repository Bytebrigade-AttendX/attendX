// utils/notifications.js
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform, Alert } from "react-native";
import axios from "axios";

// Configure how notifications are handled when the app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Function to register for push notifications
export async function registerForPushNotifications() {
  const API_BASE_URL = Constants.expoConfig.extra.apiUrl;
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      Alert.alert(
        "Permission Required",
        "Push notifications need appropriate permissions.",
        [{ text: "OK" }]
      );
      return undefined;
    }

    try {
      // Get project ID from app.json (using the appropriate property based on your setup)
      const projectId =
        Constants.expoConfig?.extra?.eas?.projectId ||
        Constants.expoConfig?.slug ||
        Constants.manifest?.extra?.eas?.projectId ||
        Constants.manifest?.slug;

      // Get push token
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;

      return token;
    } catch (error) {
      console.error("Error getting Expo push token:", error);
      return undefined;
    }
  } else {
    Alert.alert(
      "Physical Device Required",
      "Push notifications require a physical device for testing.",
      [{ text: "OK" }]
    );
    return undefined;
  }
}

// Function to handle received notifications
export function addNotificationReceivedListener(callback) {
  return Notifications.addNotificationReceivedListener(callback);
}

// Function to handle notification responses (when user taps notification)
export function addNotificationResponseReceivedListener(callback) {
  return Notifications.addNotificationResponseReceivedListener(callback);
}

// Function to send token to your backend
export async function saveTokenToBackend(token, userToken) {
  // Replace with your actual API endpoint
  const API_BASE_URL = Constants.expoConfig.extra.apiUrl;
  try {
    const response = await axios.post(`${API_BASE_URL}/api/v1/user/storeFcm`, {
      token: userToken,
      fcmToken: token,
    });

    const data = await response.data;
    return data;
  } catch (error) {
    console.error("Error saving token to backend:", error.response);
    throw error;
  }
}

// Function to send a test push notification (for development purposes)
export async function sendTestPushNotification(expoPushToken) {
  const message = {
    to: "ExponentPushToken[53_knBEYb91RVaD66_MkzE]",
    sound: "default",
    title: "Test Notification",
    body: "This is a test notification from ATTENDX",
    data: { screen: "Home" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}
