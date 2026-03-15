import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../src/theme";
import { useFCM } from "../../src/hooks/useFCM";

function TabHeader({ title }: { title: string }) {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.appName}>TradeGenz</Text>
      <Text style={styles.pageTitle}>{title}</Text>
    </View>
  );
}

export default function TabLayout() {
  useFCM();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerShadowVisible: false,
        headerTintColor: colors.textPrimary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: () => <TabHeader title="Sinyal Terbaru" />,
          tabBarLabel: "Sinyal",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trending-up" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          headerTitle: () => <TabHeader title="Riwayat" />,
          tabBarLabel: "Riwayat",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerTitle: () => <TabHeader title="Profil" />,
          tabBarLabel: "Profil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "flex-start",
  },
  appName: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.primary,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
  },
});
