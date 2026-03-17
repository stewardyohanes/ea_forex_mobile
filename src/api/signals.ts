import client from './client';
import { Signal, PaginatedSignals } from '../types/signal';

export async function getSignals(page: number = 1, limit: number = 20, direction?: string): Promise<PaginatedSignals> {
  const res = await client.get<PaginatedSignals>('/signals', {
    params: { page, limit, ...(direction ? { direction } : {}) },
  });
  return res.data;
}

export async function getSignalById(id: string): Promise<Signal> {
  const res = await client.get<Signal>(`/signals/${id}`);
  return res.data;
}
