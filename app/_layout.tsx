import { useEffect } from "react";
import { Stack, router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "../src/store/authStore";
import { getMe } from "../src/api/auth";

export default function RootLayout() {
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
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
      if (!disclaimerAccepted) {
        router.replace("/disclaimer");
      } else {
        router.replace("/(tabs)");
      }
    } catch {
      await SecureStore.deleteItemAsync("jwt_token");
      router.replace("/login");
    }
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="disclaimer" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="signal/[id]"
        options={{ headerShown: true, title: "Detail Sinyal" }}
      />
    </Stack>
  );
}
