import { View, Text, TouchableOpacity, ScrollView, Alert, Linking } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../src/store/authStore";
import Avatar from "../../src/components/ui/Avatar";
import { colors, radius } from "../../src/theme";

const PLAN_CONFIG: Record<string, { label: string; color: string; glow: string }> = {
  free:      { label: "Free",      color: colors.textSecondary, glow: colors.border },
  premium:   { label: "Premium",   color: colors.primary,       glow: colors.primary },
  affiliate: { label: "Affiliate", color: colors.gold,          glow: colors.gold },
};

const WA_NUMBER = "62XXXXXXXXXX";

function MenuItem({
  icon,
  label,
  onPress,
  color,
  last = false,
}: {
  icon: any;
  label: string;
  onPress?: () => void;
  color?: string;
  last?: boolean;
}) {
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: colors.border,
      }}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={{ width: 32, alignItems: "center" }}>
        <Ionicons name={icon} size={20} color={color ?? colors.textSecondary} />
      </View>
      <Text style={{ flex: 1, color: color ?? colors.textPrimary, fontSize: 15, marginLeft: 10 }}>
        {label}
      </Text>
      <Ionicons name="chevron-forward" size={16} color={colors.border} />
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { user, clearAuth } = useAuthStore();
  const insets = useSafeAreaInsets();
  const plan = user?.plan ?? "free";
  const planCfg = PLAN_CONFIG[plan];
  const username = user?.email?.split("@")[0] ?? "Trader";

  const expireDate = user?.plan_expires_at
    ? new Date(user.plan_expires_at).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })
    : null;

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

  return (
    <LinearGradient colors={[colors.surface, colors.background]} style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 16, marginBottom: 24 }}>
          <Text style={{ color: colors.textPrimary, fontSize: 24, fontWeight: "800" }}>Profil</Text>
        </View>

        {/* Identity Card */}
        <Animated.View entering={FadeInDown.delay(0).springify()} style={{ marginHorizontal: 16, marginBottom: 16 }}>
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: radius.xl,
              padding: 24,
              alignItems: "center",
              borderWidth: 1,
              borderColor: `${planCfg.glow}40`,
            }}
          >
            <Avatar email={user?.email ?? "trader@email.com"} size={72} />

            <Text style={{ color: colors.textPrimary, fontSize: 18, fontWeight: "800", marginTop: 12 }}>
              {username}
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 2 }}>
              {user?.email}
            </Text>

            {/* Plan badge */}
            <View
              style={{
                marginTop: 12,
                paddingHorizontal: 16,
                paddingVertical: 6,
                borderRadius: radius.full,
                backgroundColor: `${planCfg.color}20`,
                borderWidth: 1.5,
                borderColor: planCfg.color,
              }}
            >
              <Text style={{ color: planCfg.color, fontSize: 13, fontWeight: "800", letterSpacing: 0.5 }}>
                ✦ {planCfg.label.toUpperCase()} MEMBER ✦
              </Text>
            </View>

            {expireDate && (
              <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 6 }}>
                Aktif hingga {expireDate}
              </Text>
            )}

            {plan === "free" && (
              <TouchableOpacity
                style={{
                  marginTop: 16,
                  backgroundColor: colors.primary,
                  paddingHorizontal: 24,
                  paddingVertical: 10,
                  borderRadius: radius.md,
                  width: "100%",
                  alignItems: "center",
                }}
                onPress={() => router.push("/upgrade")}
              >
                <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>
                  ⚡ Upgrade Plan
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeInDown.delay(80).springify()} style={{ marginHorizontal: 16, marginBottom: 16 }}>
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: radius.lg,
              borderWidth: 1,
              borderColor: colors.border,
              flexDirection: "row",
            }}
          >
            {[
              { label: "Signal Dilihat", value: "—", color: colors.textPrimary },
              { label: "Win Rate", value: "—", color: colors.green },
              { label: "Streak", value: "🔥 —", color: colors.gold },
            ].map((stat, i) => (
              <View
                key={stat.label}
                style={{
                  flex: 1,
                  padding: 16,
                  alignItems: "center",
                  borderRightWidth: i < 2 ? 1 : 0,
                  borderRightColor: colors.border,
                }}
              >
                <Text style={{ color: stat.color, fontSize: 18, fontWeight: "800" }}>{stat.value}</Text>
                <Text style={{ color: colors.textSecondary, fontSize: 10, fontWeight: "600", marginTop: 4, textAlign: "center" }}>
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Account menu */}
        <Animated.View entering={FadeInDown.delay(160).springify()} style={{ marginHorizontal: 16, marginBottom: 12 }}>
          <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: "700", letterSpacing: 1, marginBottom: 8, paddingHorizontal: 4 }}>
            AKUN
          </Text>
          <View style={{ backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, overflow: "hidden" }}>
            <MenuItem icon="notifications-outline" label="Pengaturan Notifikasi" />
            <MenuItem icon="link-outline" label="Referral & Komisi" onPress={() => router.push("/upgrade")} />
            <MenuItem icon="shield-checkmark-outline" label="Keamanan" last />
          </View>
        </Animated.View>

        {/* Other menu */}
        <Animated.View entering={FadeInDown.delay(220).springify()} style={{ marginHorizontal: 16, marginBottom: 16 }}>
          <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: "700", letterSpacing: 1, marginBottom: 8, paddingHorizontal: 4 }}>
            LAINNYA
          </Text>
          <View style={{ backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, overflow: "hidden" }}>
            <MenuItem icon="information-circle-outline" label="Tentang TradeGenZ" />
            <MenuItem
              icon="logo-whatsapp"
              label="Hubungi Support"
              color={colors.green}
              onPress={() => Linking.openURL(`https://wa.me/${WA_NUMBER}`)}
            />
            <MenuItem icon="star-outline" label="Beri Rating" last />
          </View>
        </Animated.View>

        {/* Logout */}
        <Animated.View entering={FadeInDown.delay(280).springify()} style={{ marginHorizontal: 16 }}>
          <TouchableOpacity
            style={{
              backgroundColor: `${colors.red}15`,
              borderRadius: radius.md,
              padding: 16,
              alignItems: "center",
              borderWidth: 1,
              borderColor: `${colors.red}30`,
            }}
            onPress={handleLogout}
          >
            <Text style={{ color: colors.red, fontSize: 15, fontWeight: "700" }}>Logout</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}
