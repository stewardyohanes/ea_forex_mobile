import { useEffect } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, radius } from "../theme";

const { width } = Dimensions.get("window");

const TABS = [
  { name: "index",     label: "Sinyal",    icon: "trending-up" as const,     iconActive: "trending-up" as const },
  { name: "history",   label: "Riwayat",   icon: "time-outline" as const,    iconActive: "time" as const },
  { name: "analytics", label: "Analitik",  icon: "bar-chart-outline" as const, iconActive: "bar-chart" as const },
  { name: "profile",   label: "Profil",    icon: "person-outline" as const,  iconActive: "person" as const },
];

export default function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const tabWidth = (width - 32) / TABS.length;
  const indicatorX = useSharedValue(state.index * tabWidth);

  useEffect(() => {
    indicatorX.value = withSpring(state.index * tabWidth, { damping: 18, stiffness: 160 });
  }, [state.index, tabWidth]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingBottom: insets.bottom + 4,
        paddingTop: 8,
        paddingHorizontal: 16,
      }}
    >
      {/* Sliding indicator */}
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            left: 16,
            width: tabWidth,
            height: 2,
            borderRadius: 1,
            backgroundColor: colors.primary,
          },
          indicatorStyle,
        ]}
      />

      <View style={{ flexDirection: "row" }}>
        {TABS.map((tab, index) => {
          const route = state.routes[index];
          if (!route) return null;

          const isFocused = state.index === index;
          const color = isFocused ? colors.primary : colors.textSecondary;
          const iconScale = useSharedValue(1);

          const tabStyle = useAnimatedStyle(() => ({
            transform: [{ scale: iconScale.value }],
          }));

          async function onPress() {
            iconScale.value = withSpring(0.85, { damping: 10 });
            setTimeout(() => { iconScale.value = withSpring(1, { damping: 10 }); }, 120);
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

            const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          }

          return (
            <TouchableOpacity
              key={tab.name}
              style={{ flex: 1, alignItems: "center", gap: 3 }}
              onPress={onPress}
              activeOpacity={0.7}
            >
              <Animated.View style={tabStyle}>
                <Ionicons
                  name={isFocused ? tab.iconActive : tab.icon}
                  size={22}
                  color={color}
                />
              </Animated.View>
              <Text style={{ color, fontSize: 10, fontWeight: isFocused ? "700" : "500" }}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
