import { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { LinearGradient } from "expo-linear-gradient";
import { login } from "../src/api/auth";
import { useAuthStore } from "../src/store/authStore";
import { colors } from "../src/theme";
import Input from "../src/components/ui/Input";
import Button from "../src/components/ui/Button";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const setAuth = useAuthStore((s) => s.setAuth);

  async function handleLogin() {
    setError("");
    if (!email || !password) {
      setError("Email dan password wajib diisi");
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
      setError(e.response?.data?.error ?? "Login gagal. Periksa email dan password kamu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient
      colors={[colors.surface, colors.background]}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={{ alignItems: "center", marginBottom: 40 }}>
          <Text style={{ fontSize: 32, fontWeight: "800", color: colors.textPrimary, letterSpacing: 1 }}>
            TradeGenZ
          </Text>
          <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 4 }}>
            Trading Intelligence Platform
          </Text>
          <View style={{ width: 40, height: 3, backgroundColor: colors.primary, borderRadius: 2, marginTop: 12 }} />
        </View>

        {/* Form */}
        <Input
          label="Email"
          placeholder="trader@email.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={(t) => { setEmail(t); setError(""); }}
        />
        <Input
          label="Password"
          placeholder="Masukkan password kamu"
          isPassword
          value={password}
          onChangeText={(t) => { setPassword(t); setError(""); }}
        />

        {error ? (
          <Text style={{ color: colors.red, fontSize: 13, marginBottom: 12, marginLeft: 2 }}>
            {error}
          </Text>
        ) : null}

        <Button label="Login" onPress={handleLogin} loading={loading} fullWidth />

        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 20 }}>
          <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
            Belum punya akun?{" "}
          </Text>
          <Text
            style={{ color: colors.green, fontSize: 14, fontWeight: "700" }}
            onPress={() => router.push("/register")}
          >
            Daftar
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
