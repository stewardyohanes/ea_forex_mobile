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
import { Signal } from "../../src/types/signal";

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
        <ActivityIndicator style={{ marginTop: 32 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SignalCard signal={item} canViewDetail={canViewDetail} />
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.empty}>Tidak ada sinyal</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  filterRow: { flexDirection: "row", padding: 16, gap: 8 },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  filterActive: { backgroundColor: "#007AFF", borderColor: "#007AFF" },
  filterText: { fontSize: 14, color: "#333" },
  filterTextActive: { color: "#fff", fontWeight: "600" },
  list: { paddingBottom: 16 },
  center: { padding: 32, alignItems: "center" },
  empty: { color: "#888", fontSize: 16 },
});
