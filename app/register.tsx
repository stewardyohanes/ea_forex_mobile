import { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { LinearGradient } from "expo-linear-gradient";
import { register } from "../src/api/auth";
import { useAuthStore } from "../src/store/authStore";
import { colors } from "../src/theme";
import Input from "../src/components/ui/Input";
import Button from "../src/components/ui/Button";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const setAuth = useAuthStore((s) => s.setAuth);

  async function handleRegister() {
    setError("");
    if (!email || !password) {
      setError("Email dan password wajib diisi");
      return;
    }
    if (password.length < 8) {
      setError("Password minimal 8 karakter");
      return;
    }
    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok");
      return;
    }
    setLoading(true);
    try {
      const { token, user } = await register(email, password);
      await SecureStore.setItemAsync("jwt_token", token);
      setAuth(token, user);
      router.replace("/disclaimer");
    } catch (e: any) {
      setError(e.response?.data?.error ?? "Registrasi gagal. Coba lagi.");
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
        {/* Header */}
        <View style={{ alignItems: "center", marginBottom: 40 }}>
          <Text style={{ fontSize: 28, fontWeight: "800", color: colors.textPrimary }}>
            Buat Akun Baru
          </Text>
          <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 6 }}>
            Mulai trading lebih cerdas hari ini
          </Text>
          <View style={{ width: 40, height: 3, backgroundColor: colors.green, borderRadius: 2, marginTop: 12 }} />
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
          placeholder="Minimal 8 karakter"
          isPassword
          value={password}
          onChangeText={(t) => { setPassword(t); setError(""); }}
        />
        <Input
          label="Konfirmasi Password"
          placeholder="Ulangi password"
          isPassword
          value={confirmPassword}
          onChangeText={(t) => { setConfirmPassword(t); setError(""); }}
        />

        {error ? (
          <Text style={{ color: colors.red, fontSize: 13, marginBottom: 12, marginLeft: 2 }}>
            {error}
          </Text>
        ) : null}

        <Button label="Daftar Sekarang" onPress={handleRegister} loading={loading} variant="primary" fullWidth />

        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 20 }}>
          <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
            Sudah punya akun?{" "}
          </Text>
          <Text
            style={{ color: colors.primary, fontSize: 14, fontWeight: "700" }}
            onPress={() => router.back()}
          >
            Login
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
