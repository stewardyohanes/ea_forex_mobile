import { useEffect } from 'react';
import { Platform } from 'react-native';
import { registerDevice } from '@/api/device';
import { useAuthStore } from '@/store/authStore';

export function useFCM() {
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user?.plan !== 'premium' && user?.plan !== 'affiliate') return;
    setupFCM();
  }, [user?.plan]);

  async function setupFCM() {
    try {
      const Notifications = await import('expo-notifications');
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') return;

      const tokenData = await Notifications.getDevicePushTokenAsync();
      const platform = Platform.OS === 'ios' ? 'ios' : 'android';
      await registerDevice(tokenData.data, platform);
    } catch (e) {
      console.log('FCM setup error:', e);
    }
  }
}
