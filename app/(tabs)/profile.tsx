import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { useAuthStore } from "../../src/store/authStore";
import { colors } from "../../src/theme";

export default function ProfileScreen() {
  const { user, clearAuth } = useAuthStore();

  async function handleLogout() {
    Alert.alert("Logout", "Yakin ingin keluar?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await SecureStore.deleteItemAsync("jwt_token");
          clearAuth();
          router.replace("/login");
        },
      },
    ]);
  }

  const planLabel: Record<string, string> = {
    free: "Free",
    premium: "Premium",
    affiliate: "Affiliate",
  };
  const planColor: Record<string, string> = {
    free: colors.textSecondary,
    premium: colors.primary,
    affiliate: "#FF9500",
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.email}>{user?.email}</Text>
        <View
          style={[
            styles.planBadge,
            { backgroundColor: planColor[user?.plan ?? "free"] },
          ]}
        >
          <Text style={styles.planText}>{planLabel[user?.plan ?? "free"]}</Text>
        </View>

        {user?.plan === "free" && (
          <TouchableOpacity
            style={styles.upgradeBtn}
            onPress={() => router.push("/upgrade")}
          >
            <Text style={styles.upgradeText}>⚡ Upgrade Plan</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  email: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 12,
  },
  planBadge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  planText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  upgradeBtn: {
    marginTop: 16,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  upgradeText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  logoutBtn: {
    backgroundColor: colors.red,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
1;
