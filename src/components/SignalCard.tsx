import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Signal } from "../types/signal";
import DirectionBadge from "./DirectionBadge";

interface Props {
  signal: Signal;
  canViewDetail: boolean;
}

export default function SignalCard({ signal, canViewDetail }: Props) {
  function handlePress() {
    if (!canViewDetail) return;
    router.push(`/signal/${signal.id}`);
  }

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={canViewDetail ? 0.7 : 1}
    >
      <View style={styles.header}>
        <Text style={styles.symbol}>{signal.symbol}</Text>
        <DirectionBadge direction={signal.direction as "BUY" | "SELL"} />
      </View>
      <View style={styles.row}>
        <View style={styles.item}>
          <Text style={styles.label}>Entry</Text>
          <Text style={styles.value}>{signal.entry_price}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>TP1</Text>
          <Text style={[styles.value, styles.green]}>{signal.tp1 ?? "-"}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>SL</Text>
          <Text style={[styles.value, styles.red]}>{signal.sl}</Text>
        </View>
        {signal.risk_reward && (
          <View style={styles.item}>
            <Text style={styles.label}>RR</Text>
            <Text style={styles.value}>
              {Number(signal.risk_reward).toFixed(2)}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.footer}>
        <Text style={styles.timeframe}>{signal.timeframe}</Text>
        <Text style={styles.time}>
          {new Date(signal.created_at).toLocaleString("id-ID", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
      {!canViewDetail && (
        <Text style={styles.upgrade}>
          Upgrade ke Premium untuk lihat detail
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  symbol: { fontSize: 18, fontWeight: "700" },
  row: { flexDirection: "row", gap: 16, marginBottom: 12 },
  item: { flex: 1 },
  label: { fontSize: 11, color: "#888", marginBottom: 2 },
  value: { fontSize: 14, fontWeight: "600" },
  green: { color: "#34C759" },
  red: { color: "#FF3B30" },
  footer: { flexDirection: "row", justifyContent: "space-between" },
  timeframe: { fontSize: 12, color: "#888" },
  time: { fontSize: 12, color: "#888" },
  upgrade: {
    marginTop: 8,
    fontSize: 12,
    color: "#007AFF",
    fontStyle: "italic",
  },
});
