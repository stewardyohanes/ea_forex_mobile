import client from './client';

export async function registerDevice(token: string, platform: 'android' | 'ios'): Promise<void> {
  await client.post('/devices', { fcm_token: token, platform });
}
