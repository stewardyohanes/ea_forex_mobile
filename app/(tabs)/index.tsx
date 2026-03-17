import { useEffect } from "react";
import {
  FlatList,
  View,
  Text,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSignals } from "../../src/hooks/useSignals";
import { useAuthStore } from "../../src/store/authStore";
import SignalCard from "../../src/components/SignalCard";
import EmptyState from "../../src/components/EmptyState";
import { SignalCardSkeleton } from "../../src/components/ui/Skeleton";
import PulseDot from "../../src/components/PulseDot";
import { colors, radius } from "../../src/theme";

// Market session logic based on UTC time
function getActiveSession(): { name: string; active: boolean } {
  const utcHour = new Date().getUTCHours();
  if (utcHour >= 7 && utcHour < 16) return { name: "London", active: true };
  if (utcHour >= 12 && utcHour < 21) return { name: "New York", active: true };
  if (utcHour >= 0 && utcHour < 9) return { name: "Tokyo", active: true };
  if (utcHour >= 21 || utcHour < 6) return { name: "Sydney", active: true };
  return { name: "Tutup", active: false };
}

function MarketPulseWidget() {
  const session = getActiveSession();
  return (
    <View
      style={{
        backgroundColor: `${colors.primary}12`,
        borderRadius: radius.lg,
        padding: 14,
        borderWidth: 1,
        borderColor: `${colors.primary}30`,
        marginBottom: 12,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: "700", letterSpacing: 1 }}>
          📈 MARKET PULSE
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <PulseDot color={session.active ? colors.green : colors.textSecondary} size={6} active={session.active} />
          <Text style={{ color: session.active ? colors.green : colors.textSecondary, fontSize: 11, fontWeight: "700" }}>
            {session.name} Session {session.active ? "OPEN" : "CLOSED"}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: "row", gap: 20 }}>
        <View>
          <Text style={{ color: colors.textSecondary, fontSize: 10, fontWeight: "600" }}>XAUUSD</Text>
          <Text style={{ color: colors.textPrimary, fontSize: 13, fontWeight: "700" }}>Gold</Text>
        </View>
        <View>
          <Text style={{ color: colors.textSecondary, fontSize: 10, fontWeight: "600" }}>EURUSD</Text>
          <Text style={{ color: colors.textPrimary, fontSize: 13, fontWeight: "700" }}>Euro</Text>
        </View>
        <View>
          <Text style={{ color: colors.textSecondary, fontSize: 10, fontWeight: "600" }}>GBPUSD</Text>
          <Text style={{ color: colors.textPrimary, fontSize: 13, fontWeight: "700" }}>Pound</Text>
        </View>
      </View>
    </View>
  );
}

export default function FeedScreen() {
  const { signals, loading, error, fetchInitial, fetchMore } = useSignals();
  const user = useAuthStore((s) => s.user);
  const canViewDetail = user?.plan === "premium" || user?.plan === "affiliate";
  const insets = useSafeAreaInsets();

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Selamat pagi" : hour < 17 ? "Selamat siang" : "Selamat malam";
  const username = user?.email?.split("@")[0] ?? "Trader";
  const activeSignals = signals.filter((s) => s.status === "active").length;

  useEffect(() => {
    fetchInitial();
  }, []);

  return (
    <LinearGradient
      colors={[colors.surface, colors.background]}
      style={{ flex: 1 }}
    >
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingBottom: 16, paddingTop: insets.top + 12 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <View
            style={{
              width: 40, height: 40, borderRadius: 20,
              backgroundColor: "rgba(255,255,255,0.06)",
              alignItems: "center", justifyContent: "center",
              borderWidth: 1, borderColor: colors.border,
            }}
          >
            <Ionicons name="menu-outline" size={22} color={colors.textPrimary} />
          </View>

          <Text style={{ color: colors.textPrimary, fontSize: 15, fontWeight: "800", letterSpacing: 1 }}>
            TradeGenZ
          </Text>

          <TouchableOpacity
            style={{
              width: 40, height: 40, borderRadius: 20,
              backgroundColor: "rgba(255,255,255,0.06)",
              alignItems: "center", justifyContent: "center",
              borderWidth: 1, borderColor: colors.border,
            }}
          >
            <Ionicons name="notifications-outline" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Greeting */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{greeting} 👋</Text>
          <Text style={{ color: colors.textPrimary, fontSize: 22, fontWeight: "800", marginTop: 2 }}>
            {username}
          </Text>
        </View>

        {/* Market Pulse */}
        <MarketPulseWidget />

        {/* Active signals badge */}
        {activeSignals > 0 && (
          <Animated.View
            entering={FadeInDown.springify()}
            style={{
              backgroundColor: `${colors.green}15`,
              borderRadius: radius.md,
              padding: 12,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              borderWidth: 1,
              borderColor: `${colors.green}30`,
              marginBottom: 12,
            }}
          >
            <PulseDot color={colors.green} size={8} active />
            <Text style={{ color: colors.green, fontSize: 14, fontWeight: "700", flex: 1 }}>
              ⚡ {activeSignals} Sinyal Aktif Sekarang
            </Text>
          </Animated.View>
        )}

        {/* Upgrade banner for free users */}
        {user?.plan === "free" && (
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderRadius: radius.lg,
              padding: 14,
              backgroundColor: "rgba(255,255,255,0.05)",
              borderWidth: 1,
              borderColor: `${colors.primary}40`,
            }}
            onPress={() => router.push("/upgrade")}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.primary, fontSize: 11, fontWeight: "700", marginBottom: 2 }}>
                ✦ UPGRADE SEKARANG
              </Text>
              <Text style={{ color: colors.textPrimary, fontSize: 15, fontWeight: "700" }}>
                Akses Semua Sinyal Real-Time
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 2 }}>
                Entry · SL · TP · Notifikasi instan
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Signal list — curved top */}
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          overflow: "hidden",
        }}
      >
        {/* Skeleton saat loading awal */}
        {loading && signals.length === 0 ? (
          <View style={{ paddingTop: 16 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16, marginBottom: 8 }}>
              <Text style={{ color: colors.textPrimary, fontSize: 15, fontWeight: "700" }}>Sinyal Terbaru</Text>
            </View>
            {[...Array(5)].map((_, i) => <SignalCardSkeleton key={i} />)}
          </View>
        ) : error ? (
          <EmptyState message={error} onRetry={fetchInitial} />
        ) : (
          <FlatList
            data={signals}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <SignalCard signal={item} canViewDetail={canViewDetail} index={index} />
            )}
            contentContainerStyle={{ paddingBottom: 16 }}
            onEndReached={fetchMore}
            onEndReachedThreshold={0.3}
            refreshControl={
              <RefreshControl
                refreshing={loading && signals.length > 0}
                onRefresh={fetchInitial}
                tintColor={colors.green}
              />
            }
            ListHeaderComponent={
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
                <Text style={{ color: colors.textPrimary, fontSize: 15, fontWeight: "700" }}>
                  Sinyal Terbaru
                </Text>
                <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                  {signals.length} sinyal
                </Text>
              </View>
            }
            ListEmptyComponent={
              <EmptyState message="Belum ada sinyal" onRetry={fetchInitial} />
            }
            ListFooterComponent={
              loading && signals.length > 0 ? (
                <ActivityIndicator style={{ margin: 16 }} color={colors.green} />
              ) : null
            }
          />
        )}
      </View>
    </LinearGradient>
  );
}
