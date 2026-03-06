export interface User {
  id: string;
  email: string;
  plan: 'free' | 'premium' | 'affiliate';
  plan_expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
