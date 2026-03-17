import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInRight, FadeInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { getSignalById } from "../../src/api/signals";
import { Signal } from "../../src/types/signal";
import { colors, radius, typography } from "../../src/theme";
import PulseDot from "../../src/components/PulseDot";

const PAIR_NAMES: Record<string, string> = {
  XAUUSD: "Gold vs US Dollar",
  EURUSD: "Euro vs US Dollar",
  GBPUSD: "British Pound vs USD",
  USDJPY: "US Dollar vs Yen",
  AUDUSD: "Australian Dollar vs USD",
  USDCAD: "US Dollar vs Canadian Dollar",
  USDCHF: "US Dollar vs Swiss Franc",
  GBPJPY: "British Pound vs Yen",
  EURJPY: "Euro vs Yen",
  NZDUSD: "New Zealand Dollar vs USD",
};

interface LadderLevel {
  label: string;
  value: number;
  color: string;
  isEntry?: boolean;
}

function PriceLadder({ levels, direction }: { levels: LadderLevel[]; direction: string }) {
  const sorted = [...levels].sort((a, b) => b.value - a.value);
  const min = Math.min(...levels.map((l) => l.value));
  const max = Math.max(...levels.map((l) => l.value));
  const range = max - min || 1;

  return (
    <View style={{ gap: 2 }}>
      {sorted.map((level, i) => {
        const pct = ((level.value - min) / range) * 85 + 10;
        return (
          <Animated.View
            key={level.label}
            entering={FadeInRight.delay(i * 80).springify().damping(14)}
            style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 6 }}
          >
            {/* Label */}
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 11,
                fontWeight: "700",
                width: 36,
                textAlign: "right",
              }}
            >
              {level.label}
            </Text>

            {/* Bar + dot */}
            <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  height: level.isEntry ? 2 : 1,
                  width: `${pct}%`,
                  backgroundColor: level.isEntry ? colors.textSecondary : level.color,
                  opacity: level.isEntry ? 0.4 : 0.6,
                }}
              />
              <View
                style={{
                  width: level.isEntry ? 12 : 8,
                  height: level.isEntry ? 12 : 8,
                  borderRadius: level.isEntry ? 6 : 4,
                  backgroundColor: level.isEntry ? colors.textPrimary : level.color,
                  borderWidth: level.isEntry ? 2 : 0,
                  borderColor: colors.background,
                }}
              />
            </View>

            {/* Value */}
            <Text
              style={{
                color: level.isEntry ? colors.textPrimary : level.color,
                fontSize: level.isEntry ? 14 : 13,
                fontWeight: level.isEntry ? "800" : "700",
                width: 72,
              }}
            >
              {level.value.toLocaleString("id-ID")}
            </Text>
          </Animated.View>
        );
      })}
    </View>
  );
}

export default function SignalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [signal, setSignal] = useState<Signal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [followed, setFollowed] = useState(false);

  useEffect(() => {
    getSignalById(id)
      .then(setSignal)
      .catch(() => setError("Sinyal tidak ditemukan"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={colors.green} size="large" />
      </View>
    );
  }

  if (error || !signal) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: colors.red }}>{error ?? "Terjadi kesalahan"}</Text>
      </View>
    );
  }

  const directionColor = signal.direction === "BUY" ? colors.green : colors.red;
  const isActive = signal.status === "active";
  const rrValue = signal.risk_reward ? Number(signal.risk_reward) : null;
  const rrColor = rrValue === null ? colors.textSecondary : rrValue >= 1.5 ? colors.green : rrValue >= 1 ? colors.gold : colors.red;

  // Build price ladder levels
  const ladderLevels: LadderLevel[] = [
    { label: "SL", value: Number(signal.sl), color: colors.red },
    { label: "ENTRY", value: Number(signal.entry_price), color: colors.textPrimary, isEntry: true },
  ];
  if (signal.tp1) ladderLevels.push({ label: "TP1", value: Number(signal.tp1), color: colors.green });
  if (signal.tp2) ladderLevels.push({ label: "TP2", value: Number(signal.tp2), color: colors.green });
  if (signal.tp3) ladderLevels.push({ label: "TP3", value: Number(signal.tp3), color: colors.green });

  const riskPips = Math.abs(Number(signal.entry_price) - Number(signal.sl));
  const rewardPips = signal.tp1 ? Math.abs(Number(signal.tp1) - Number(signal.entry_price)) : null;

  async function handleFollow() {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setFollowed(true);
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Background glow */}
      <View
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 200,
          height: 200,
          borderRadius: 100,
          backgroundColor: `${directionColor}12`,
          transform: [{ scale: 2 }],
        }}
      />

      {/* Custom header */}
      <View
        style={{
          paddingTop: insets.top + 12,
          paddingHorizontal: 16,
          paddingBottom: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.surface,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: colors.border,
          }}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>

        <Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: "700" }}>
          Detail Sinyal
        </Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}>
        {/* Signal header */}
        <Animated.View entering={FadeInDown.delay(0).springify()} style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            <View>
              <Text style={{ color: colors.textPrimary, fontSize: 28, fontWeight: "800" }}>
                {signal.symbol}
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 2 }}>
                {PAIR_NAMES[signal.symbol] ?? signal.symbol}
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 4 }}>
                {signal.timeframe} · {new Date(signal.created_at).toLocaleString("id-ID", {
                  weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                })}
              </Text>
            </View>

            <View style={{ alignItems: "flex-end", gap: 8 }}>
              {/* Direction badge */}
              <View
                style={{
                  paddingVertical: 6,
                  paddingHorizontal: 16,
                  borderRadius: radius.full,
                  backgroundColor: `${directionColor}20`,
                  borderWidth: 1.5,
                  borderColor: directionColor,
                }}
              >
                <Text style={{ color: directionColor, fontSize: 15, fontWeight: "800" }}>
                  {signal.direction}
                </Text>
              </View>

              {/* Status badge */}
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <PulseDot color={directionColor} size={6} active={isActive} />
                <Text style={{ color: isActive ? colors.green : colors.textSecondary, fontSize: 12, fontWeight: "600" }}>
                  {isActive ? "Active" : signal.status === "tp_hit" ? "TP Hit" : signal.status === "sl_hit" ? "SL Hit" : "Closed"}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Price Ladder */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          style={{
            backgroundColor: colors.surface,
            borderRadius: radius.lg,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.border,
            marginBottom: 12,
          }}
        >
          <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: "700", letterSpacing: 1, marginBottom: 12 }}>
            PRICE LEVELS
          </Text>
          <PriceLadder levels={ladderLevels} direction={signal.direction} />
        </Animated.View>

        {/* Risk Analysis */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={{
            backgroundColor: colors.surface,
            borderRadius: radius.lg,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.border,
            marginBottom: 12,
          }}
        >
          <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: "700", letterSpacing: 1, marginBottom: 12 }}>
            RISK ANALYSIS
          </Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ alignItems: "center" }}>
              <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: "600" }}>RISK</Text>
              <Text style={{ color: colors.red, fontSize: 20, fontWeight: "800", marginTop: 4 }}>
                {riskPips.toFixed(2)}
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: 10 }}>pips</Text>
            </View>

            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <View style={{ width: 1, height: 40, backgroundColor: colors.border }} />
            </View>

            <View style={{ alignItems: "center" }}>
              <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: "600" }}>REWARD (TP1)</Text>
              <Text style={{ color: colors.green, fontSize: 20, fontWeight: "800", marginTop: 4 }}>
                {rewardPips !== null ? rewardPips.toFixed(2) : "—"}
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: 10 }}>pips</Text>
            </View>

            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <View style={{ width: 1, height: 40, backgroundColor: colors.border }} />
            </View>

            <View style={{ alignItems: "center" }}>
              <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: "600" }}>R/R RATIO</Text>
              <Text style={{ color: rrColor, fontSize: 20, fontWeight: "800", marginTop: 4 }}>
                {rrValue !== null ? `1:${rrValue.toFixed(1)}` : "—"}
              </Text>
              {rrValue !== null && rrValue >= 1.5 && (
                <Text style={{ color: colors.gold, fontSize: 12 }}>✦ Bagus</Text>
              )}
            </View>
          </View>
        </Animated.View>

        {/* Follow button */}
        {isActive && (
          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <TouchableOpacity
              style={{
                backgroundColor: followed ? `${colors.green}20` : colors.primary,
                borderRadius: radius.md,
                padding: 16,
                alignItems: "center",
                borderWidth: followed ? 1.5 : 0,
                borderColor: followed ? colors.green : "transparent",
              }}
              onPress={handleFollow}
              disabled={followed}
            >
              <Text style={{ color: followed ? colors.green : "#fff", fontSize: 15, fontWeight: "700" }}>
                {followed ? "✓ Signal Ditandai" : "Tandai Sudah Ikuti Signal Ini"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}
