import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { useAuthStore } from "../../src/store/authStore";

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
    free: "#888",
    premium: "#007AFF",
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
      </View>
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  email: { fontSize: 16, fontWeight: "600", marginBottom: 12 },
  planBadge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  planText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  logoutBtn: {
    backgroundColor: "#FF3B30",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
