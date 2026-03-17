import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { radius } from '../../theme';

// Deterministic gradient colors based on email hash
const GRADIENTS: [string, string][] = [
  ['#2979FF', '#00E5A0'],
  ['#FF3D57', '#FFB800'],
  ['#7C4DFF', '#2979FF'],
  ['#00E5A0', '#2979FF'],
  ['#FFB800', '#FF3D57'],
  ['#FF6D00', '#FFB800'],
  ['#00BCD4', '#00E5A0'],
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

interface Props {
  email: string;
  size?: number;
}

export default function Avatar({ email, size = 72 }: Props) {
  const initial = email.charAt(0).toUpperCase();
  const gradient = GRADIENTS[hashString(email) % GRADIENTS.length];
  const fontSize = size * 0.4;

  return (
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: size,
        height: size,
        borderRadius: radius.full,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: '#fff', fontSize, fontWeight: '800' }}>
        {initial}
      </Text>
    </LinearGradient>
  );
}
