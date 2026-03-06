import { useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../src/theme";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    icon: "trending-up" as const,
    iconColor: colors.green,
    title: "Sinyal Trading Real-Time",
    description:
      "Dapatkan sinyal Forex langsung dari Expert Advisor profesional. Entry, TP, dan SL sudah disiapkan untuk Anda.",
  },
  {
    id: "2",
    icon: "notifications" as const,
    iconColor: colors.primary,
    title: "Notifikasi Instan",
    description:
      "Jangan lewatkan satu pun sinyal. Push notification dikirim langsung ke perangkat Anda saat sinyal baru masuk.",
  },
  {
    id: "3",
    icon: "shield-checkmark" as const,
    iconColor: "#FF9500",
    title: "Analisis Terverifikasi",
    description:
      "Setiap sinyal dilengkapi Risk/Reward ratio dan sudah diuji. Trading lebih percaya diri dengan data yang akurat.",
  },
];

export default function OnboardingScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  function handleScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  }

  function handleNext() {
    if (activeIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
    } else {
      handleFinish();
    }
  }

  async function handleFinish() {
    await SecureStore.setItemAsync("onboarding_done", "true");
    router.replace("/login");
  }

  const isLast = activeIndex === slides.length - 1;

  return (
    <View style={styles.container}>
      {/* Skip */}
      {!isLast && (
        <TouchableOpacity style={styles.skip} onPress={handleFinish}>
          <Text style={styles.skipText}>Lewati</Text>
        </TouchableOpacity>
      )}

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View
              style={[styles.iconContainer, { borderColor: item.iconColor }]}
            >
              <Ionicons name={item.icon} size={64} color={item.iconColor} />
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />

      {/* Dots */}
      <View style={styles.dotsRow}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === activeIndex && styles.dotActive]}
          />
        ))}
      </View>

      {/* Button */}
      <TouchableOpacity
        style={[styles.button, isLast && styles.buttonLast]}
        onPress={handleNext}
      >
        {isLast ? (
          <Text style={styles.buttonText}>Mulai Sekarang</Text>
        ) : (
          <View style={styles.buttonRow}>
            <Text style={styles.buttonText}>Lanjut</Text>
            <Ionicons
              name="arrow-forward"
              size={18}
              color={isLast ? colors.background : "#fff"}
            />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingBottom: 40 },
  skip: { position: "absolute", top: 52, right: 24, zIndex: 10 },
  skipText: { color: colors.textSecondary, fontSize: 14 },
  slide: {
    width,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: 80,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    backgroundColor: colors.surface,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.textSecondary,
    textAlign: "center",
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 32,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  dotActive: { width: 24, backgroundColor: colors.green },
  button: {
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: colors.primary,
  },
  buttonLast: { backgroundColor: colors.green },
  buttonRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
