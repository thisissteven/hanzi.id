import React from "react";
import { Flashcard } from "../layout";

const FlashcardContext = React.createContext(
  {} as {
    flashcard: Array<Flashcard>;
    addToFlashcard: (chapterName: string, word: string) => void;
    removeFromFlashcard: (chapterName: string, word: string) => void;
  }
);

export function useFlashcardContext() {
  return React.useContext(FlashcardContext);
}

export function FlashcardProvider({ children }: { children: React.ReactNode }) {
  const { flashcard, addToFlashcard, removeFromFlashcard } = useFlashcardList();

  return (
    <FlashcardContext.Provider value={{ flashcard, addToFlashcard, removeFromFlashcard }}>
      {children}
    </FlashcardContext.Provider>
  );
}

export function useFlashcardList() {
  const [flashcard, setFlashcard] = React.useState<Array<Flashcard>>([]);

  const addToFlashcard = React.useCallback((chapterName: string, word: string) => {
    setFlashcard((prev) => {
      const flashcardItem = prev.find((f) => f.chapter === chapterName);
      if (flashcardItem) {
        const newWords = [...flashcardItem.words, word];
        const newFlashcard = prev.map((f) => {
          if (f.chapter === chapterName) {
            return {
              chapter: f.chapter,
              words: newWords,
            };
          }
          return f;
        });

        localStorage.setItem("flashcard-data", JSON.stringify(newFlashcard));
        return newFlashcard;
      } else {
        const newFlashcard = [
          ...prev,
          {
            chapter: chapterName,
            words: [word],
          },
        ];

        localStorage.setItem("flashcard-data", JSON.stringify(newFlashcard));
        return newFlashcard;
      }
    });
  }, []);

  const removeFromFlashcard = React.useCallback((chapterName: string, word: string) => {
    setFlashcard((prev) => {
      const flashcardItem = prev.find((f) => f.chapter === chapterName);
      if (flashcardItem) {
        const newWords = flashcardItem.words.filter((w) => w !== word);
        const newFlashcard = prev.map((f) => {
          if (f.chapter === chapterName) {
            return {
              chapter: f.chapter,
              words: newWords,
            };
          }
          return f;
        });

        localStorage.setItem("flashcard-data", JSON.stringify(newFlashcard));
        return newFlashcard;
      }

      return prev;
    });
  }, []);

  React.useEffect(() => {
    const savedFlashcard = localStorage.getItem("flashcard-data");
    if (savedFlashcard) {
      setFlashcard(JSON.parse(savedFlashcard));
    }
  }, []);

  return { flashcard, addToFlashcard, removeFromFlashcard };
}
