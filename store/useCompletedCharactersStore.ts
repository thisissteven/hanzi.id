import { Level } from "@/data";
import { create } from "zustand";

interface CompletedCharactersState {
  showUncompletedOnly: boolean;
  completedCharacters: {
    [k in Level]: Array<string>;
  };

  actions: {
    handleValueMismatch: () => void;
    hydrateCompletedCharacters: () => void;
    hydrateSettings: () => void;
    addCompletedCharacters: (level: Level, id: string) => void;
    removeCompletedCharacters: (level: Level, id: string) => void;
    resetLevel: (level: Level) => void;
    toggleSettings: () => void;
  };
}

const KEY = "completed-characters";
const SETTINGS_KEY = "show-uncompleted-only";

const useCompletedCharactersStore = create<CompletedCharactersState>()((set) => ({
  showUncompletedOnly: false,
  completedCharacters: {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
  },
  actions: {
    handleValueMismatch: () => {
      const completedCharacters = localStorage.getItem(KEY);
      if (completedCharacters) {
        const parsed = JSON.parse(completedCharacters);
        if (Object.keys(parsed).length !== 9) {
          localStorage.removeItem(KEY);
        }
      }
    },
    hydrateCompletedCharacters: () =>
      set((state) => {
        const completedCharacters = localStorage.getItem(KEY);
        if (completedCharacters) {
          return {
            completedCharacters: JSON.parse(completedCharacters),
          };
        }
        return {
          completedCharacters: state.completedCharacters,
        };
      }),
    hydrateSettings: () =>
      set((state) => {
        const showUncompletedOnly = localStorage.getItem(SETTINGS_KEY);
        if (showUncompletedOnly) {
          return {
            showUncompletedOnly: JSON.parse(showUncompletedOnly),
          };
        }
        return {
          showUncompletedOnly: state.showUncompletedOnly,
        };
      }),
    addCompletedCharacters: (level, id) =>
      set((state) => {
        const newCompletedCharacters = Array.from(state.completedCharacters[level]);
        newCompletedCharacters.push(id);
        const newState = {
          ...state.completedCharacters,
          [level]: newCompletedCharacters,
        };
        localStorage.setItem(KEY, JSON.stringify(newState));
        return {
          completedCharacters: newState,
        };
      }),
    removeCompletedCharacters: (level, characterId) =>
      set((state) => {
        const newCompletedCharacters = Array.from(state.completedCharacters[level]).filter((id) => id !== characterId);
        const newState = {
          ...state.completedCharacters,
          [level]: newCompletedCharacters,
        };
        localStorage.setItem(KEY, JSON.stringify(newState));
        return {
          completedCharacters: newState,
        };
      }),
    resetLevel: (level) =>
      set((state) => {
        const newState = {
          ...state.completedCharacters,
          [level]: [],
        };
        localStorage.setItem(KEY, JSON.stringify(newState));
        return {
          completedCharacters: newState,
        };
      }),
    toggleSettings: () =>
      set((state) => {
        const newState = !state.showUncompletedOnly;
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(newState));
        return {
          showUncompletedOnly: newState,
        };
      }),
  },
}));

export const useCompletedCharacters = () => useCompletedCharactersStore((state) => state.completedCharacters);
export const useShowUncompletedOnly = () => useCompletedCharactersStore((state) => state.showUncompletedOnly);

export const useCompletedCharactersActions = () => useCompletedCharactersStore((state) => state.actions);
