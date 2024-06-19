import { create } from "zustand";

interface LastViewedHanziState {
  lastViewedHanzi: string | null;

  actions: {
    hydrateLastViewedHanzi: () => void;
  };
}

export const LAST_VIEWED_HANZI_KEY = "last-viewed-hanzi";

const useLastViewedHanziStore = create<LastViewedHanziState>()((set) => ({
  lastViewedHanzi: null,
  actions: {
    hydrateLastViewedHanzi: () =>
      set((_) => {
        const lastViewedHanzi = localStorage.getItem(LAST_VIEWED_HANZI_KEY);
        if (!lastViewedHanzi) return { lastViewedHanzi: null };
        return {
          lastViewedHanzi,
        };
      }),
  },
}));

export const useLastViewedHanzi = () => useLastViewedHanziStore((state) => state.lastViewedHanzi);

export const useLastViewedHanziActions = () => useLastViewedHanziStore((state) => state.actions);
