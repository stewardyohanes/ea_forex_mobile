import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { router } from "expo-router";
import { useAuthStore } from "../src/store/authStore";
import { colors } from "../src/theme";

const WA_NUMBER = "62XXXXXXXXXX"; // ganti dengan nomor admin

const plans = [
  {
    key: "free",
    name: "Free",
    price: "Gratis",
    description: "Cocok untuk pemula yang ingin mencoba",
    borderColor: colors.border,
    features: [
      { label: "10 sinyal terakhir", included: true },
      { label: "Push notifikasi", included: false },
      { label: "Data real-time", included: false },
      { label: "Grace period 3 hari", included: false },
      { label: "Komisi referral", included: false },
    ],
    cta: null,
  },
  {
    key: "premium",
    name: "Premium",
    price: "Hubungi Admin",
    description: "Akses penuh semua sinyal real-time",
    borderColor: colors.primary,
    glow: true,
    features: [
      { label: "Semua sinyal real-time", included: true },
      { label: "Push notifikasi", included: true },
      { label: "Data real-time", included: true },
      { label: "Grace period 3 hari", included: false },
      { label: "Komisi referral", included: false },
    ],
    cta: {
      label: "Hubungi Admin",
      onPress: () =>
        Linking.openURL(
          `https://wa.me/${WA_NUMBER}?text=Halo%2C+saya+ingin+upgrade+ke+Premium`,
        ),
    },
  },
  {
    key: "affiliate",
    name: "Affiliate",
    price: "Daftar Gratis",
    description: "Semua fitur Premium + komisi referral",
    borderColor: "#FF9500",
    features: [
      { label: "Semua sinyal real-time", included: true },
      { label: "Push notifikasi", included: true },
      { label: "Data real-time", included: true },
      { label: "Grace period 3 hari", included: true },
      { label: "Komisi referral", included: true },
    ],
    cta: {
      label: "Daftar Affiliate",
      onPress: () =>
        Linking.openURL(
          `https://wa.me/${WA_NUMBER}?text=Halo%2C+saya+ingin+mendaftar+sebagai+Affiliate`,
        ),
    },
  },
];

export default function UpgradeScreen() {
  const { user } = useAuthStore();
  const currentPlan = user?.plan ?? "free";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Pilih Plan Anda</Text>
      <Text style={styles.subtitle}>
        Upgrade untuk mendapatkan akses penuh ke semua sinyal trading
      </Text>

      {plans.map((plan) => {
        const isActive = currentPlan === plan.key;
        return (
          <View
            key={plan.key}
            style={[
              styles.card,
              { borderColor: plan.borderColor },
              plan.glow && styles.cardGlow,
            ]}
          >
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planDesc}>{plan.description}</Text>
              </View>
              {isActive && (
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>Aktif</Text>
                </View>
              )}
              {plan.glow && !isActive && (
                <View style={styles.recommendedBadge}>
                  <Text style={styles.recommendedText}>Populer</Text>
                </View>
              )}
            </View>

            <View style={styles.divider} />

            {plan.features.map((f) => (
              <View key={f.label} style={styles.featureRow}>
                <Text
                  style={[
                    styles.featureIcon,
                    { color: f.included ? colors.green : colors.textSecondary },
                  ]}
                >
                  {f.included ? "✓" : "–"}
                </Text>
                <Text
                  style={[
                    styles.featureLabel,
                    !f.included && styles.featureDimmed,
                  ]}
                >
                  {f.label}
                </Text>
              </View>
            ))}

            {plan.cta && !isActive && (
              <TouchableOpacity
                style={[styles.ctaBtn, { backgroundColor: plan.borderColor }]}
                onPress={plan.cta.onPress}
              >
                <Text style={styles.ctaText}>{plan.cta.label}</Text>
              </TouchableOpacity>
            )}

            {isActive && (
              <View style={[styles.ctaBtn, styles.ctaBtnDisabled]}>
                <Text style={styles.ctaTextDisabled}>Plan Aktif Anda</Text>
              </View>
            )}
          </View>
        );
      })}

      <Text style={styles.note}>
        * Untuk informasi lebih lanjut, hubungi admin melalui WhatsApp
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 40 },
  backBtn: { marginBottom: 16 },
  backText: { color: colors.primary, fontSize: 16 },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 24,
    lineHeight: 20,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 2,
    padding: 20,
    marginBottom: 16,
  },
  cardGlow: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  planName: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  planDesc: { fontSize: 13, color: colors.textSecondary },
  activeBadge: {
    backgroundColor: colors.green,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadgeText: { color: "#000", fontWeight: "700", fontSize: 12 },
  recommendedBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recommendedText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  featureIcon: { fontSize: 16, fontWeight: "700", width: 24 },
  featureLabel: { fontSize: 14, color: colors.textPrimary },
  featureDimmed: { color: colors.textSecondary },
  ctaBtn: {
    marginTop: 20,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  ctaBtnDisabled: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ctaText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  ctaTextDisabled: {
    color: colors.textSecondary,
    fontWeight: "600",
    fontSize: 15,
  },
  note: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 18,
  },
});
