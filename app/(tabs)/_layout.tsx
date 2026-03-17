import { View } from "react-native";
import { Tabs } from "expo-router";
import { colors } from "../../src/theme";
import { useFCM } from "../../src/hooks/useFCM";
import { useNetworkStatus } from "../../src/hooks/useNetworkStatus";
import TabBar from "../../src/components/TabBar";
import OfflineBanner from "../../src/components/OfflineBanner";

export default function TabLayout() {
  useFCM();
  const isConnected = useNetworkStatus();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {!isConnected && <OfflineBanner />}
      <Tabs
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="history" />
        <Tabs.Screen name="analytics" />
        <Tabs.Screen name="profile" />
      </Tabs>
    </View>
  );
}
