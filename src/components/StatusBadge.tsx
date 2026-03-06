import { View, Text, StyleSheet } from "react-native";
import { colors } from "../theme";

const statusConfig: Record<string, { label: string; color: string }> = {
  active: { label: "Aktif", color: colors.primary },
  tp_hit: { label: "TP Hit", color: colors.green },
  sl_hit: { label: "SL Hit", color: colors.red },
  closed: { label: "Closed", color: colors.textSecondary },
};

export default function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? statusConfig.closed;
  return (
    <View style={[styles.badge, { backgroundColor: config.color }]}>
      <Text style={styles.text}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  text: { color: "#fff", fontSize: 11, fontWeight: "700" },
});
