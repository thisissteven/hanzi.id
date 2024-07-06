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

export const LAST_VIEWED_HANZI_KEY_OLD = "last-viewed-hanzi-old";

const useLastViewedHanziStoreOld = create<LastViewedHanziState>()((set) => ({
  lastViewedHanzi: null,
  actions: {
    handleValueMismatch: () => {
      try {
        const lastViewedHanzi = localStorage.getItem(LAST_VIEWED_HANZI_KEY_OLD);
        if (lastViewedHanzi) {
          !JSON.parse(lastViewedHanzi).pathname && localStorage.removeItem(LAST_VIEWED_HANZI_KEY_OLD);
        }
      } catch {
        localStorage.removeItem(LAST_VIEWED_HANZI_KEY_OLD);
      }
    },
    hydrateLastViewedHanzi: () =>
      set((_) => {
        const lastViewedHanzi = localStorage.getItem(LAST_VIEWED_HANZI_KEY_OLD);
        if (!lastViewedHanzi) return { lastViewedHanzi: null };
        return {
          lastViewedHanzi: JSON.parse(lastViewedHanzi),
        };
      }),
  },
}));

export const useLastViewedHanziOld = () => useLastViewedHanziStoreOld((state) => state.lastViewedHanzi);

export const useLastViewedHanziActionsOld = () => useLastViewedHanziStoreOld((state) => state.actions);
