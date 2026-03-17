import { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  FadeInDown,
  FadeInUp,
  Easing,
  interpolate,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import { colors, radius } from "../src/theme";

const { width } = Dimensions.get("window");

async function finishOnboarding() {
  await SecureStore.setItemAsync("onboarding_done", "true");
}

// ── Screen 1: Hook with animated mock signal card ──────────────────────────
function Screen1({ onNext, onLogin }: { onNext: () => void; onLogin: () => void }) {
  const insets = useSafeAreaInsets();
  const cardY = useSharedValue(60);
  const cardOpacity = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    cardY.value = withDelay(300, withSpring(0, { damping: 14, stiffness: 80 }));
    cardOpacity.value = withDelay(300, withTiming(1, { duration: 500 }));
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.35, { duration: 700, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 700, easing: Easing.in(Easing.quad) })
      ),
      -1
    );
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cardY.value }],
    opacity: cardOpacity.value,
  }));

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: interpolate(pulseScale.value, [1, 1.35], [0.8, 0]),
  }));

  return (
    <View style={{ width, flex: 1, paddingTop: insets.top + 20, paddingHorizontal: 24 }}>
      {/* Logo area */}
      <Animated.View entering={FadeInDown.delay(0).springify()} style={{ alignItems: "center", marginBottom: 32 }}>
        <LinearGradient
          colors={[colors.primary, colors.green]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
          }}
        >
          <Ionicons name="trending-up" size={28} color="#fff" />
        </LinearGradient>
        <Text style={{ color: colors.textPrimary, fontSize: 28, fontWeight: "800", textAlign: "center" }}>
          TradeGenZ
        </Text>
        <Text style={{ color: colors.textSecondary, fontSize: 14, marginTop: 4, textAlign: "center" }}>
          Sinyal Forex Real-Time dari Expert Advisor
        </Text>
      </Animated.View>

      {/* Mock Signal Card */}
      <Animated.View style={[cardStyle, { marginBottom: 32 }]}>
        <LinearGradient
          colors={[`${colors.green}15`, `${colors.surface}`]}
          style={{
            borderRadius: radius.xl,
            padding: 20,
            borderWidth: 1.5,
            borderColor: `${colors.green}40`,
          }}
        >
          {/* Header */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              {/* Pulse dot */}
              <View style={{ width: 12, height: 12, alignItems: "center", justifyContent: "center" }}>
                <Animated.View
                  style={[
                    dotStyle,
                    {
                      position: "absolute",
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: colors.green,
                    },
                  ]}
                />
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.green }} />
              </View>
              <View>
                <Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: "800" }}>XAUUSD</Text>
                <Text style={{ color: colors.textSecondary, fontSize: 11 }}>Gold vs US Dollar · H4</Text>
              </View>
            </View>
            <View style={{ backgroundColor: `${colors.green}25`, paddingHorizontal: 12, paddingVertical: 5, borderRadius: radius.full, borderWidth: 1, borderColor: `${colors.green}50` }}>
              <Text style={{ color: colors.green, fontSize: 13, fontWeight: "800" }}>BUY</Text>
            </View>
          </View>

          {/* Prices */}
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            {[
              { label: "ENTRY", value: "2,341.50", color: colors.textPrimary },
              { label: "SL", value: "2,320.00", color: colors.red },
              { label: "TP1", value: "2,365.00", color: colors.green },
            ].map((p) => (
              <View key={p.label} style={{ alignItems: "center" }}>
                <Text style={{ color: colors.textSecondary, fontSize: 9, fontWeight: "700", letterSpacing: 0.5 }}>{p.label}</Text>
                <Text style={{ color: p.color, fontSize: 14, fontWeight: "800", marginTop: 2 }}>{p.value}</Text>
              </View>
            ))}
          </View>

          {/* R/R bar */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12 }}>
            <View style={{ flex: 1, height: 4, backgroundColor: colors.border, borderRadius: 2, overflow: "hidden" }}>
              <View style={{ width: "65%", height: 4, backgroundColor: colors.green, borderRadius: 2 }} />
            </View>
            <Text style={{ color: colors.gold, fontSize: 11, fontWeight: "700" }}>R/R 1:1.8 ✦</Text>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* CTAs */}
      <Animated.View entering={FadeInUp.delay(500).springify()} style={{ gap: 12 }}>
        <TouchableOpacity
          onPress={onNext}
          activeOpacity={0.85}
          style={{
            backgroundColor: colors.primary,
            paddingVertical: 16,
            borderRadius: radius.md,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 15, fontWeight: "700" }}>Mulai Gratis</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onLogin} activeOpacity={0.7} style={{ paddingVertical: 12, alignItems: "center" }}>
          <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
            Sudah punya akun?{" "}
            <Text style={{ color: colors.primary, fontWeight: "700" }}>Login</Text>
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

// ── Screen 2: Social Proof — animated win rate bars ──────────────────────
function BarItem({ label, pct, delay, color }: { label: string; pct: number; delay: number; color: string }) {
  const barW = useSharedValue(0);

  useEffect(() => {
    barW.value = withDelay(delay, withSpring(pct, { damping: 14, stiffness: 70 }));
  }, []);

  const barStyle = useAnimatedStyle(() => ({ width: `${barW.value}%` }));

  return (
    <View style={{ marginBottom: 14 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
        <Text style={{ color: colors.textPrimary, fontSize: 13, fontWeight: "600" }}>{label}</Text>
        <Text style={{ color: color, fontSize: 13, fontWeight: "800" }}>{pct}%</Text>
      </View>
      <View style={{ height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: "hidden" }}>
        <Animated.View style={[barStyle, { height: 6, backgroundColor: color, borderRadius: 3 }]} />
      </View>
    </View>
  );
}

function Screen2() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ width, flex: 1, paddingTop: insets.top + 32, paddingHorizontal: 24, justifyContent: "center" }}>
      <Animated.View entering={FadeInDown.delay(0).springify()} style={{ marginBottom: 8 }}>
        <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: "700", letterSpacing: 1, marginBottom: 8 }}>
          TRACK RECORD TRANSPARAN
        </Text>
        <Text style={{ color: colors.textPrimary, fontSize: 26, fontWeight: "800", lineHeight: 32 }}>
          Dibuktikan.{"\n"}
          <Text style={{ color: colors.green }}>Bukan Diklaim.</Text>
        </Text>
      </Animated.View>

      {/* Bar chart */}
      <Animated.View
        entering={FadeInDown.delay(100).springify()}
        style={{
          backgroundColor: colors.surface,
          borderRadius: radius.xl,
          padding: 20,
          borderWidth: 1,
          borderColor: colors.border,
          marginVertical: 24,
        }}
      >
        <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: "700", letterSpacing: 0.5, marginBottom: 16 }}>
          WIN RATE PER PAIR
        </Text>
        <BarItem label="XAUUSD" pct={85} delay={100} color={colors.green} />
        <BarItem label="EURUSD" pct={74} delay={200} color={colors.primary} />
        <BarItem label="GBPUSD" pct={62} delay={300} color={colors.gold} />
        <BarItem label="USDJPY" pct={50} delay={400} color={colors.textSecondary} />
      </Animated.View>

      {/* Stats bullets */}
      <Animated.View entering={FadeInDown.delay(200).springify()} style={{ gap: 12 }}>
        {[
          { icon: "people", value: "247+", label: "trader aktif bulan ini", color: colors.primary },
          { icon: "pulse", value: "1,200+", label: "sinyal dieksekusi sepanjang waktu", color: colors.green },
          { icon: "shield-checkmark", value: "78%", label: "win rate rata-rata 6 bulan terakhir", color: colors.gold },
        ].map((item) => (
          <View key={item.label} style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: `${item.color}20`,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name={item.icon as any} size={18} color={item.color} />
            </View>
            <View>
              <Text style={{ color: colors.textPrimary, fontSize: 15, fontWeight: "700" }}>{item.value}</Text>
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{item.label}</Text>
            </View>
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

// ── Screen 3: Feature Demo — push notification animation ─────────────────
function Screen3() {
  const insets = useSafeAreaInsets();
  const notifY = useSharedValue(-80);
  const notifOpacity = useSharedValue(0);

  useEffect(() => {
    notifY.value = withDelay(400, withSpring(0, { damping: 16, stiffness: 100 }));
    notifOpacity.value = withDelay(400, withTiming(1, { duration: 300 }));

    // Repeat push in loop with delay
    const timeout = setTimeout(() => {
      notifY.value = withRepeat(
        withSequence(
          withTiming(-80, { duration: 200 }),
          withDelay(200, withSpring(0, { damping: 16, stiffness: 100 }))
        ),
        -1,
        false
      );
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  const notifStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: notifY.value }],
    opacity: notifOpacity.value,
  }));

  return (
    <View style={{ width, flex: 1, paddingTop: insets.top + 32, paddingHorizontal: 24, justifyContent: "center" }}>
      {/* Notification demo */}
      <View style={{ height: 100, overflow: "hidden", marginBottom: 32 }}>
        <Animated.View
          style={[
            notifStyle,
            {
              backgroundColor: colors.surface,
              borderRadius: radius.lg,
              padding: 14,
              borderWidth: 1,
              borderColor: `${colors.primary}50`,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 10,
              elevation: 6,
            },
          ]}
        >
          <LinearGradient
            colors={[colors.primary, colors.green]}
            style={{ width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" }}
          >
            <Ionicons name="trending-up" size={20} color="#fff" />
          </LinearGradient>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.textPrimary, fontSize: 13, fontWeight: "700" }}>
              🔔 Sinyal Baru — XAUUSD BUY
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 11, marginTop: 2 }}>
              Entry: 2,341.50 · TP: 2,365.00 · SL: 2,320.00
            </Text>
          </View>
          <Text style={{ color: colors.textSecondary, fontSize: 10 }}>baru saja</Text>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInDown.delay(0).springify()} style={{ marginBottom: 20 }}>
        <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: "700", letterSpacing: 1, marginBottom: 8 }}>
          NOTIFIKASI INSTAN
        </Text>
        <Text style={{ color: colors.textPrimary, fontSize: 26, fontWeight: "800", lineHeight: 32 }}>
          Jangan Lewat{"\n"}
          <Text style={{ color: colors.primary }}>Satu Pun Signal.</Text>
        </Text>
        <Text style={{ color: colors.textSecondary, fontSize: 14, marginTop: 10, lineHeight: 22 }}>
          Push notification dikirim langsung saat sinyal baru masuk — kapanpun, di manapun.
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(100).springify()} style={{ gap: 10 }}>
        {[
          { icon: "flash-outline", text: "Notifikasi < 1 detik setelah sinyal dibuat" },
          { icon: "moon-outline", text: "Tidak akan terlewat bahkan saat layar mati" },
          { icon: "phone-portrait-outline", text: "Tersedia untuk Android & iOS" },
        ].map((item) => (
          <View key={item.text} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Ionicons name={item.icon as any} size={16} color={colors.primary} />
            <Text style={{ color: colors.textSecondary, fontSize: 13, flex: 1 }}>{item.text}</Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

// ── Screen 4: Final CTA ────────────────────────────────────────────────────
function Screen4({ onRegister, onLogin }: { onRegister: () => void; onLogin: () => void }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ width, flex: 1, paddingTop: insets.top + 32, paddingHorizontal: 24, justifyContent: "center" }}>
      <Animated.View entering={FadeInDown.delay(0).springify()} style={{ alignItems: "center", marginBottom: 32 }}>
        <LinearGradient
          colors={[`${colors.primary}30`, `${colors.green}20`]}
          style={{
            width: 80,
            height: 80,
            borderRadius: 24,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
            borderWidth: 1,
            borderColor: `${colors.primary}40`,
          }}
        >
          <Ionicons name="rocket-outline" size={36} color={colors.primary} />
        </LinearGradient>

        <Text style={{ color: colors.textPrimary, fontSize: 28, fontWeight: "800", textAlign: "center", lineHeight: 34 }}>
          Mulai Gratis.{"\n"}
          <Text style={{ color: colors.green }}>Upgrade Kapan Saja.</Text>
        </Text>
        <Text style={{ color: colors.textSecondary, fontSize: 14, textAlign: "center", marginTop: 10, lineHeight: 22 }}>
          Daftar sekarang dan akses 10 sinyal terakhir secara gratis. Upgrade ke Premium untuk akses penuh.
        </Text>
      </Animated.View>

      {/* Feature check list */}
      <Animated.View entering={FadeInDown.delay(100).springify()} style={{ marginBottom: 32, gap: 8 }}>
        {[
          { text: "Gratis tanpa kartu kredit", color: colors.green },
          { text: "Sinyal dari Expert Advisor profesional", color: colors.green },
          { text: "Upgrade atau cancel kapan saja", color: colors.green },
        ].map((item) => (
          <View key={item.text} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Ionicons name="checkmark-circle" size={18} color={item.color} />
            <Text style={{ color: colors.textPrimary, fontSize: 13 }}>{item.text}</Text>
          </View>
        ))}
      </Animated.View>

      {/* Buttons */}
      <Animated.View entering={FadeInUp.delay(200).springify()} style={{ gap: 12 }}>
        <TouchableOpacity
          onPress={onRegister}
          activeOpacity={0.85}
          style={{
            backgroundColor: colors.primary,
            paddingVertical: 16,
            borderRadius: radius.md,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 15, fontWeight: "700" }}>Daftar Sekarang — Gratis</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onLogin}
          activeOpacity={0.7}
          style={{
            paddingVertical: 14,
            borderRadius: radius.md,
            alignItems: "center",
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Text style={{ color: colors.textSecondary, fontSize: 14, fontWeight: "600" }}>Sudah Punya Akun? Login</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

// ── Main Onboarding ────────────────────────────────────────────────────────
const SCREEN_COUNT = 4;

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((e) => {
    scrollX.value = e.contentOffset.x;
  });

  function goToScreen(index: number) {
    scrollRef.current?.scrollTo({ x: index * width, animated: true });
    setCurrentIndex(index);
  }

  async function handleRegister() {
    await finishOnboarding();
    router.replace("/register");
  }

  async function handleLogin() {
    await finishOnboarding();
    router.replace("/login");
  }

  async function handleSkip() {
    await finishOnboarding();
    router.replace("/login");
  }

  function handleNext() {
    if (currentIndex < SCREEN_COUNT - 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      goToScreen(currentIndex + 1);
    }
  }

  return (
    <LinearGradient colors={[colors.surface, colors.background]} style={{ flex: 1 }}>
      {/* Skip button */}
      {currentIndex < SCREEN_COUNT - 1 && (
        <Animated.View
          entering={FadeInDown.delay(600).springify()}
          style={{
            position: "absolute",
            top: insets.top + 16,
            right: 20,
            zIndex: 10,
          }}
        >
          <TouchableOpacity onPress={handleSkip} activeOpacity={0.7} style={{ padding: 8 }}>
            <Text style={{ color: colors.textSecondary, fontSize: 14, fontWeight: "600" }}>Lewati</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Screens */}
      <Animated.ScrollView
        ref={scrollRef as any}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        style={{ flex: 1 }}
      >
        <Screen1 onNext={handleNext} onLogin={handleLogin} />
        <Screen2 />
        <Screen3 />
        <Screen4 onRegister={handleRegister} onLogin={handleLogin} />
      </Animated.ScrollView>

      {/* Dot indicators + Next button (only for screens 2 & 3) */}
      {currentIndex > 0 && currentIndex < SCREEN_COUNT - 1 && (
        <View
          style={{
            paddingHorizontal: 24,
            paddingBottom: insets.bottom + 24,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Dots */}
          <View style={{ flexDirection: "row", gap: 6 }}>
            {Array.from({ length: SCREEN_COUNT }).map((_, i) => (
              <View
                key={i}
                style={{
                  height: 6,
                  width: i === currentIndex ? 20 : 6,
                  borderRadius: 3,
                  backgroundColor: i === currentIndex ? colors.primary : colors.border,
                }}
              />
            ))}
          </View>

          {/* Next button */}
          <TouchableOpacity
            onPress={handleNext}
            activeOpacity={0.8}
            style={{
              backgroundColor: colors.primary,
              width: 48,
              height: 48,
              borderRadius: 24,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {/* Dots only for screen 0 (buttons already inline) */}
      {currentIndex === 0 && (
        <View
          style={{
            paddingBottom: insets.bottom + 12,
            flexDirection: "row",
            justifyContent: "center",
            gap: 6,
          }}
        >
          {Array.from({ length: SCREEN_COUNT }).map((_, i) => (
            <View
              key={i}
              style={{
                height: 6,
                width: i === currentIndex ? 20 : 6,
                borderRadius: 3,
                backgroundColor: i === currentIndex ? colors.primary : colors.border,
              }}
            />
          ))}
        </View>
      )}
    </LinearGradient>
  );
}
