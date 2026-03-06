import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { colors } from "../src/theme";

export default function DisclaimerScreen() {
  async function handleAccept() {
    await SecureStore.setItemAsync("disclaimer_accepted", "true");
    router.replace("/(tabs)");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Disclaimer</Text>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.body}>
          Sinyal trading yang disediakan dalam aplikasi ini hanya bersifat
          informatif dan tidak merupakan saran investasi.
          {"\n\n"}
          Trading Forex melibatkan risiko tinggi dan tidak sesuai untuk semua
          investor. Anda bisa kehilangan sebagian atau seluruh modal yang
          diinvestasikan.
          {"\n\n"}
          Kinerja masa lalu tidak menjamin hasil di masa depan. Pastikan Anda
          memahami risiko yang terlibat sebelum melakukan transaksi.
          {"\n\n"}
          Dengan melanjutkan, Anda menyatakan bahwa Anda telah membaca,
          memahami, dan menyetujui disclaimer ini.
        </Text>
      </ScrollView>
      <TouchableOpacity style={styles.button} onPress={handleAccept}>
        <Text style={styles.buttonText}>Saya Mengerti & Setuju</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: colors.background },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 16,
    marginTop: 48,
  },
  scroll: { flex: 1, marginBottom: 16 },
  body: { fontSize: 15, lineHeight: 24, color: colors.textSecondary },
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
