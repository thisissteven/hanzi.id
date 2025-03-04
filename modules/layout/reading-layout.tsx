import { SpeechProvider } from "@/utils";
import { Heading1Icon, Heading2Icon, Heading3Icon, Heading4Icon, Heading5Icon } from "lucide-react";
import React from "react";
import { AudioProvider } from "./hsk-layout";

type FontSize = "sm" | "base" | "lg" | "xl" | "2xl";

export const fontSizeMap = {
  sm: {
    className: "text-base md:text-lg",
    icon: <Heading5Icon size={20} />,
    iconLarge: <Heading4Icon size={22} />,
    name: "sm",
  },
  base: {
    className: "text-lg md:text-xl tracking-wide",
    icon: <Heading4Icon size={20} />,
    iconLarge: <Heading4Icon size={22} />,
    name: "base",
  },
  lg: {
    className: "text-xl md:text-2xl tracking-wider",
    icon: <Heading3Icon size={20} />,
    iconLarge: <Heading3Icon size={22} />,
    name: "lg",
  },
  xl: {
    className: "text-2xl md:text-3xl leading-10 tracking-wide",
    icon: <Heading2Icon size={20} />,
    iconLarge: <Heading2Icon size={22} />,
    name: "xl",
  },
  "2xl": {
    className: "text-3xl md:text-4xl leading-10 tracking-wide",
    icon: <Heading1Icon size={20} />,
    iconLarge: <Heading1Icon size={22} />,
    name: "2xl",
  },
} as const;

const ReadingContext = React.createContext(
  {} as {
    blurred: boolean;
    fontSize: {
      className: string;
      icon: React.ReactNode;
      iconLarge: React.ReactNode;
      name: FontSize;
    };
    speed: number;
    flashcard: Array<Flashcard>;
    mode: "normal" | "flash";
    toggleBlur: () => void;
    changeMode: (mode: "normal" | "flash") => void;
    changeFontSize: (fontSize: FontSize) => void;
    changeSpeed: (speed: number) => void;
    addToFlashcard: (chapterName: string, word: string) => void;
    removeFromFlashcard: (chapterName: string, word: string) => void;
  }
);

export function useReading() {
  return React.useContext(ReadingContext);
}

export type Flashcard = {
  chapter: string;
  words: Array<string>;
};

export function useFlashcardList() {
  const [flashcards, setFlashcards] = React.useState<Array<Flashcard>>([]);

  React.useEffect(() => {
    const savedFlashcard = localStorage.getItem("flashcard-data");
    if (savedFlashcard) {
      setFlashcards(JSON.parse(savedFlashcard).filter((f: Flashcard) => f.words.length > 0));
    }
  }, []);

  return { flashcards, setFlashcards };
}

export function useFlashcard(name: string) {
  const [flashcardItem, setFlashcardItem] = React.useState<Flashcard | null>(null);

  const removeFlashcard = React.useCallback(() => {
    const flashcards = localStorage.getItem("flashcard-data");
    if (flashcards) {
      const parsedFlashcards = JSON.parse(flashcards) as Array<Flashcard>;
      const newFlashcards = parsedFlashcards.filter((f) => f.chapter !== name);
      localStorage.setItem("flashcard-data", JSON.stringify(newFlashcards));
      setFlashcardItem(null);
    }
  }, [name]);

  React.useEffect(() => {
    const savedFlashcard = localStorage.getItem("flashcard-data");
    if (savedFlashcard) {
      const flashcard = JSON.parse(savedFlashcard) as Array<Flashcard>;
      const flashcardItem = flashcard.find((f) => f.chapter === name);
      if (flashcardItem) {
        setFlashcardItem(flashcardItem);
      }
    }
  }, [name]);

  return { flashcardItem, removeFlashcard };
}

export function ReadingProvider({ children }: { children: React.ReactNode }) {
  const [blurred, setBlurred] = React.useState(true);
  const [fontSize, setFontSize] = React.useState<(typeof fontSizeMap)[FontSize]>(fontSizeMap.xl);
  const [speed, setSpeed] = React.useState(1);
  const [flashcard, setFlashcard] = React.useState<Array<Flashcard>>([]);
  const [mode, setMode] = React.useState<"normal" | "flash">("normal");

  const toggleBlur = React.useCallback(() => {
    setBlurred((prev) => {
      const blurred = !prev;
      localStorage.setItem("blurred", JSON.stringify(blurred));
      return blurred;
    });
  }, []);

  const changeFontSize = React.useCallback((fontSize: FontSize) => {
    setFontSize(fontSizeMap[fontSize]);
    localStorage.setItem("fontSize", fontSize);
  }, []);

  const changeSpeed = React.useCallback((speed: number) => {
    setSpeed(speed);
    localStorage.setItem("speed", JSON.stringify(speed));
  }, []);

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
    const savedFontSize = localStorage.getItem("fontSize");
    if (savedFontSize) {
      setFontSize(fontSizeMap[savedFontSize as FontSize]);
    }

    const savedSpeed = localStorage.getItem("speed");
    if (savedSpeed) {
      setSpeed(parseFloat(savedSpeed));
    }

    const savedFlashcard = localStorage.getItem("flashcard-data");
    if (savedFlashcard) {
      setFlashcard(JSON.parse(savedFlashcard));
    }
  }, []);

  return (
    <AudioProvider>
      <ReadingContext.Provider
        value={{
          blurred,
          fontSize,
          speed,
          flashcard,
          mode,
          changeMode: setMode,
          toggleBlur,
          changeFontSize,
          changeSpeed,
          addToFlashcard,
          removeFromFlashcard,
        }}
      >
        <SpeechProvider>{children}</SpeechProvider>
      </ReadingContext.Provider>
    </AudioProvider>
  );
}

export function ReadingLayout({ children }: { children: React.ReactNode }) {
  return <ReadingProvider>{children}</ReadingProvider>;
}
