import client from './client';
import { AuthResponse, User } from '../types/auth';

export async function register(email: string, password: string): Promise<AuthResponse> {
  const res = await client.post<AuthResponse>('/auth/register', { email, password });
  return res.data;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await client.post<AuthResponse>('/auth/login', { email, password });
  return res.data;
}

export async function getMe(): Promise<User> {
  const res = await client.get<User>('/auth/me');
  return res.data;
}
