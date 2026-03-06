import { useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
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
    setActiveIndex(Math.round(e.nativeEvent.contentOffset.x / width));
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
    <View className="flex-1 bg-background pb-10">
      {!isLast && (
        <TouchableOpacity
          className="absolute top-12 right-6 z-10"
          onPress={handleFinish}
        >
          <Text className="text-text-secondary text-sm">Lewati</Text>
        </TouchableOpacity>
      )}

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
          <View
            style={{ width }}
            className="flex-1 justify-center items-center px-10 pt-20"
          >
            <View
              className="w-[140px] h-[140px] rounded-full border-2 justify-center items-center mb-10 bg-surface"
              style={{ borderColor: item.iconColor }}
            >
              <Ionicons name={item.icon} size={64} color={item.iconColor} />
            </View>
            <Text className="text-2xl font-bold text-text-primary text-center mb-4">
              {item.title}
            </Text>
            <Text className="text-[15px] leading-6 text-text-secondary text-center">
              {item.description}
            </Text>
          </View>
        )}
      />

      <View className="flex-row justify-center gap-2 mb-8">
        {slides.map((_, i) => (
          <View
            key={i}
            className={`h-2 rounded-full ${i === activeIndex ? "w-6 bg-green" : "w-2 bg-bdr"}`}
          />
        ))}
      </View>

      <TouchableOpacity
        className={`mx-6 p-4 rounded-lg items-center ${isLast ? "bg-green" : "bg-primary"}`}
        onPress={handleNext}
      >
        {isLast ? (
          <Text className="text-white text-base font-semibold">
            Mulai Sekarang
          </Text>
        ) : (
          <View className="flex-row items-center gap-2">
            <Text className="text-white text-base font-semibold">Lanjut</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}
