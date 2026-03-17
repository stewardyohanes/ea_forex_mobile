import { useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
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
import { getAnalyticsSummary, AnalyticsSummary } from "../../src/api/analytics";

// Count-up animated number
function AnimatedNumber({ value, suffix = "%", fontSize = 48, color = colors.textPrimary }: {
  value: number; suffix?: string; fontSize?: number; color?: string;
}) {
  const steps = Array.from({ length: 5 }, (_, i) => Math.round((value / 5) * (i + 1)));

  return (
    <View style={{ position: "relative" }}>
      {steps.map((step, i) => (
        <Animated.Text
          key={i}
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
function SymbolBar({ item, index }: { item: AnalyticsSummary["by_symbol"][0]; index: number }) {
  const barWidth = useSharedValue(0);

  useEffect(() => {
    barWidth.value = withDelay(
      index * 150,
      withSpring(item.win_rate, { damping: 14, stiffness: 80 })
    );
  }, [item.win_rate]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${barWidth.value}%`,
  }));

  const rateColor = item.win_rate >= 70 ? colors.green : item.win_rate >= 55 ? colors.gold : colors.red;

  return (
    <View style={{ marginBottom: 14 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text style={{ color: colors.textPrimary, fontSize: 14, fontWeight: "700", width: 60 }}>
            {item.symbol}
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{item.total} signal</Text>
        </View>
        <Text style={{ color: rateColor, fontSize: 14, fontWeight: "800" }}>{Math.round(item.win_rate)}%</Text>
      </View>
      <View style={{ height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: "hidden" }}>
        <Animated.View style={[barStyle, { height: 6, backgroundColor: rateColor, borderRadius: 3 }]} />
      </View>
    </View>
  );
}

// Simple dot chart for monthly trend
function LineChart({ data }: { data: AnalyticsSummary["monthly"] }) {
  const maxVal = Math.max(...data.map((d) => d.win_rate), 100);
  const minVal = Math.min(...data.map((d) => d.win_rate), 50) - 10;
  const range = maxVal - minVal || 1;
  const chartHeight = 80;
  const pointCount = data.length;

  if (pointCount === 0) return (
    <Text style={{ color: colors.textSecondary, fontSize: 12, textAlign: "center", paddingVertical: 20 }}>
      Belum ada data trend
    </Text>
  );

  return (
    <View style={{ height: chartHeight + 30, paddingTop: 10 }}>
      <View style={{ position: "absolute", left: 0, top: 0, bottom: 20, justifyContent: "space-between" }}>
        <Text style={{ color: colors.textSecondary, fontSize: 9 }}>100%</Text>
        <Text style={{ color: colors.textSecondary, fontSize: 9 }}>50%</Text>
      </View>
      <View style={{ flex: 1, marginLeft: 28 }}>
        {[0, 0.5, 1].map((pct, i) => (
          <View key={i} style={{
            position: "absolute", left: 0, right: 0,
            top: pct * chartHeight, height: 1,
            backgroundColor: `${colors.border}60`,
          }} />
        ))}
        {data.map((d, i) => {
          const x = pointCount > 1 ? (i / (pointCount - 1)) * 100 : 50;
          const y = ((maxVal - d.win_rate) / range) * chartHeight;
          const dotColor = i === pointCount - 1 ? colors.green : colors.primary;
          return (
            <Animated.View
              key={i}
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
                  width: 8, height: 8, borderRadius: 4,
                  backgroundColor: dotColor,
                  borderWidth: 2, borderColor: colors.background,
                },
              ]}
            />
          );
        })}
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
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    winRateOpacity.value = withTiming(1, { duration: 600 });
    winRateScale.value = withSpring(1, { damping: 12 });

    getAnalyticsSummary()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const heroStyle = useAnimatedStyle(() => ({
    opacity: winRateOpacity.value,
    transform: [{ scale: winRateScale.value }],
  }));

  if (loading) {
    return (
      <LinearGradient colors={[colors.surface, colors.background]} style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color={colors.green} size="large" />
      </LinearGradient>
    );
  }

  const summary = data ?? { win_rate: 0, total: 0, wins: 0, losses: 0, by_symbol: [], monthly: [] };

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
              borderRadius: radius.xl, padding: 24,
              borderWidth: 1, borderColor: `${colors.green}30`,
              alignItems: "center",
            }}
          >
            <Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: "700", letterSpacing: 1, marginBottom: 8 }}>
              WIN RATE BULAN INI
            </Text>
            <AnimatedNumber value={Math.round(summary.win_rate)} fontSize={56} color={colors.green} />
            <View style={{ flexDirection: "row", gap: 24, marginTop: 16 }}>
              <View style={{ alignItems: "center" }}>
                <Text style={{ color: colors.textPrimary, fontSize: 20, fontWeight: "800" }}>{summary.wins}</Text>
                <Text style={{ color: colors.green, fontSize: 11, fontWeight: "600" }}>WIN</Text>
              </View>
              <View style={{ width: 1, backgroundColor: colors.border }} />
              <View style={{ alignItems: "center" }}>
                <Text style={{ color: colors.textPrimary, fontSize: 20, fontWeight: "800" }}>{summary.losses}</Text>
                <Text style={{ color: colors.red, fontSize: 11, fontWeight: "600" }}>LOSS</Text>
              </View>
              <View style={{ width: 1, backgroundColor: colors.border }} />
              <View style={{ alignItems: "center" }}>
                <Text style={{ color: colors.textPrimary, fontSize: 20, fontWeight: "800" }}>{summary.total}</Text>
                <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: "600" }}>TOTAL</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Per Symbol Breakdown */}
        {summary.by_symbol.length > 0 && (
          <View style={{
            marginHorizontal: 16, marginBottom: 12,
            backgroundColor: colors.surface, borderRadius: radius.lg, padding: 16,
            borderWidth: 1, borderColor: colors.border,
          }}>
            <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: "700", letterSpacing: 1, marginBottom: 16 }}>
              PER PAIR
            </Text>
            {summary.by_symbol.map((item, i) => (
              <SymbolBar key={item.symbol} item={item} index={i} />
            ))}
          </View>
        )}

        {/* Monthly Trend */}
        <View style={{
          marginHorizontal: 16, marginBottom: 12,
          backgroundColor: colors.surface, borderRadius: radius.lg, padding: 16,
          borderWidth: 1, borderColor: colors.border,
        }}>
          <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: "700", letterSpacing: 1, marginBottom: 16 }}>
            TREND 6 BULAN
          </Text>
          <LineChart data={summary.monthly} />
        </View>

        {/* Data note */}
        <Text style={{ color: colors.textSecondary, fontSize: 11, textAlign: "center", marginTop: 16, paddingHorizontal: 32 }}>
          * Data berdasarkan sinyal yang telah closed
        </Text>
      </ScrollView>
    </LinearGradient>
  );
}
