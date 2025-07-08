import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import * as Notifications from "expo-notifications";

import { useLoading } from "@/context/LoadingContext";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { Platform } from "react-native";
export default function AnalyticsScreen() {
  const { subject_id, semester } = useLocalSearchParams();
  console.log(subject_id, semester);
  const [dummyData, setDummyData] = useState([
    {
      name: "John Doe",
      regNo: "BT20CSE001",
      present: 42,
      absent: 8,
    },
    {
      name: "Alice Smith",
      regNo: "BT20CSE002",
      present: 38,
      absent: 12,
    },
    {
      name: "Rohan Sharma",
      regNo: "BT20CSE003",
      present: 45,
      absent: 5,
    },
    {
      name: "Priya Gupta",
      regNo: "BT20CSE004",
      present: 40,
      absent: 10,
    },
    {
      name: "Ankit Verma",
      regNo: "BT20CSE005",
      present: 36,
      absent: 14,
    },
  ]);

  const [students, setStudents] = useState(dummyData);
  const [filtered, setFiltered] = useState(dummyData);
  const [searchText, setSearchText] = useState("");
  const { setLoading } = useLoading();

  // Add this state to your component
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadedFileName, setDownloadedFileName] = useState("");
  const [downloadedFileUri, setDownloadedFileUri] = useState("");

  // Replace the Alert.alert with this:
  const showDownloadSuccess = (fileName, fileUri) => {
    setDownloadedFileName(fileName);
    setDownloadedFileUri(fileUri);
    setShowDownloadModal(true);
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    const lowered = text.toLowerCase();
    const filteredList = students.filter(
      (student) =>
        student.name.toLowerCase().includes(lowered) ||
        student.regNo.toLowerCase().includes(lowered)
    );
    setFiltered(filteredList);
  };
  const DownloadModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showDownloadModal}
      onRequestClose={() => setShowDownloadModal(false)}
    >
      <View style={modalStyles.overlay}>
        <View style={modalStyles.modalContainer}>
          <Text style={modalStyles.title}>Download Complete</Text>
          <Text style={modalStyles.message}>
            File downloaded as {downloadedFileName}
          </Text>

          <View style={modalStyles.buttonContainer}>
            <TouchableOpacity
              style={[modalStyles.button, modalStyles.secondaryButton]}
              onPress={() => setShowDownloadModal(false)}
            >
              <Text style={modalStyles.secondaryButtonText}>OK</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[modalStyles.button, modalStyles.primaryButton]}
              onPress={() => {
                setShowDownloadModal(false);
                Sharing.shareAsync(downloadedFileUri, {
                  mimeType:
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                  dialogTitle: "Open with...",
                });
              }}
            >
              <Text style={modalStyles.primaryButtonText}>Open</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
  const downloadSheet = async () => {
    setLoading(true);

    try {
      // Request permissions first
      const { status: notificationStatus } =
        await Notifications.requestPermissionsAsync();

      const token = await AsyncStorage.getItem("token");
      const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || "";

      // Create filename with timestamp
      const timestamp = new Date().getTime();
      const fileName = `AttendanceSheet_${timestamp}.xlsx`;

      // Download to cache directory first
      const fileUri = FileSystem.cacheDirectory + fileName;

      console.log("Starting download...");
      const downloadResult = await FileSystem.downloadAsync(
        `${API_BASE_URL}/api/v1/teacher/attendance/export?subjectId=${subject_id}&semester=${
          semester.split(" ")[1]
        }&token=${token}`,
        fileUri,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Download result:", downloadResult);

      if (downloadResult.status === 200) {
        // Try to save to media library (Downloads folder)
        try {
          const { status: mediaStatus } =
            await MediaLibrary.requestPermissionsAsync();

          if (mediaStatus === "granted") {
            const asset = await MediaLibrary.createAssetAsync(
              downloadResult.uri
            );
            console.log("Asset created successfully:", asset);

            // Try to add to Downloads album
            try {
              let album = await MediaLibrary.getAlbumAsync("Download");
              if (!album) {
                album = await MediaLibrary.createAlbumAsync(
                  "Download",
                  asset,
                  false
                );
              } else {
                await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
              }
              console.log("Added to Downloads album");
            } catch (albumError) {
              console.log("Could not add to Downloads album:", albumError);
              // File is still saved, just not in Downloads album
            }
          } else {
            console.log("Media library permission denied");
          }
        } catch (mediaError) {
          console.log("Media library error:", mediaError);
          // Continue with notification even if media library fails
        }

        // Show notification
        if (notificationStatus === "granted") {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "Download Complete",
              body: `${fileName} downloaded successfully`,
              data: {
                fileUri: downloadResult.uri,
                fileName: fileName,
              },
            },
            trigger: null,
          });
        }

        // Show alert with option to open
        showDownloadSuccess(fileName, downloadResult.uri);
      } else {
        throw new Error(
          `Download failed with status: ${downloadResult.status}`
        );
      }
    } catch (error) {
      console.error("Download failed:", error);
      Alert.alert(
        "Download Failed",
        "Unable to download the attendance sheet. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle notification tap to open file
  const handleNotificationResponse = async (response: any) => {
    const { fileUri, fileName } =
      response.notification.request.content.data || {};

    if (fileUri) {
      try {
        await Sharing.shareAsync(fileUri, {
          mimeType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          dialogTitle: "Open with...",
        });
      } catch (error) {
        console.error("Error opening file:", error);
      }
    }
  };

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse
    );
    return () => subscription.remove();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchAnalytics = async () => {
        setLoading(true);
        try {
          const token = await AsyncStorage.getItem("token");
          const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || "";
          const response = await axios.get(
            `${API_BASE_URL}/api/v1/teacher/analytics/students`,
            {
              params: {
                token,
                subjectId: subject_id,
                semester: semester.split(" ")[1],
              },
            }
          );
          setStudents(response.data.data);
          setFiltered(response.data.data);
          console.log(JSON.stringify(response.data.data));
        } catch (error) {
          console.log(JSON.stringify(error));
        } finally {
          setLoading(false);
        }
      };
      fetchAnalytics();
    }, [])
  );
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll}>
        <Text style={styles.title}>Student Analytics</Text>

        <TextInput
          style={styles.searchBar}
          placeholder="Search by name or reg no."
          value={searchText}
          onChangeText={handleSearch}
        />

        <TouchableOpacity style={styles.downloadButton} onPress={downloadSheet}>
          <Text style={styles.downloadText}>Download Sheet</Text>
        </TouchableOpacity>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.regNo}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.regNo}>{item.regNo}</Text>
              </View>
              <View style={styles.status}>
                <Text style={styles.present}>Present: {item.present}</Text>
                <Text style={styles.absent}>Absent: {item.absent}</Text>
              </View>
            </View>
          )}
        />
      </ScrollView>
      <DownloadModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  searchBar: {
    backgroundColor: "#F4F4F4",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  scroll: {
    paddingHorizontal: 16,
  },
  downloadButton: {
    backgroundColor: "#FF4D6D",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  downloadText: {
    color: "#fff",
    fontWeight: "bold",
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#EDEDED",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  name: { fontSize: 16, fontWeight: "bold" },
  regNo: { fontSize: 12, color: "#666", marginTop: 4 },
  status: { alignItems: "flex-end", justifyContent: "center" },
  present: { fontSize: 14, color: "green", fontWeight: "bold" },
  absent: { fontSize: 14, color: "red", fontWeight: "bold", marginTop: 4 },
});
const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxWidth: 300,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#FF4D6D",
  },
  secondaryButton: {
    backgroundColor: "#EDEDED",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  secondaryButtonText: {
    color: "#666",
    fontWeight: "bold",
    fontSize: 16,
  },
});
