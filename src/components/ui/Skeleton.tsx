import { useEffect } from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { colors, radius } from '../../theme';

interface Props {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function SkeletonBox({ width = '100%', height = 16, borderRadius = radius.sm, style }: Props) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [colors.surface, '#1A3A6A']
    ),
  }));

  return (
    <Animated.View
      style={[{ width: width as any, height, borderRadius }, animatedStyle, style]}
    />
  );
}

export function SignalCardSkeleton() {
  return (
    <View
      style={{
        backgroundColor: colors.surface,
        marginHorizontal: 16,
        marginBottom: 8,
        borderRadius: radius.lg,
        padding: 14,
        borderWidth: 1,
        borderColor: colors.border,
        flexDirection: 'row',
        gap: 12,
      }}
    >
      <View style={{ flex: 1, gap: 8 }}>
        <SkeletonBox width="50%" height={16} />
        <SkeletonBox width="35%" height={12} />
        <SkeletonBox width="80%" height={12} />
        <SkeletonBox width="60%" height={8} borderRadius={4} />
        <SkeletonBox width="40%" height={10} />
      </View>
      <View style={{ justifyContent: 'center' }}>
        <SkeletonBox width={64} height={32} borderRadius={radius.full} />
      </View>
    </View>
  );
}
