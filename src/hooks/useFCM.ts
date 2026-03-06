import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { registerDevice } from '@/api/device';

export function useFCM() {
  useEffect(() => {
    setupFCM();
  }, []);

  async function setupFCM() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') return;

    try {
      const tokenData = await Notifications.getDevicePushTokenAsync();
      const platform = Platform.OS === 'ios' ? 'ios' : 'android';
      await registerDevice(tokenData.data, platform);
    } catch (e) {
      console.log('FCM setup error:', e);
    }
  }
}
