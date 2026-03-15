import { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getSignalById } from "../../src/api/signals";
import { Signal } from "../../src/types/signal";
import DirectionBadge from "../../src/components/DirectionBadge";
import StatusBadge from "../../src/components/StatusBadge";
import { colors } from "../../src/theme";

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

  if (loading)
    return (
      <ActivityIndicator
        style={{ flex: 1, backgroundColor: colors.background }}
        color={colors.green}
      />
    );

  if (error || !signal)
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-red">{error ?? "Terjadi kesalahan"}</Text>
      </View>
    );

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
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 16 }}
    >
      <View className="flex-row justify-between items-center mb-1">
        <Text className="text-2xl font-bold text-text-primary">
          {signal.symbol}
        </Text>
        <View className="flex-row gap-2 items-center">
          <DirectionBadge direction={signal.direction as "BUY" | "SELL"} />
          <StatusBadge status={signal.status} />
        </View>
      </View>
      <Text className="text-[13px] text-text-secondary mb-4">
        {new Date(signal.created_at).toLocaleString("id-ID")}
      </Text>
      <View className="bg-surface rounded-xl p-4 border border-bdr">
        {rows.map((row, i) => (
          <View
            key={row.label}
            className={`flex-row justify-between py-3 ${i < rows.length - 1 ? "border-b border-bdr" : ""}`}
          >
            <Text className="text-sm text-text-secondary">{row.label}</Text>
            <Text
              className="text-sm font-semibold text-text-primary"
              style={row.color ? { color: row.color } : undefined}
            >
              {row.value}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
