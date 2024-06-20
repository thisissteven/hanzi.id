import { create } from "zustand";

interface LastViewedHanziState {
  lastViewedHanzi: {
    character: string;
    pathname: string;
  } | null;

  actions: {
    handleValueMismatch: () => void;
    hydrateLastViewedHanzi: () => void;
  };
}

export const LAST_VIEWED_HANZI_KEY = "last-viewed-hanzi";

const useLastViewedHanziStore = create<LastViewedHanziState>()((set) => ({
  lastViewedHanzi: null,
  actions: {
    handleValueMismatch: () => {
      try {
        const lastViewedHanzi = localStorage.getItem(LAST_VIEWED_HANZI_KEY);
        if (lastViewedHanzi) {
          !JSON.parse(lastViewedHanzi).pathname && localStorage.removeItem(LAST_VIEWED_HANZI_KEY);
        }
      } catch {
        localStorage.removeItem(LAST_VIEWED_HANZI_KEY);
      }
    },
    hydrateLastViewedHanzi: () =>
      set((_) => {
        const lastViewedHanzi = localStorage.getItem(LAST_VIEWED_HANZI_KEY);
        if (!lastViewedHanzi) return { lastViewedHanzi: null };
        return {
          lastViewedHanzi: JSON.parse(lastViewedHanzi),
        };
      }),
  },
}));

export const useLastViewedHanzi = () => useLastViewedHanziStore((state) => state.lastViewedHanzi);

export const useLastViewedHanziActions = () => useLastViewedHanziStore((state) => state.actions);
