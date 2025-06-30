// components/GlobalLoader.tsx
import { View, ActivityIndicator, StyleSheet, Modal } from "react-native";
import { useLoading } from "../context/LoadingContext";

export default function GlobalLoader() {
  const { isLoading } = useLoading();

  return (
    <Modal visible={isLoading} transparent animationType="fade">
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
});
