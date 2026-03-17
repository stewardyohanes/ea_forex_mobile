import "../global.css";
import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { Stack, router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "../src/store/authStore";
import { getMe } from "../src/api/auth";
import { colors } from "../src/theme";
import ErrorBoundary from "../src/components/ErrorBoundary";

const headerTheme = {
  headerStyle: { backgroundColor: colors.surface },
  headerTintColor: colors.primary,
  headerTitleStyle: {
    color: colors.textPrimary,
    fontWeight: "700" as const,
    fontSize: 18,
  },
  headerShadowVisible: false,
  headerBackTitleVisible: false,
};

export default function RootLayout() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const setUser = useAuthStore((s) => s.setUser);
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    checkSession();

    // Re-fetch /me setiap kali app kembali ke foreground
    // Supaya plan change dari admin langsung berlaku tanpa re-login
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (appState.current.match(/inactive|background/) && nextState === "active") {
        syncUserPlan();
      }
      appState.current = nextState;
    });

    return () => subscription.remove();
  }, []);

  async function syncUserPlan() {
    const token = await SecureStore.getItemAsync("jwt_token");
    if (!token) return;
    try {
      const user = await getMe();
      setUser(user);
    } catch {
      // Jika 401, response interceptor di client.ts yang handle redirect ke login
    }
  }

  async function checkSession() {
    const onboardingDone = await SecureStore.getItemAsync("onboarding_done");
    if (!onboardingDone) {
      router.replace("/onboarding");
      return;
    }

    const token = await SecureStore.getItemAsync("jwt_token");
    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const user = await getMe();
      setAuth(token, user);
      const disclaimerAccepted = await SecureStore.getItemAsync(
        "disclaimer_accepted",
      );
      router.replace(disclaimerAccepted ? "/(tabs)" : "/disclaimer");
    } catch {
      await SecureStore.deleteItemAsync("jwt_token");
      router.replace("/login");
    }
  }

  return (
    <ErrorBoundary>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="disclaimer" />
        <Stack.Screen
          name="signal/[id]"
          options={{ headerShown: true, title: "Detail Sinyal", ...headerTheme }}
        />
        <Stack.Screen
          name="upgrade"
          options={{ headerShown: true, title: "Pilih Plan", ...headerTheme }}
        />
      </Stack>
    </ErrorBoundary>
  );
}
