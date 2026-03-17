import { useEffect, useRef } from "react";
import { View, Text, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from "react-native-reanimated";
import { colors, radius } from "../../src/theme";

// Mock data — replace with real API data when backend analytics endpoint is ready
// GET /analytics/summary → { win_rate, total, wins, by_symbol[], monthly[] }
const MOCK_SUMMARY = {
  win_rate: 78,
  total: 28,
  wins: 22,
};

const MOCK_BY_SYMBOL = [
  { symbol: "XAUUSD", name: "Gold", win_rate: 85, total: 12, trend: "up" as const },
  { symbol: "EURUSD", name: "Euro", win_rate: 74, total: 9, trend: "up" as const },
  { symbol: "GBPUSD", name: "Pound", win_rate: 62, total: 4, trend: "neutral" as const },
  { symbol: "USDJPY", name: "Yen", win_rate: 50, total: 3, trend: "down" as const },
];

const MOCK_MONTHLY = [
  { month: "Okt", win_rate: 65 },
  { month: "Nov", win_rate: 70 },
  { month: "Des", win_rate: 72 },
  { month: "Jan", win_rate: 68 },
  { month: "Feb", win_rate: 75 },
  { month: "Mar", win_rate: 78 },
];

// Count-up animated number
function AnimatedNumber({ value, suffix = "%", fontSize = 48, color = colors.textPrimary }: {
  value: number; suffix?: string; fontSize?: number; color?: string;
}) {
  const animVal = useSharedValue(0);
  const displayVal = useSharedValue(0);

  useEffect(() => {
    animVal.value = withTiming(value, { duration: 1000, easing: Easing.out(Easing.quad) });
  }, []);

  // We use a simple approach: animate opacity + translate for the number display
  const style = useAnimatedStyle(() => ({
    opacity: 1,
  }));

  // Since we can't easily animate text content in Reanimated, we use a workaround
  // with multiple Text components fading in at different times
  const steps = Array.from({ length: 5 }, (_, i) => Math.round((value / 5) * (i + 1)));

  return (
    <View style={{ position: "relative" }}>
      {steps.map((step, i) => (
        <Animated.Text
          key={i}
          entering={undefined}
          style={[
            useAnimatedStyle(() => ({
              position: i < steps.length - 1 ? "absolute" : "relative",
              opacity: withDelay(i * 180, withTiming(i === steps.length - 1 ? 1 : 0, { duration: 200 })),
            })),
            { color, fontSize, fontWeight: "800" as const },
          ]}
        >
          {step}{suffix}
        </Animated.Text>
      ))}
    </View>
  );
}

// Horizontal bar for per-symbol breakdown
function SymbolBar({ item, index }: { item: typeof MOCK_BY_SYMBOL[0]; index: number }) {
  const barWidth = useSharedValue(0);

  useEffect(() => {
    barWidth.value = withDelay(
      index * 150,
      withSpring(item.win_rate, { damping: 14, stiffness: 80 })
    );
  }, []);

  const barStyle = useAnimatedStyle(() => ({
    width: `${barWidth.value}%`,
  }));

  const rateColor = item.win_rate >= 70 ? colors.green : item.win_rate >= 55 ? colors.gold : colors.red;
  const trendIcon = item.trend === "up" ? "↑" : item.trend === "down" ? "↓" : "→";
  const trendColor = item.trend === "up" ? colors.green : item.trend === "down" ? colors.red : colors.textSecondary;

  return (
    <Animated.View
      entering={undefined}
      style={{ marginBottom: 14 }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text style={{ color: colors.textPrimary, fontSize: 14, fontWeight: "700", width: 60 }}>
            {item.symbol}
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{item.total} signal</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Text style={{ color: trendColor, fontSize: 12, fontWeight: "700" }}>{trendIcon}</Text>
          <Text style={{ color: rateColor, fontSize: 14, fontWeight: "800" }}>{item.win_rate}%</Text>
        </View>
      </View>
      <View style={{ height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: "hidden" }}>
        <Animated.View
          style={[
            barStyle,
            { height: 6, backgroundColor: rateColor, borderRadius: 3 },
          ]}
        />
      </View>
    </Animated.View>
  );
}

// Simple line chart using Views
function LineChart({ data }: { data: typeof MOCK_MONTHLY }) {
  const maxVal = Math.max(...data.map((d) => d.win_rate));
  const minVal = Math.min(...data.map((d) => d.win_rate)) - 10;
  const range = maxVal - minVal || 1;
  const chartHeight = 80;
  const pointCount = data.length;

  return (
    <View style={{ height: chartHeight + 30, paddingTop: 10 }}>
      {/* Y axis labels */}
      <View style={{ position: "absolute", left: 0, top: 0, bottom: 20, justifyContent: "space-between" }}>
        <Text style={{ color: colors.textSecondary, fontSize: 9 }}>100%</Text>
        <Text style={{ color: colors.textSecondary, fontSize: 9 }}>50%</Text>
      </View>

      {/* Chart area */}
      <View style={{ flex: 1, marginLeft: 28, marginBottom: 0 }}>
        {/* Grid lines */}
        {[0, 0.5, 1].map((pct, i) => (
          <View key={i} style={{
            position: "absolute",
            left: 0, right: 0,
            top: pct * chartHeight,
            height: 1,
            backgroundColor: `${colors.border}60`,
          }} />
        ))}

        {/* Data points + connecting lines (simplified) */}
        {data.map((d, i) => {
          const x = (i / (pointCount - 1)) * 100;
          const y = ((maxVal - d.win_rate) / range) * chartHeight;
          const dotColor = i === pointCount - 1 ? colors.green : colors.primary;

          return (
            <Animated.View
              key={i}
              entering={undefined}
              style={[
                useAnimatedStyle(() => ({
                  opacity: withDelay(i * 100, withTiming(1, { duration: 300 })),
                  transform: [{ scale: withDelay(i * 100, withSpring(1, { damping: 8 })) }],
                })),
                {
                  position: "absolute",
                  left: `${x}%` as any,
                  top: y,
                  transform: [{ translateX: -4 }, { translateY: -4 }],
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: dotColor,
                  borderWidth: 2,
                  borderColor: colors.background,
                },
              ]}
            />
          );
        })}

        {/* X axis labels */}
        <View style={{ position: "absolute", bottom: -24, left: 0, right: 0, flexDirection: "row", justifyContent: "space-between" }}>
          {data.map((d, i) => (
            <Text key={i} style={{ color: colors.textSecondary, fontSize: 9, textAlign: "center" }}>
              {d.month}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

export default function AnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const winRateOpacity = useSharedValue(0);
  const winRateScale = useSharedValue(0.7);

  useEffect(() => {
    winRateOpacity.value = withTiming(1, { duration: 600 });
    winRateScale.value = withSpring(1, { damping: 12 });
  }, []);

  const heroStyle = useAnimatedStyle(() => ({
    opacity: winRateOpacity.value,
    transform: [{ scale: winRateScale.value }],
  }));

  return (
    <LinearGradient colors={[colors.surface, colors.background]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 16, marginBottom: 20 }}>
          <Text style={{ color: colors.textPrimary, fontSize: 24, fontWeight: "800" }}>Performa Signal</Text>
          <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 4 }}>
            {new Date().toLocaleString("id-ID", { month: "long", year: "numeric" })}
          </Text>
        </View>

        {/* Win Rate Hero */}
        <Animated.View style={[heroStyle, { marginHorizontal: 16, marginBottom: 12 }]}>
          <LinearGradient
            colors={[`${colors.green}20`, `${colors.primary}10`]}
            style={{
              borderRadius: radius.xl,
              padding: 24,
              borderWidth: 1,
              borderColor: `${colors.green}30`,
              alignItems: "center",
            }}
          >
            <Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: "700", letterSpacing: 1, marginBottom: 8 }}>
              WIN RATE BULAN INI
            </Text>
            <AnimatedNumber value={MOCK_SUMMARY.win_rate} fontSize={56} color={colors.green} />
            <View style={{ flexDirection: "row", gap: 24, marginTop: 16 }}>
              <View style={{ alignItems: "center" }}>
                <Text style={{ color: colors.textPrimary, fontSize: 20, fontWeight: "800" }}>{MOCK_SUMMARY.wins}</Text>
                <Text style={{ color: colors.green, fontSize: 11, fontWeight: "600" }}>WIN</Text>
              </View>
              <View style={{ width: 1, backgroundColor: colors.border }} />
              <View style={{ alignItems: "center" }}>
                <Text style={{ color: colors.textPrimary, fontSize: 20, fontWeight: "800" }}>{MOCK_SUMMARY.total - MOCK_SUMMARY.wins}</Text>
                <Text style={{ color: colors.red, fontSize: 11, fontWeight: "600" }}>LOSS</Text>
              </View>
              <View style={{ width: 1, backgroundColor: colors.border }} />
              <View style={{ alignItems: "center" }}>
                <Text style={{ color: colors.textPrimary, fontSize: 20, fontWeight: "800" }}>{MOCK_SUMMARY.total}</Text>
                <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: "600" }}>TOTAL</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Per Symbol Breakdown */}
        <View style={{
          marginHorizontal: 16, marginBottom: 12,
          backgroundColor: colors.surface,
          borderRadius: radius.lg, padding: 16,
          borderWidth: 1, borderColor: colors.border,
        }}>
          <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: "700", letterSpacing: 1, marginBottom: 16 }}>
            PER PAIR
          </Text>
          {MOCK_BY_SYMBOL.map((item, i) => (
            <SymbolBar key={item.symbol} item={item} index={i} />
          ))}
        </View>

        {/* Monthly Trend */}
        <View style={{
          marginHorizontal: 16, marginBottom: 12,
          backgroundColor: colors.surface,
          borderRadius: radius.lg, padding: 16,
          borderWidth: 1, borderColor: colors.border,
        }}>
          <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: "700", letterSpacing: 1, marginBottom: 16 }}>
            TREND 6 BULAN
          </Text>
          <LineChart data={MOCK_MONTHLY} />
        </View>

        {/* Best Timeframe */}
        <View style={{
          marginHorizontal: 16,
          backgroundColor: colors.surface,
          borderRadius: radius.lg, padding: 16,
          borderWidth: 1, borderColor: colors.border,
        }}>
          <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: "700", letterSpacing: 1, marginBottom: 12 }}>
            BEST TIMEFRAME
          </Text>
          {[
            { tf: "H4", rate: 82, label: "4 Hour" },
            { tf: "H1", rate: 74, label: "1 Hour" },
            { tf: "D1", rate: 70, label: "Daily" },
          ].map((item, i) => (
            <View key={item.tf} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: i < 2 ? 1 : 0, borderBottomColor: colors.border }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <View style={{ backgroundColor: `${colors.primary}20`, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.sm }}>
                  <Text style={{ color: colors.primary, fontSize: 13, fontWeight: "800" }}>{item.tf}</Text>
                </View>
                <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{item.label}</Text>
              </View>
              <Text style={{ color: item.rate >= 75 ? colors.green : colors.gold, fontSize: 15, fontWeight: "800" }}>
                {item.rate}%
              </Text>
            </View>
          ))}
        </View>

        {/* Data note */}
        <Text style={{ color: colors.textSecondary, fontSize: 11, textAlign: "center", marginTop: 16, paddingHorizontal: 32 }}>
          * Data berdasarkan sinyal yang telah closed
        </Text>
      </ScrollView>
    </LinearGradient>
  );
}
