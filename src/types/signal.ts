export interface Signal {
  id: string;
  symbol: string;
  timeframe: string;
  direction: string;
  entry_price: number;
  sl: number;
  tp1: number | null;
  tp2: number | null;
  tp3: number | null;
  status: string;
  risk_reward: number | null;
  raw_msg_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginatedSignals {
  data: Signal[];
  total: number;
  page: number;
  limit: number;
}
