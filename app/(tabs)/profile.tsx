import { View, Text, TouchableOpacity, Alert } from "react-native";
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
    <View className="flex-1 bg-background p-4">
      <View className="bg-surface rounded-xl p-5 items-center mb-6 border border-bdr">
        <Text className="text-base font-semibold text-text-primary mb-3">
          {user?.email}
        </Text>
        <View
          className="px-4 py-1.5 rounded-full"
          style={{ backgroundColor: planColor[user?.plan ?? "free"] }}
        >
          <Text className="text-white font-bold text-sm">
            {planLabel[user?.plan ?? "free"]}
          </Text>
        </View>
        {user?.plan === "free" && (
          <TouchableOpacity
            className="mt-4 bg-primary px-6 py-2.5 rounded-lg"
            onPress={() => router.push("/upgrade")}
          >
            <Text className="text-white font-bold text-sm">
              ⚡ Upgrade Plan
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        className="bg-red p-3.5 rounded-lg items-center"
        onPress={handleLogout}
      >
        <Text className="text-white text-base font-semibold">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
