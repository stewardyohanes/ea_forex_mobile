import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function DisclaimerScreen() {
  async function handleAccept() {
    await SecureStore.setItemAsync("disclaimer_accepted", "true");
    router.replace("/(tabs)");
  }

  return (
    <View className="flex-1 p-6 bg-background">
      <Text className="text-2xl font-bold text-text-primary mb-4 mt-12">
        Disclaimer
      </Text>
      <ScrollView className="flex-1 mb-4" showsVerticalScrollIndicator={false}>
        <Text className="text-[15px] leading-6 text-text-secondary">
          Sinyal trading yang disediakan dalam aplikasi ini hanya bersifat
          informatif dan tidak merupakan saran investasi.{"\n\n"}
          Trading Forex melibatkan risiko tinggi dan tidak sesuai untuk semua
          investor. Anda bisa kehilangan sebagian atau seluruh modal yang
          diinvestasikan.{"\n\n"}
          Kinerja masa lalu tidak menjamin hasil di masa depan. Pastikan Anda
          memahami risiko yang terlibat sebelum melakukan transaksi.{"\n\n"}
          Dengan melanjutkan, Anda menyatakan bahwa Anda telah membaca,
          memahami, dan menyetujui disclaimer ini.
        </Text>
      </ScrollView>
      <TouchableOpacity
        className="bg-primary p-4 rounded-lg items-center"
        onPress={handleAccept}
      >
        <Text className="text-white text-base font-semibold">
          Saya Mengerti & Setuju
        </Text>
      </TouchableOpacity>
    </View>
  );
}
