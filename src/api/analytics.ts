import client from "./client";

export interface AnalyticsSummary {
  win_rate: number;
  total: number;
  wins: number;
  losses: number;
  by_symbol: { symbol: string; total: number; wins: number; win_rate: number }[];
  monthly: { month: string; total: number; wins: number; win_rate: number }[];
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const res = await client.get<AnalyticsSummary>("/analytics/summary");
  return res.data;
}
