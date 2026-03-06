import client from './client';
import { Signal, PaginatedSignals } from '../types/signal';

export async function getSignals(page: number = 1, limit: number = 20): Promise<PaginatedSignals> {
  const res = await client.get<PaginatedSignals>('/signals', {
    params: { page, limit },
  });
  return res.data;
}

export async function getSignalById(id: string): Promise<Signal> {
  const res = await client.get<Signal>(`/signals/${id}`);
  return res.data;
}
