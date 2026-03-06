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
import { dummySignals } from "../../src/data/dummySignals";
import DirectionBadge from "../../src/components/DirectionBadge";
import StatusBadge from "../../src/components/StatusBadge";
import { colors } from "../../src/theme";

const USE_DUMMY = true;

export default function SignalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [signal, setSignal] = useState<Signal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (USE_DUMMY) {
      const found = dummySignals.find((s) => s.id === id) ?? null;
      setSignal(found);
      if (!found) setError("Sinyal tidak ditemukan");
      setLoading(false);
      return;
    }
    getSignalById(id)
      .then(setSignal)
      .catch(() => setError("Sinyal tidak ditemukan"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <ActivityIndicator
        style={{ flex: 1, backgroundColor: colors.background }}
        color={colors.green}
      />
    );

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
    { label: "Stop Loss", value: String(signal.sl), color: colors.red },
    {
      label: "TP1",
      value: signal.tp1 ? String(signal.tp1) : "-",
      color: colors.green,
    },
    {
      label: "TP2",
      value: signal.tp2 ? String(signal.tp2) : "-",
      color: colors.green,
    },
    {
      label: "TP3",
      value: signal.tp3 ? String(signal.tp3) : "-",
      color: colors.green,
    },
    {
      label: "Risk/Reward",
      value: signal.risk_reward ? Number(signal.risk_reward).toFixed(2) : "-",
      color: colors.primary,
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.symbol}>{signal.symbol}</Text>
        <View style={styles.badges}>
          <DirectionBadge direction={signal.direction as "BUY" | "SELL"} />
          <StatusBadge status={signal.status} />
        </View>
      </View>
      <Text style={styles.time}>
        {new Date(signal.created_at).toLocaleString("id-ID")}
      </Text>
      <View style={styles.card}>
        {rows.map((row, i) => (
          <View
            key={row.label}
            style={[
              styles.row,
              i === rows.length - 1 && { borderBottomWidth: 0 },
            ]}
          >
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
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  error: { color: colors.red },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  symbol: { fontSize: 24, fontWeight: "700", color: colors.textPrimary },
  badges: { flexDirection: "row", gap: 8, alignItems: "center" },
  time: { fontSize: 13, color: colors.textSecondary, marginBottom: 16 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLabel: { fontSize: 14, color: colors.textSecondary },
  rowValue: { fontSize: 14, fontWeight: "600", color: colors.textPrimary },
});
