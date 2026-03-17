import { useEffect, useState, useCallback } from "react";
import { FlatList, View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useAuthStore } from "../../src/store/authStore";
import SignalCard from "../../src/components/SignalCard";
import EmptyState from "../../src/components/EmptyState";
import { getSignals } from "../../src/api/signals";
import { Signal } from "../../src/types/signal";
import { colors, radius } from "../../src/theme";

type Direction = "ALL" | "BUY" | "SELL";
const FILTERS: { key: Direction; label: string }[] = [
  { key: "ALL", label: "Semua" },
  { key: "BUY", label: "BUY" },
  { key: "SELL", label: "SELL" },
];

function FilterPill({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  async function handlePress() {
    scale.value = withSpring(0.92, { damping: 12 });
    setTimeout(() => { scale.value = withSpring(1, { damping: 12 }); }, 100);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }

  return (
    <Animated.View style={animStyle}>
      <TouchableOpacity
        style={{
          paddingHorizontal: 20,
          paddingVertical: 8,
          borderRadius: radius.full,
          backgroundColor: active ? colors.primary : colors.surface,
          borderWidth: 1,
          borderColor: active ? colors.primary : colors.border,
        }}
        onPress={handlePress}
        activeOpacity={1}
      >
        <Text style={{ color: active ? "#fff" : colors.textSecondary, fontSize: 13, fontWeight: "700" }}>
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function HistoryScreen() {
  const user = useAuthStore((s) => s.user);
  const canViewDetail = user?.plan === "premium" || user?.plan === "affiliate";
  const [filter, setFilter] = useState<Direction>("ALL");
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const fetchSignals = useCallback(async (direction: Direction) => {
    setLoading(true);
    try {
      const data = await getSignals(1, 50, direction === "ALL" ? undefined : direction);
      setSignals(data.data ?? []);
    } catch {
      setSignals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSignals(filter);
  }, [filter]);

  return (
    <LinearGradient colors={[colors.surface, colors.background]} style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingTop: insets.top + 16 }}>
        {/* Header */}
        <Text style={{ color: colors.textPrimary, fontSize: 24, fontWeight: "800", paddingHorizontal: 16, marginBottom: 16 }}>
          Riwayat Sinyal
        </Text>

        {/* Filter pills */}
        <View style={{ flexDirection: "row", gap: 8, paddingHorizontal: 16, marginBottom: 16 }}>
          {FILTERS.map((f) => (
            <FilterPill
              key={f.key}
              label={f.label}
              active={filter === f.key}
              onPress={() => setFilter(f.key)}
            />
          ))}
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 10 }}>
              {signals.length} sinyal
            </Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator style={{ marginTop: 40 }} color={colors.green} />
        ) : (
          <FlatList
            data={signals}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <SignalCard signal={item} canViewDetail={canViewDetail} index={index} />
            )}
            contentContainerStyle={{ paddingBottom: 16, flexGrow: 1 }}
            ListEmptyComponent={
              <EmptyState message="Tidak ada sinyal" onRetry={() => fetchSignals(filter)} />
            }
          />
        )}
      </View>
    </LinearGradient>
  );
}
