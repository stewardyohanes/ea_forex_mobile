import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Signal } from "../types/signal";
import { colors } from "../theme";

interface Props {
  signal: Signal;
  canViewDetail: boolean;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  active: { label: "Active", color: colors.green },
  tp_hit: { label: "Take Profit", color: colors.green },
  sl_hit: { label: "Stop Loss", color: colors.red },
  closed: { label: "Trade Close", color: "#FFB800" },
};

const waitingConfig: Record<string, { label: string; color: string }> = {
  active: { label: "Waiting", color: colors.textSecondary },
  tp_hit: { label: "Expired", color: colors.textSecondary },
  sl_hit: { label: "Expired", color: colors.textSecondary },
  closed: { label: "Expired", color: colors.textSecondary },
};

export default function SignalCard({ signal, canViewDetail }: Props) {
  const directionColor = signal.direction === "BUY" ? colors.green : colors.red;
  const statusCfg = statusConfig[signal.status] ?? statusConfig.closed;
  const waitingCfg = waitingConfig[signal.status] ?? waitingConfig.closed;

  const formattedTime = new Date(signal.created_at)
    .toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(",", " -");

  return (
    <TouchableOpacity
      className="flex-row bg-surface mx-4 mb-2 rounded-xl overflow-hidden border border-bdr"
      onPress={() => canViewDetail && router.push(`/signal/${signal.id}`)}
      activeOpacity={canViewDetail ? 0.75 : 1}
    >
      {/* Left colored border */}
      <View className="w-1" style={{ backgroundColor: directionColor }} />

      {/* Content */}
      <View className="flex-1 py-3 pl-3 gap-[3px]">
        <Text className="text-base font-bold text-text-primary">
          {signal.symbol}{" "}
          <Text className="text-[13px] font-normal text-text-secondary">
            {signal.timeframe}
          </Text>
        </Text>
        <View className="flex-row items-center gap-1.5">
          <Text
            className="text-xs font-medium"
            style={{ color: waitingCfg.color }}
          >
            {waitingCfg.label}
          </Text>
          <Text
            className="text-xs font-bold"
            style={{ color: statusCfg.color }}
          >
            {statusCfg.label}
          </Text>
        </View>
        <Text className="text-xs text-text-secondary">
          Entry: {signal.entry_price}
        </Text>
        <Text className="text-[11px] text-text-secondary mt-0.5">
          {formattedTime}
        </Text>
      </View>

      {/* Right: Direction pill */}
      <View className="justify-center items-center px-3.5 gap-1.5">
        <View
          className="px-4 py-2 rounded-full border-[1.5px] min-w-[64px] items-center"
          style={{
            backgroundColor: directionColor + "20",
            borderColor: directionColor,
          }}
        >
          <Text
            className="text-[13px] font-extrabold tracking-wide"
            style={{ color: directionColor }}
          >
            {signal.direction}
          </Text>
        </View>
        {!canViewDetail && <Text className="text-sm">🔒</Text>}
      </View>
    </TouchableOpacity>
  );
}
