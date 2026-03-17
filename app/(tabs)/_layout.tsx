import { Tabs } from "expo-router";
import { colors } from "../../src/theme";
import { useFCM } from "../../src/hooks/useFCM";
import TabBar from "../../src/components/TabBar";

export default function TabLayout() {
  useFCM();

  return (
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
  );
}
