import { View, Text } from 'react-native';
import { colors, radius } from '../../theme';

type BadgeVariant =
  | 'buy' | 'sell'
  | 'active' | 'tp_hit' | 'sl_hit' | 'closed'
  | 'free' | 'premium' | 'affiliate'
  | 'gold' | 'blue' | 'green' | 'red' | 'gray';

interface Props {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

const variantMap: Record<BadgeVariant, { bg: string; text: string }> = {
  buy:       { bg: colors.green,          text: '#000' },
  sell:      { bg: colors.red,            text: '#fff' },
  active:    { bg: colors.primary,        text: '#fff' },
  tp_hit:    { bg: colors.green,          text: '#000' },
  sl_hit:    { bg: colors.red,            text: '#fff' },
  closed:    { bg: colors.textSecondary,  text: '#fff' },
  free:      { bg: colors.border,         text: colors.textSecondary },
  premium:   { bg: colors.primary,        text: '#fff' },
  affiliate: { bg: colors.gold,           text: '#000' },
  gold:      { bg: colors.gold,           text: '#000' },
  blue:      { bg: colors.primary,        text: '#fff' },
  green:     { bg: colors.green,          text: '#000' },
  red:       { bg: colors.red,            text: '#fff' },
  gray:      { bg: colors.border,         text: colors.textSecondary },
};

export default function Badge({ label, variant = 'blue', size = 'sm' }: Props) {
  const v = variantMap[variant] ?? variantMap.blue;
  const pad = size === 'sm' ? { paddingVertical: 3, paddingHorizontal: 10 } : { paddingVertical: 5, paddingHorizontal: 14 };
  const fontSize = size === 'sm' ? 11 : 13;

  return (
    <View style={{ ...pad, borderRadius: radius.full, backgroundColor: v.bg, alignSelf: 'flex-start' }}>
      <Text style={{ color: v.text, fontSize, fontWeight: '700', letterSpacing: 0.3 }}>
        {label}
      </Text>
    </View>
  );
}
