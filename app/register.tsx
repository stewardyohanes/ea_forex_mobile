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
import { register } from "../src/api/auth";
import { useAuthStore } from "../src/store/authStore";
import { colors } from "../src/theme";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);

  async function handleRegister() {
    if (!email || !password) {
      Alert.alert("Error", "Email dan password wajib diisi");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password minimal 6 karakter");
      return;
    }
    setLoading(true);
    try {
      const { token, user } = await register(email, password);
      await SecureStore.setItemAsync("jwt_token", token);
      setAuth(token, user);
      router.replace("/disclaimer");
    } catch (e: any) {
      Alert.alert(
        "Registrasi Gagal",
        e.response?.data?.error ?? "Terjadi kesalahan",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 justify-center p-6 bg-background">
      <Text className="text-[28px] font-bold text-center text-text-primary mb-8">
        Daftar Akun
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
        placeholder="Password (min. 6 karakter)"
        placeholderTextColor={colors.textSecondary}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        className="bg-green p-3.5 rounded-lg items-center mb-4"
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-background text-base font-bold">Daftar</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.back()}>
        <Text className="text-center text-text-secondary text-sm">
          Sudah punya akun? <Text style={{ color: colors.primary }}>Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
