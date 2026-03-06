import { View, Text, TouchableOpacity } from "react-native";

interface Props {
  message: string;
  onRetry?: () => void;
}

export default function EmptyState({ message, onRetry }: Props) {
  return (
    <View className="flex-1 justify-center items-center p-8">
      <Text className="text-5xl mb-4">📭</Text>
      <Text className="text-sm text-text-secondary text-center mb-5">
        {message}
      </Text>
      {onRetry && (
        <TouchableOpacity
          className="border border-primary rounded-lg px-6 py-2.5"
          onPress={onRetry}
        >
          <Text className="text-primary font-semibold text-sm">Coba Lagi</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
