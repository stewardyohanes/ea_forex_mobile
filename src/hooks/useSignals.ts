import { useState, useCallback } from 'react';
import { getSignals } from '../api/signals';
import { useSignalStore } from '../store/signalStore';

export function useSignals() {
  const { signals, setSignals, appendSignals, setLoading, setError, loading, error } = useSignalStore();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchInitial = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSignals(1, 20);
      const items = data.data ?? [];
      setSignals(items);
      setPage(1);
      setHasMore(items.length < (data.total ?? 0));
    } catch (e: any) {
      setError(e.message ?? 'Gagal memuat sinyal');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMore = useCallback(async () => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    setLoading(true);
    try {
      const data = await getSignals(nextPage, 20);
      const items = data.data ?? [];
      appendSignals(items);
      setPage(nextPage);
      setHasMore(signals.length + items.length < (data.total ?? 0));
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, signals.length]);

  return { signals, loading, error, hasMore, fetchInitial, fetchMore };
}
