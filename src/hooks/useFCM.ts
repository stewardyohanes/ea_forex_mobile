import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { registerDevice } from '@/api/device';
import { useAuthStore } from '@/store/authStore';

// Tampilkan notifikasi saat app di foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function useFCM() {
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    // Listen to notification tap — berlaku untuk semua user (termasuk saat app background/killed)
    const tapSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const signalId = response.notification.request.content.data?.signal_id as string | undefined;
      if (signalId) {
        router.push(`/signal/${signalId}`);
      }
    });

    return () => tapSubscription.remove();
  }, []);

  useEffect(() => {
    if (user?.plan !== 'premium' && user?.plan !== 'affiliate') return;
    setupFCM();
  }, [user?.plan]);

  async function setupFCM() {
    try {
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
