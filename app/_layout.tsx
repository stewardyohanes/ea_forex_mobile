import "../global.css";
import { useEffect } from "react";
import { Stack, router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "../src/store/authStore";
import { getMe } from "../src/api/auth";
import { colors } from "../src/theme";

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

  useEffect(() => {
    checkSession();
  }, []);

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
  );
}
