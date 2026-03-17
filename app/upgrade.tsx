import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuthStore } from "../src/store/authStore";
import { colors, radius } from "../src/theme";
import { WA_SUPPORT } from "../src/config";


const PLANS = [
  {
    key: "free",
    name: "Free",
    price: "Gratis",
    description: "Untuk pemula yang ingin mencoba",
    borderColor: colors.border,
    accentColor: colors.textSecondary,
    popular: false,
    features: [
      { label: "10 sinyal terakhir", ok: true },
      { label: "Push notifikasi", ok: false },
      { label: "Entry price real-time", ok: false },
      { label: "Grace period 3 hari", ok: false },
      { label: "Komisi referral", ok: false },
    ],
    ctaLabel: null,
    ctaMessage: null,
  },
  {
    key: "premium",
    name: "Premium",
    price: "Hubungi Admin",
    description: "Akses penuh semua sinyal real-time",
    borderColor: colors.primary,
    accentColor: colors.primary,
    popular: true,
    features: [
      { label: "Semua sinyal real-time", ok: true },
      { label: "Push notifikasi", ok: true },
      { label: "Entry price real-time", ok: true },
      { label: "Grace period 3 hari", ok: false },
      { label: "Komisi referral", ok: false },
    ],
    ctaLabel: "Upgrade ke Premium →",
    ctaMessage: "Halo%2C+saya+ingin+upgrade+ke+Premium",
  },
  {
    key: "affiliate",
    name: "Affiliate",
    price: "Hubungi Admin",
    description: "Semua Premium + komisi referral",
    borderColor: colors.gold,
    accentColor: colors.gold,
    popular: false,
    features: [
      { label: "Semua sinyal real-time", ok: true },
      { label: "Push notifikasi", ok: true },
      { label: "Entry price real-time", ok: true },
      { label: "Grace period 3 hari", ok: true },
      { label: "Komisi referral", ok: true },
    ],
    ctaLabel: "Daftar Affiliate →",
    ctaMessage: "Halo%2C+saya+ingin+mendaftar+sebagai+Affiliate",
  },
];

const TESTIMONIALS = [
  {
    name: "Rizky A.",
    role: "Trader Retail",
    text: "Win rate saya naik drastis sejak pakai TradeGenZ. Sinyalnya akurat dan masuk di waktu yang tepat.",
    plan: "Premium",
    planColor: colors.primary,
  },
  {
    name: "Farah N.",
    role: "Full-time Trader",
    text: "Komisi referral Affiliate sangat membantu. Saya ajak 5 teman, hasilnya luar biasa.",
    plan: "Affiliate",
    planColor: colors.gold,
  },
];

const FAQS = [
  {
    q: "Bagaimana cara upgrade?",
    a: "Klik tombol di bawah untuk menghubungi admin via WhatsApp. Admin akan memandu proses aktivasi dalam waktu singkat.",
  },
  {
    q: "Bisa cancel kapan saja?",
    a: "Ya, tidak ada kontrak jangka panjang. Kamu bisa berhenti kapan saja setelah masa aktif habis.",
  },
  {
    q: "Apa bedanya Premium vs Affiliate?",
    a: "Premium mendapat semua akses sinyal real-time. Affiliate mendapat semua fitur Premium ditambah grace period 3 hari dan komisi dari setiap referral yang berhasil upgrade.",
  },
];

function FAQItem({ item, index }: { item: typeof FAQS[0]; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <Animated.View entering={FadeInDown.delay(index * 80).springify()}>
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        activeOpacity={0.8}
        style={{
          paddingVertical: 14,
          paddingHorizontal: 16,
          borderBottomWidth: index < FAQS.length - 1 ? 1 : 0,
          borderBottomColor: colors.border,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ color: colors.textPrimary, fontSize: 14, fontWeight: "600", flex: 1, marginRight: 8 }}>
            {item.q}
          </Text>
          <Ionicons
            name={open ? "chevron-up" : "chevron-down"}
            size={16}
            color={colors.textSecondary}
          />
        </View>
        {open && (
          <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 8, lineHeight: 20 }}>
            {item.a}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function UpgradeScreen() {
  const { user } = useAuthStore();
  const currentPlan = user?.plan ?? "free";
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient colors={[colors.surface, colors.background]} style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ paddingTop: insets.top + 12, paddingHorizontal: 16, marginBottom: 4 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginBottom: 16, alignSelf: "flex-start" }}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Hero Banner */}
        <Animated.View entering={FadeInUp.delay(0).springify()} style={{ marginHorizontal: 16, marginBottom: 20 }}>
          <LinearGradient
            colors={[`${colors.primary}25`, `${colors.green}15`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: radius.xl,
              padding: 20,
              borderWidth: 1,
              borderColor: `${colors.primary}40`,
              alignItems: "center",
            }}
          >
            <Text style={{ color: colors.gold, fontSize: 12, fontWeight: "700", letterSpacing: 1, marginBottom: 6 }}>
              🏆 TRACK RECORD TERVERIFIKASI
            </Text>
            <Text style={{ color: colors.textPrimary, fontSize: 26, fontWeight: "800", textAlign: "center" }}>
              Win Rate{" "}
              <Text style={{ color: colors.green }}>78%</Text>
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 4 }}>
              bulan ini dari 28 sinyal
            </Text>

            <View style={{ flexDirection: "row", gap: 16, marginTop: 16 }}>
              {[
                { value: "247", label: "Trader Aktif", color: colors.primary },
                { value: "28", label: "Sinyal Bulan Ini", color: colors.green },
                { value: "78%", label: "Win Rate", color: colors.gold },
              ].map((stat) => (
                <View key={stat.label} style={{ alignItems: "center" }}>
                  <Text style={{ color: stat.color, fontSize: 18, fontWeight: "800" }}>{stat.value}</Text>
                  <Text style={{ color: colors.textSecondary, fontSize: 10, fontWeight: "600", textAlign: "center" }}>
                    {stat.label}
                  </Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Section title */}
        <Animated.View entering={FadeInDown.delay(80).springify()} style={{ paddingHorizontal: 16, marginBottom: 12 }}>
          <Text style={{ color: colors.textPrimary, fontSize: 20, fontWeight: "800" }}>Pilih Plan Anda</Text>
          <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 2 }}>
            Upgrade untuk akses penuh sinyal real-time
          </Text>
        </Animated.View>

        {/* Plan Cards */}
        {PLANS.map((plan, index) => {
          const isActive = currentPlan === plan.key;
          return (
            <Animated.View
              key={plan.key}
              entering={FadeInDown.delay(120 + index * 80).springify()}
              style={{ marginHorizontal: 16, marginBottom: 12 }}
            >
              <View
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: radius.xl,
                  borderWidth: isActive || plan.popular ? 1.5 : 1,
                  borderColor: isActive ? colors.green : plan.borderColor,
                  overflow: "hidden",
                  ...(plan.popular
                    ? {
                        shadowColor: colors.primary,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 12,
                        elevation: 8,
                      }
                    : {}),
                }}
              >
                {/* Popular tag */}
                {plan.popular && !isActive && (
                  <View style={{ backgroundColor: colors.primary, paddingVertical: 6, alignItems: "center" }}>
                    <Text style={{ color: "#fff", fontSize: 11, fontWeight: "700", letterSpacing: 0.5 }}>
                      ⚡ PALING POPULER
                    </Text>
                  </View>
                )}
                {isActive && (
                  <View style={{ backgroundColor: `${colors.green}20`, paddingVertical: 6, alignItems: "center" }}>
                    <Text style={{ color: colors.green, fontSize: 11, fontWeight: "700", letterSpacing: 0.5 }}>
                      ✓ PLAN AKTIF ANDA
                    </Text>
                  </View>
                )}

                <View style={{ padding: 20 }}>
                  {/* Plan name & price */}
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <View>
                      <Text style={{ color: plan.accentColor, fontSize: 12, fontWeight: "700", letterSpacing: 0.5, marginBottom: 2 }}>
                        {plan.name.toUpperCase()}
                      </Text>
                      <Text style={{ color: colors.textPrimary, fontSize: 22, fontWeight: "800" }}>
                        {plan.price}
                      </Text>
                      <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 2 }}>
                        {plan.description}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: `${plan.accentColor}20`,
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: 1,
                        borderColor: `${plan.accentColor}40`,
                      }}
                    >
                      <Ionicons
                        name={plan.key === "affiliate" ? "star" : plan.key === "premium" ? "flash" : "person"}
                        size={20}
                        color={plan.accentColor}
                      />
                    </View>
                  </View>

                  <View style={{ height: 1, backgroundColor: colors.border, marginBottom: 16 }} />

                  {/* Features */}
                  {plan.features.map((f) => (
                    <View key={f.label} style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                      <View
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 10,
                          backgroundColor: f.ok ? `${colors.green}20` : `${colors.border}40`,
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: 10,
                        }}
                      >
                        <Ionicons
                          name={f.ok ? "checkmark" : "close"}
                          size={12}
                          color={f.ok ? colors.green : colors.textSecondary}
                        />
                      </View>
                      <Text
                        style={{
                          color: f.ok ? colors.textPrimary : colors.textSecondary,
                          fontSize: 13,
                          flex: 1,
                        }}
                      >
                        {f.label}
                      </Text>
                    </View>
                  ))}

                  {/* CTA Button */}
                  {plan.ctaLabel && !isActive && (
                    <TouchableOpacity
                      style={{
                        marginTop: 16,
                        paddingVertical: 14,
                        borderRadius: radius.md,
                        backgroundColor: plan.accentColor,
                        alignItems: "center",
                      }}
                      activeOpacity={0.8}
                      onPress={() =>
                        Linking.openURL(`https://wa.me/${WA_SUPPORT}?text=${plan.ctaMessage}`)
                      }
                    >
                      <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>
                        {plan.ctaLabel}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </Animated.View>
          );
        })}

        {/* Testimonials */}
        <Animated.View entering={FadeInDown.delay(360).springify()} style={{ paddingHorizontal: 16, marginTop: 8, marginBottom: 16 }}>
          <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: "700", letterSpacing: 1, marginBottom: 12 }}>
            KATA MEREKA
          </Text>
          {TESTIMONIALS.map((t, i) => (
            <View
              key={i}
              style={{
                backgroundColor: colors.surface,
                borderRadius: radius.lg,
                padding: 16,
                marginBottom: 10,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 20, marginBottom: 12, fontStyle: "italic" }}>
                "{t.text}"
              </Text>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View>
                  <Text style={{ color: colors.textPrimary, fontSize: 13, fontWeight: "700" }}>{t.name}</Text>
                  <Text style={{ color: colors.textSecondary, fontSize: 11 }}>{t.role}</Text>
                </View>
                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: radius.full,
                    backgroundColor: `${t.planColor}20`,
                    borderWidth: 1,
                    borderColor: `${t.planColor}40`,
                  }}
                >
                  <Text style={{ color: t.planColor, fontSize: 11, fontWeight: "700" }}>{t.plan}</Text>
                </View>
              </View>
            </View>
          ))}
        </Animated.View>

        {/* FAQ */}
        <Animated.View entering={FadeInDown.delay(440).springify()} style={{ paddingHorizontal: 16, marginBottom: 16 }}>
          <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: "700", letterSpacing: 1, marginBottom: 12 }}>
            FAQ
          </Text>
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: radius.lg,
              borderWidth: 1,
              borderColor: colors.border,
              overflow: "hidden",
            }}
          >
            {FAQS.map((faq, i) => (
              <FAQItem key={i} item={faq} index={i} />
            ))}
          </View>
        </Animated.View>

        {/* Trust Badges */}
        <Animated.View
          entering={FadeInDown.delay(520).springify()}
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: 20,
            paddingHorizontal: 16,
            marginBottom: 8,
          }}
        >
          {[
            { icon: "shield-checkmark-outline", label: "Aman & Terpercaya" },
            { icon: "close-circle-outline", label: "Cancel Kapan Saja" },
            { icon: "headset-outline", label: "Support 24/7" },
          ].map((badge) => (
            <View key={badge.label} style={{ alignItems: "center", gap: 4 }}>
              <Ionicons name={badge.icon as any} size={20} color={colors.textSecondary} />
              <Text style={{ color: colors.textSecondary, fontSize: 10, textAlign: "center" }}>{badge.label}</Text>
            </View>
          ))}
        </Animated.View>

        <Text style={{ color: colors.textSecondary, fontSize: 11, textAlign: "center", marginTop: 8, paddingHorizontal: 32 }}>
          * Untuk info lebih lanjut, hubungi admin via WhatsApp
        </Text>
      </ScrollView>
    </LinearGradient>
  );
}
