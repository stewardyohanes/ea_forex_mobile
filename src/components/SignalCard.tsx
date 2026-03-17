import { View, Text, TouchableOpacity } from "react-native";
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Signal } from "../types/signal";
import { colors, radius } from "../theme";
import PulseDot from "./PulseDot";

interface Props {
  signal: Signal;
  canViewDetail: boolean;
  index?: number;
}

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

const STATUS_LABEL: Record<string, string> = {
  active: "Active",
  tp_hit: "TP Hit ✓",
  sl_hit: "SL Hit ✗",
  closed: "Closed",
};

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function SignalCard({ signal, canViewDetail, index = 0 }: Props) {
  const directionColor = signal.direction === "BUY" ? colors.green : colors.red;
  const isActive = signal.status === "active";
  const scale = useSharedValue(1);

  const pairName = PAIR_NAMES[signal.symbol] ?? signal.symbol;
  const statusLabel = STATUS_LABEL[signal.status] ?? signal.status;

  // R/R ratio
  const rrValue = signal.risk_reward ? Number(signal.risk_reward) : null;
  const rrColor =
    rrValue === null
      ? colors.textSecondary
      : rrValue >= 1.5
      ? colors.green
      : rrValue >= 1
      ? colors.gold
      : colors.red;

  const formattedTime = new Date(signal.created_at)
    .toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(",", " ·");

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  async function handlePress() {
    if (!canViewDetail) return;
    scale.value = withSpring(0.97, { damping: 15 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 15 });
    }, 100);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/signal/${signal.id}`);
  }

  return (
    <AnimatedTouchable
      entering={FadeInDown.delay(index * 60)
        .springify()
        .damping(14)}
      style={[
        animatedStyle,
        {
          backgroundColor: colors.surface,
          marginHorizontal: 16,
          marginBottom: 8,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.border,
          overflow: "hidden",
        },
      ]}
      onPress={handlePress}
      activeOpacity={1}
    >
      {/* Left accent bar */}
      <View
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          backgroundColor: directionColor,
        }}
      />

      <View style={{ padding: 14, paddingLeft: 16 }}>
        {/* Row 1: Symbol + Direction pill */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 8,
          }}
        >
          <View
            style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1 }}
          >
            <PulseDot color={directionColor} size={7} active={isActive} />
            <View style={{ flex: 1 }}>
              <Text
                style={{ color: colors.textPrimary, fontSize: 16, fontWeight: "800" }}
              >
                {signal.symbol}{" "}
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "500",
                    color: colors.textSecondary,
                  }}
                >
                  {signal.timeframe}
                </Text>
              </Text>
              <Text
                style={{ color: colors.textSecondary, fontSize: 11, marginTop: 1 }}
              >
                {pairName}
              </Text>
            </View>
          </View>

          {/* Direction pill */}
          <View
            style={{
              paddingVertical: 5,
              paddingHorizontal: 14,
              borderRadius: radius.full,
              backgroundColor: `${directionColor}20`,
              borderWidth: 1.5,
              borderColor: directionColor,
            }}
          >
            <Text
              style={{
                color: directionColor,
                fontSize: 13,
                fontWeight: "800",
                letterSpacing: 0.5,
              }}
            >
              {signal.direction}
            </Text>
          </View>
        </View>

        {/* Row 2: Price levels or locked */}
        {canViewDetail ? (
          <View
            style={{ flexDirection: "row", gap: 16, marginBottom: 10 }}
          >
            <View>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 10,
                  fontWeight: "600",
                }}
              >
                ENTRY
              </Text>
              <Text
                style={{
                  color: colors.textPrimary,
                  fontSize: 13,
                  fontWeight: "700",
                }}
              >
                {Number(signal.entry_price).toLocaleString("id-ID")}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 10,
                  fontWeight: "600",
                }}
              >
                SL
              </Text>
              <Text
                style={{ color: colors.red, fontSize: 13, fontWeight: "700" }}
              >
                {Number(signal.sl).toLocaleString("id-ID")}
              </Text>
            </View>
            {signal.tp1 && (
              <View>
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: 10,
                    fontWeight: "600",
                  }}
                >
                  TP1
                </Text>
                <Text
                  style={{
                    color: colors.green,
                    fontSize: 13,
                    fontWeight: "700",
                  }}
                >
                  {Number(signal.tp1).toLocaleString("id-ID")}
                </Text>
              </View>
            )}
          </View>
        ) : (
          <TouchableOpacity
            style={{
              backgroundColor: `${colors.primary}15`,
              borderRadius: radius.sm,
              padding: 10,
              marginBottom: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              borderWidth: 1,
              borderColor: `${colors.primary}30`,
            }}
            onPress={() => router.push("/upgrade")}
          >
            <Text style={{ fontSize: 14 }}>🔒</Text>
            <Text
              style={{ color: colors.textSecondary, fontSize: 12, flex: 1 }}
            >
              Upgrade untuk lihat Entry, SL & TP
            </Text>
            <Text
              style={{ color: colors.primary, fontSize: 12, fontWeight: "700" }}
            >
              Upgrade →
            </Text>
          </TouchableOpacity>
        )}

        {/* Row 3: R/R badge + time + status */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text style={{ color: colors.textSecondary, fontSize: 11 }}>
              ⏱ {formattedTime}
            </Text>
            {rrValue !== null && canViewDetail && (
              <View
                style={{
                  backgroundColor: `${rrColor}20`,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 4,
                }}
              >
                <Text
                  style={{ color: rrColor, fontSize: 10, fontWeight: "700" }}
                >
                  R/R {rrValue.toFixed(2)}
                  {rrValue >= 1.5 ? " ✦" : ""}
                </Text>
              </View>
            )}
          </View>
          <Text
            style={{
              color: isActive
                ? colors.green
                : signal.status === "sl_hit"
                ? colors.red
                : signal.status === "tp_hit"
                ? colors.green
                : colors.textSecondary,
              fontSize: 11,
              fontWeight: "600",
            }}
          >
            {statusLabel}
          </Text>
        </View>
      </View>
    </AnimatedTouchable>
  );
}
