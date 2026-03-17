import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";

export default function OfflineBanner() {
  return (
    <View
      style={{
        backgroundColor: `${colors.red}15`,
        borderBottomWidth: 1,
        borderBottomColor: `${colors.red}30`,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 16,
      }}
    >
      <Ionicons name="cloud-offline-outline" size={14} color={colors.red} />
      <Text style={{ color: colors.red, fontSize: 12, fontWeight: "600" }}>
        Tidak ada koneksi internet
      </Text>
    </View>
  );
}
