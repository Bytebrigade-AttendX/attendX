import { Slot } from "expo-router";
import React from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { ToastProvider } from "react-native-toast-notifications";
export default function MainLayout() {
  const screenHeight = Dimensions.get("window").height;

  return (
    <ToastProvider>
      <View style={styles.root}>
        {/* Optional: add manual top spacer for Android status bar */}
        {Platform.OS === "android" && (
          <View style={{ height: StatusBar.currentHeight || 0 }} />
        )}

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={[styles.content, { maxHeight: screenHeight }]}>
            <Slot />
          </View>
        </KeyboardAvoidingView>
      </View>
    </ToastProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
  },
});
