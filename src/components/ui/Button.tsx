import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors, radius } from '../../theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold';

interface Props {
  label: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles: Record<Variant, { bg: string; text: string; border?: string }> = {
  primary: { bg: colors.primary, text: '#fff' },
  secondary: { bg: colors.surface, text: colors.textPrimary, border: colors.border },
  ghost: { bg: 'transparent', text: colors.primary, border: colors.primary },
  danger: { bg: colors.red, text: '#fff' },
  gold: { bg: colors.gold, text: '#000' },
};

const sizeStyles = {
  sm: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 13 },
  md: { paddingVertical: 14, paddingHorizontal: 20, fontSize: 15 },
  lg: { paddingVertical: 16, paddingHorizontal: 24, fontSize: 16 },
};

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function Button({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = false,
  size = 'md',
}: Props) {
  const scale = useSharedValue(1);
  const style = variantStyles[variant];
  const sz = sizeStyles[size];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handlePressIn() {
    scale.value = withSpring(0.96, { damping: 15 });
  }

  function handlePressOut() {
    scale.value = withSpring(1, { damping: 15 });
  }

  async function handlePress() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }

  return (
    <AnimatedTouchable
      style={[
        animatedStyle,
        {
          backgroundColor: style.bg,
          paddingVertical: sz.paddingVertical,
          paddingHorizontal: sz.paddingHorizontal,
          borderRadius: radius.md,
          alignItems: 'center' as const,
          justifyContent: 'center' as const,
          flexDirection: 'row' as const,
          width: fullWidth ? '100%' : undefined,
          borderWidth: style.border ? 1.5 : 0,
          borderColor: style.border,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={1}
    >
      {loading ? (
        <ActivityIndicator color={style.text} size="small" />
      ) : (
        <Text style={{ color: style.text, fontSize: sz.fontSize, fontWeight: '700' }}>
          {label}
        </Text>
      )}
    </AnimatedTouchable>
  );
}
