import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useAuthStore } from "../src/store/authStore";
import { colors } from "../src/theme";

const WA_NUMBER = "62XXXXXXXXXX";

const plans = [
  {
    key: "free",
    name: "Free",
    description: "Cocok untuk pemula yang ingin mencoba",
    borderColor: colors.border,
    glow: false,
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
    description: "Semua fitur Premium + komisi referral",
    borderColor: "#FF9500",
    glow: false,
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
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
    >
      <Text className="text-2xl font-bold text-text-primary mb-2">
        Pilih Plan Anda
      </Text>
      <Text className="text-sm text-text-secondary mb-6 leading-5">
        Upgrade untuk mendapatkan akses penuh ke semua sinyal trading
      </Text>

      {plans.map((plan) => {
        const isActive = currentPlan === plan.key;
        return (
          <View
            key={plan.key}
            className="bg-surface rounded-2xl border-2 p-5 mb-4"
            style={[
              { borderColor: plan.borderColor },
              plan.glow && {
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 12,
                elevation: 8,
              },
            ]}
          >
            <View className="flex-row justify-between items-start mb-4">
              <View>
                <Text className="text-xl font-bold text-text-primary mb-1">
                  {plan.name}
                </Text>
                <Text className="text-[13px] text-text-secondary">
                  {plan.description}
                </Text>
              </View>
              {isActive && (
                <View className="bg-green px-2.5 py-1 rounded-xl">
                  <Text className="text-black font-bold text-xs">Aktif</Text>
                </View>
              )}
              {plan.glow && !isActive && (
                <View className="bg-primary px-2.5 py-1 rounded-xl">
                  <Text className="text-white font-bold text-xs">Populer</Text>
                </View>
              )}
            </View>

            <View className="h-px bg-bdr mb-4" />

            {plan.features.map((f) => (
              <View key={f.label} className="flex-row items-center mb-2.5">
                <Text
                  className="text-base font-bold w-6"
                  style={{
                    color: f.included ? colors.green : colors.textSecondary,
                  }}
                >
                  {f.included ? "✓" : "–"}
                </Text>
                <Text
                  className={`text-sm ${f.included ? "text-text-primary" : "text-text-secondary"}`}
                >
                  {f.label}
                </Text>
              </View>
            ))}

            {plan.cta && !isActive && (
              <TouchableOpacity
                className="mt-5 p-3.5 rounded-[10px] items-center"
                style={{ backgroundColor: plan.borderColor }}
                onPress={plan.cta.onPress}
              >
                <Text className="text-white font-bold text-[15px]">
                  {plan.cta.label}
                </Text>
              </TouchableOpacity>
            )}
            {isActive && (
              <View className="mt-5 p-3.5 rounded-[10px] items-center bg-surface-alt border border-bdr">
                <Text className="text-text-secondary font-semibold text-[15px]">
                  Plan Aktif Anda
                </Text>
              </View>
            )}
          </View>
        );
      })}

      <Text className="text-xs text-text-secondary text-center mt-2 leading-[18px]">
        * Untuk informasi lebih lanjut, hubungi admin melalui WhatsApp
      </Text>
    </ScrollView>
  );
}
