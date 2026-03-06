import { useEffect, useState } from "react";
import {
  FlatList,
  View,
  Text,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSignals } from "../../src/hooks/useSignals";
import { useAuthStore } from "../../src/store/authStore";
import SignalCard from "../../src/components/SignalCard";
import EmptyState from "../../src/components/EmptyState";
import { colors } from "../../src/theme";

export default function FeedScreen() {
  const { signals, loading, error, fetchInitial, fetchMore } = useSignals();
  const user = useAuthStore((s) => s.user);
  const canViewDetail = user?.plan === "premium" || user?.plan === "affiliate";
  const insets = useSafeAreaInsets();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Selamat pagi" : hour < 17 ? "Selamat siang" : "Selamat malam";
  const username = user?.email?.split("@")[0] ?? "Trader";

  useEffect(() => {
    fetchInitial();
  }, []);

  if (error) {
    return (
      <View className="flex-1 bg-gradient-to-b from-surface to-background">
        <View className="flex-1" style={{ paddingTop: insets.top }}>
          <EmptyState message={error} onRetry={fetchInitial} />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gradient-to-b from-surface to-background">
      {/* Header — gradient, no card */}
      <View className="px-4 pb-5" style={{ paddingTop: insets.top + 12 }}>
        <View className="flex-row justify-between items-center mb-4">
          <TouchableOpacity
            className="w-10 h-10 rounded-full border border-bdr items-center justify-center"
            style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
            onPress={() => setDrawerOpen(true)}
          >
            <Ionicons
              name="menu-outline"
              size={22}
              color={colors.textPrimary}
            />
          </TouchableOpacity>
          <Text className="text-base font-extrabold text-text-primary tracking-wide">
            TradeGenZ
          </Text>
          <TouchableOpacity
            className="w-10 h-10 rounded-full border border-bdr items-center justify-center"
            style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
          >
            <Ionicons
              name="notifications-outline"
              size={20}
              color={colors.textPrimary}
            />
          </TouchableOpacity>
        </View>

        <View className="mb-4">
          <Text className="text-[13px] text-text-secondary">{greeting} 👋</Text>
          <Text className="text-[22px] font-extrabold text-text-primary mt-0.5">
            {username}
          </Text>
        </View>

        {user?.plan === "free" && (
          <TouchableOpacity
            className="flex-row items-center rounded-2xl p-3.5 border"
            style={{
              backgroundColor: "rgba(255,255,255,0.06)",
              borderColor: colors.primary + "50",
            }}
            activeOpacity={0.8}
            onPress={() => router.push("/upgrade")}
          >
            <View className="flex-1">
              <Text
                className="text-[11px] font-bold mb-1"
                style={{ color: colors.primary }}
              >
                ✦ Upgrade Sekarang
              </Text>
              <Text className="text-[15px] font-bold text-text-primary">
                Akses Semua Sinyal Real-Time
              </Text>
              <Text className="text-xs text-text-secondary mt-0.5">
                Premium & Affiliate tersedia
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* List card — curved top */}
      <View className="flex-1 bg-surface rounded-t-[28px] overflow-hidden">
        <FlatList
          data={signals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SignalCard signal={item} canViewDetail={canViewDetail} />
          )}
          contentContainerStyle={{ paddingBottom: 16 }}
          onEndReached={fetchMore}
          onEndReachedThreshold={0.3}
          refreshControl={
            <RefreshControl
              refreshing={loading && signals.length === 0}
              onRefresh={fetchInitial}
              tintColor={colors.green}
            />
          }
          ListHeaderComponent={
            <View className="flex-row justify-between items-center px-4 pt-4 pb-2">
              <Text className="text-base font-bold text-text-primary">
                Sinyal Terbaru
              </Text>
              <Text className="text-[13px] text-text-secondary">
                {signals.length} sinyal
              </Text>
            </View>
          }
          ListEmptyComponent={
            !loading ? (
              <EmptyState message="Belum ada sinyal" onRetry={fetchInitial} />
            ) : null
          }
          ListFooterComponent={
            loading && signals.length > 0 ? (
              <ActivityIndicator style={{ margin: 16 }} color={colors.green} />
            ) : null
          }
        />
      </View>
    </View>
  );
}
