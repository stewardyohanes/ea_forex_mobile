import { create } from 'zustand';
import { Signal } from '../types/signal';

interface SignalState {
  signals: Signal[];
  loading: boolean;
  error: string | null;
  setSignals: (signals: Signal[]) => void;
  appendSignals: (signals: Signal[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useSignalStore = create<SignalState>((set) => ({
  signals: [],
  loading: false,
  error: null,
  setSignals: (signals) => set({ signals }),
  appendSignals: (more) => set((s) => ({ signals: [...s.signals, ...more] })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  reset: () => set({ signals: [], loading: false, error: null }),
}));
