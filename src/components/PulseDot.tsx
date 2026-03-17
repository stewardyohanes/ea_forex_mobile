import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { colors } from "../theme";

interface Props {
  color?: string;
  size?: number;
  active?: boolean;
}

export default function PulseDot({ color = colors.green, size = 8, active = true }: Props) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (!active) return;
    scale.value = withRepeat(
      withSequence(
        withTiming(1.6, { duration: 700 }),
        withTiming(1, { duration: 700 })
      ),
      -1,
      false
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 700 }),
        withTiming(1, { duration: 700 })
      ),
      -1,
      false
    );
  }, [active]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={{ width: size + 6, height: size + 6, alignItems: "center", justifyContent: "center" }}>
      {/* Animated ring */}
      <Animated.View
        style={[
          {
            position: "absolute",
            width: size + 6,
            height: size + 6,
            borderRadius: (size + 6) / 2,
            backgroundColor: color,
            opacity: 0.25,
          },
          active ? ringStyle : { opacity: 0 },
        ]}
      />
      {/* Solid dot */}
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: active ? color : colors.textSecondary,
        }}
      />
    </View>
  );
}
