import { useEffect, useState } from "react";
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSignals } from "../../src/hooks/useSignals";
import { useAuthStore } from "../../src/store/authStore";
import SignalCard from "../../src/components/SignalCard";
import EmptyState from "../../src/components/EmptyState";
import { Signal } from "../../src/types/signal";
import { colors } from "../../src/theme";

type Direction = "ALL" | "BUY" | "SELL";

export default function HistoryScreen() {
  const { signals, loading, fetchInitial } = useSignals();
  const user = useAuthStore((s) => s.user);
  const canViewDetail = user?.plan === "premium" || user?.plan === "affiliate";
  const [filter, setFilter] = useState<Direction>("ALL");
  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetchInitial();
  }, []);

  const filtered: Signal[] =
    filter === "ALL" ? signals : signals.filter((s) => s.direction === filter);

  return (
    <View className="flex-1 bg-gradient-to-b from-surface to-background">
      <View className="flex-1" style={{ paddingTop: insets.top + 16 }}>
        <Text className="text-2xl font-extrabold text-text-primary px-4 mb-4">
          Riwayat Sinyal
        </Text>

        <View className="flex-row gap-2 px-4 mb-4">
          {(["ALL", "BUY", "SELL"] as Direction[]).map((d) => (
            <TouchableOpacity
              key={d}
              className={`px-5 py-2 rounded-full border ${filter === d ? "bg-primary border-primary" : "bg-surface border-bdr"}`}
              onPress={() => setFilter(d)}
            >
              <Text
                className={`text-sm font-semibold ${filter === d ? "text-white" : "text-text-secondary"}`}
              >
                {d === "ALL" ? "Semua" : d}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading && signals.length === 0 ? (
          <ActivityIndicator style={{ marginTop: 32 }} color={colors.green} />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <SignalCard signal={item} canViewDetail={canViewDetail} />
            )}
            contentContainerStyle={{ paddingBottom: 16, flexGrow: 1 }}
            ListEmptyComponent={
              <EmptyState message="Tidak ada sinyal" onRetry={fetchInitial} />
            }
          />
        )}
      </View>
    </View>
  );
}
