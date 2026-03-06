import { useEffect, useState } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
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

  useEffect(() => {
    fetchInitial();
  }, []);

  const filtered: Signal[] =
    filter === "ALL" ? signals : signals.filter((s) => s.direction === filter);

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        {(["ALL", "BUY", "SELL"] as Direction[]).map((d) => (
          <TouchableOpacity
            key={d}
            style={[styles.filterBtn, filter === d && styles.filterActive]}
            onPress={() => setFilter(d)}
          >
            <Text
              style={[
                styles.filterText,
                filter === d && styles.filterTextActive,
              ]}
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
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState message="Tidak ada sinyal" onRetry={fetchInitial} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  filterRow: { flexDirection: "row", padding: 16, gap: 8 },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  filterActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: { fontSize: 14, color: colors.textSecondary },
  filterTextActive: { color: "#fff", fontWeight: "600" },
  list: { paddingBottom: 16, flexGrow: 1 },
});
