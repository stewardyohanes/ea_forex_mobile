import { useEffect } from 'react';
import { Platform } from 'react-native';
import { registerDevice } from '@/api/device';

export function useFCM() {
  useEffect(() => {
    setupFCM();
  }, []);

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
