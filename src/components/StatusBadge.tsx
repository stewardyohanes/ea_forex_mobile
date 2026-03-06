import { View, Text } from "react-native";
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
    <View
      className="px-2.5 py-1 rounded-xl"
      style={{ backgroundColor: config.color }}
    >
      <Text className="text-white text-[11px] font-bold">{config.label}</Text>
    </View>
  );
}
