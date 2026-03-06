import { View, Text } from "react-native";

interface Props {
  direction: "BUY" | "SELL";
}

export default function DirectionBadge({ direction }: Props) {
  const isBuy = direction === "BUY";
  return (
    <View className={`px-2.5 py-1 rounded-md ${isBuy ? "bg-green" : "bg-red"}`}>
      <Text className="text-white font-bold text-[13px]">{direction}</Text>
    </View>
  );
}
