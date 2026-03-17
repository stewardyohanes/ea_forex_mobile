import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../../theme';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  isPassword?: boolean;
}

export default function Input({ label, error, isPassword = false, ...props }: Props) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={{ marginBottom: 12 }}>
      {label && (
        <Text style={{ color: colors.textSecondary, fontSize: 13, fontWeight: '600', marginBottom: 6 }}>
          {label}
        </Text>
      )}
      <View style={{ position: 'relative' }}>
        <TextInput
          style={{
            backgroundColor: colors.surface,
            borderWidth: 1.5,
            borderColor: error ? colors.red : colors.border,
            borderRadius: radius.md,
            paddingVertical: 14,
            paddingHorizontal: 14,
            paddingRight: isPassword ? 48 : 14,
            fontSize: 15,
            color: colors.textPrimary,
          }}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            style={{ position: 'absolute', right: 14, top: 14 }}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {error ? (
        <Text style={{ color: colors.red, fontSize: 12, marginTop: 4, marginLeft: 2 }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
