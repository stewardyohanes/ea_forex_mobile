import { View, Text, StyleSheet } from "react-native";

interface Props {
  direction: "BUY" | "SELL";
}

export default function DirectionBadge({ direction }: Props) {
  const isBuy = direction === "BUY";
  return (
    <View style={[styles.badge, isBuy ? styles.buy : styles.sell]}>
      <Text style={styles.text}>{direction}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  buy: { backgroundColor: "#34C759" },
  sell: { backgroundColor: "#FF3B30" },
  text: { color: "#fff", fontWeight: "700", fontSize: 13 },
});
