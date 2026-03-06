import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Signal } from "../types/signal";
import DirectionBadge from "./DirectionBadge";
import StatusBadge from "./StatusBadge";
import { colors } from "../theme";

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
          <Text style={[styles.value, { color: colors.green }]}>
            {signal.tp1 ?? "-"}
          </Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>SL</Text>
          <Text style={[styles.value, { color: colors.red }]}>{signal.sl}</Text>
        </View>
        {signal.risk_reward && (
          <View style={styles.item}>
            <Text style={styles.label}>RR</Text>
            <Text style={[styles.value, { color: colors.primary }]}>
              {Number(signal.risk_reward).toFixed(2)}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
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
        <StatusBadge status={signal.status} />
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
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  symbol: { fontSize: 18, fontWeight: "700", color: colors.textPrimary },
  row: { flexDirection: "row", gap: 16, marginBottom: 12 },
  item: { flex: 1 },
  label: { fontSize: 11, color: colors.textSecondary, marginBottom: 2 },
  value: { fontSize: 14, fontWeight: "600", color: colors.textPrimary },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLeft: { gap: 2 },
  timeframe: { fontSize: 12, color: colors.textSecondary },
  time: { fontSize: 12, color: colors.textSecondary },
  upgrade: {
    marginTop: 8,
    fontSize: 12,
    color: colors.primary,
    fontStyle: "italic",
  },
});
