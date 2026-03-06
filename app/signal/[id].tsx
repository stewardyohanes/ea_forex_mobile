import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getSignalById } from "../../src/api/signals";
import { Signal } from "../../src/types/signal";
import DirectionBadge from "../../src/components/DirectionBadge";

export default function SignalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [signal, setSignal] = useState<Signal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSignalById(id)
      .then(setSignal)
      .catch(() => setError("Sinyal tidak ditemukan"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  if (error || !signal) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error ?? "Terjadi kesalahan"}</Text>
      </View>
    );
  }

  const rows = [
    { label: "Symbol", value: signal.symbol },
    { label: "Timeframe", value: signal.timeframe },
    { label: "Entry Price", value: String(signal.entry_price) },
    { label: "Stop Loss", value: String(signal.sl), color: "#FF3B30" },
    {
      label: "TP1",
      value: signal.tp1 ? String(signal.tp1) : "-",
      color: "#34C759",
    },
    {
      label: "TP2",
      value: signal.tp2 ? String(signal.tp2) : "-",
      color: "#34C759",
    },
    {
      label: "TP3",
      value: signal.tp3 ? String(signal.tp3) : "-",
      color: "#34C759",
    },
    {
      label: "Risk/Reward",
      value: signal.risk_reward ? Number(signal.risk_reward).toFixed(2) : "-",
    },
    { label: "Status", value: signal.status },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.symbol}>{signal.symbol}</Text>
        <DirectionBadge direction={signal.direction as "BUY" | "SELL"} />
      </View>
      <Text style={styles.time}>
        {new Date(signal.created_at).toLocaleString("id-ID")}
      </Text>
      <View style={styles.card}>
        {rows.map((row) => (
          <View key={row.label} style={styles.row}>
            <Text style={styles.rowLabel}>{row.label}</Text>
            <Text
              style={[styles.rowValue, row.color ? { color: row.color } : null]}
            >
              {row.value}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  content: { padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  error: { color: "#FF3B30" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  symbol: { fontSize: 24, fontWeight: "700" },
  time: { fontSize: 13, color: "#888", marginBottom: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  rowLabel: { fontSize: 14, color: "#666" },
  rowValue: { fontSize: 14, fontWeight: "600" },
});
