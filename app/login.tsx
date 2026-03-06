import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { login } from "../src/api/auth";
import { useAuthStore } from "../src/store/authStore";
import { colors } from "../src/theme";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Error", "Email dan password wajib diisi");
      return;
    }
    setLoading(true);
    try {
      const { token, user } = await login(email, password);
      await SecureStore.setItemAsync("jwt_token", token);
      setAuth(token, user);
      const ok = await SecureStore.getItemAsync("disclaimer_accepted");
      router.replace(ok ? "/(tabs)" : "/disclaimer");
    } catch (e: any) {
      Alert.alert(
        "Login Gagal",
        e.response?.data?.error ?? "Terjadi kesalahan",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 justify-center p-6 bg-background">
      <Text className="text-[32px] font-bold text-center text-text-primary mb-1">
        TradeGenZ
      </Text>
      <Text className="text-sm text-center text-text-secondary mb-10">
        Trading Intelligence Platform
      </Text>
      <TextInput
        className="border border-bdr rounded-lg p-3.5 mb-3 text-base bg-surface text-text-primary"
        placeholder="Email"
        placeholderTextColor={colors.textSecondary}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        className="border border-bdr rounded-lg p-3.5 mb-3 text-base bg-surface text-text-primary"
        placeholder="Password"
        placeholderTextColor={colors.textSecondary}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        className="bg-primary p-3.5 rounded-lg items-center mb-4"
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-base font-semibold">Login</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text className="text-center text-text-secondary text-sm">
          Belum punya akun? <Text style={{ color: colors.green }}>Daftar</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
