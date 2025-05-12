import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * AuthGuard - A wrapper component that checks if a user is authenticated
 * before rendering its children components.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Components to render when authenticated
 * @param {string} [props.redirectTo="/auth/login"] - Path to redirect to if not authenticated
 * @returns {React.ReactNode}
 */
export default function ProtectedRoute({
  children,
  redirectTo = "/auth/login",
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          // No token found, redirect to login
          router.navigate(redirectTo);
        } else {
          // Token exists, user is authenticated
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error checking authentication status:", error);
        // On error, redirect to login for safety
        router.navigate(redirectTo);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoggedIn();
  }, [redirectTo, router]);

  if (isLoading) {
    // Show loading indicator while checking authentication
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Only render children if authenticated
  return isAuthenticated ? children : null;
}
