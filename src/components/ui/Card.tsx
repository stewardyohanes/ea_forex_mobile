import { View, ViewProps } from 'react-native';
import { colors, radius, shadows } from '../../theme';

type Variant = 'default' | 'glow-blue' | 'glow-green' | 'glow-red' | 'glow-gold';

interface Props extends ViewProps {
  variant?: Variant;
  padding?: number;
}

const glowColors: Record<string, string> = {
  'glow-blue': colors.primary,
  'glow-green': colors.green,
  'glow-red': colors.red,
  'glow-gold': colors.gold,
};

export default function Card({ variant = 'default', padding = 16, style, children, ...props }: Props) {
  const glowColor = glowColors[variant];

  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: glowColor ? `${glowColor}40` : colors.border,
          padding,
          ...(glowColor ? shadows.glow(glowColor) : shadows.sm),
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
