import { Flashcard } from "@/modules/layout";
import React from "react";

export function useHskFlashcard(name: string, word: string) {
  const [flashcard, setFlashcard] = React.useState<Array<Flashcard>>([]);

  React.useEffect(() => {
    const savedFlashcard = localStorage.getItem("flashcard-data");
    if (savedFlashcard) {
      setFlashcard(JSON.parse(savedFlashcard).filter((f: Flashcard) => f.words.length > 0));
    }
  }, []);

  const isWordInFlashcard = flashcard.some((f) => f.chapter === name && f.words.includes(word));

  const addToFlashcard = React.useCallback((name: string, word: string) => {
    setFlashcard((prev) => {
      const flashcardItem = prev.find((f) => f.chapter === name);
      if (flashcardItem) {
        const newWords = [...flashcardItem.words, word];
        const newFlashcard = prev.map((f) => {
          if (f.chapter === name) {
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
            chapter: name,
            words: [word],
          },
        ];

        localStorage.setItem("flashcard-data", JSON.stringify(newFlashcard));
        return newFlashcard;
      }
    });
  }, []);

  const removeFromFlashcard = React.useCallback((name: string, word: string) => {
    setFlashcard((prev) => {
      const flashcardItem = prev.find((f) => f.chapter === name);
      if (flashcardItem) {
        const newWords = flashcardItem.words.filter((w) => w !== word);
        const newFlashcard = prev.map((f) => {
          if (f.chapter === name) {
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

  return { isWordInFlashcard, flashcard, addToFlashcard, removeFromFlashcard };
}
