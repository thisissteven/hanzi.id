import { SpeechProvider } from "@/utils";
import { Heading1Icon, Heading2Icon, Heading3Icon, Heading4Icon } from "lucide-react";
import React from "react";

type FontSize = "base" | "lg" | "xl" | "2xl";

export const fontSizeMap = {
  base: {
    className: "text-base md:text-lg",
    icon: <Heading4Icon size={20} />,
    iconLarge: <Heading4Icon size={22} />,
    name: "base",
  },
  lg: {
    className: "text-lg md:text-xl tracking-wide",
    icon: <Heading3Icon size={20} />,
    iconLarge: <Heading3Icon size={22} />,
    name: "lg",
  },
  xl: {
    className: "text-xl md:text-2xl tracking-wider",
    icon: <Heading2Icon size={20} />,
    iconLarge: <Heading2Icon size={22} />,
    name: "xl",
  },
  "2xl": {
    className: "text-2xl md:text-3xl leading-10 tracking-wide",
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
    flashcard: Array<string>;
    toggleBlur: () => void;
    changeFontSize: (fontSize: FontSize) => void;
    changeSpeed: (speed: number) => void;
    addToFlashcard: (word: string) => void;
    removeFromFlashcard: (word: string) => void;
  }
);

export function useReading() {
  return React.useContext(ReadingContext);
}

export function ReadingProvider({ children }: { children: React.ReactNode }) {
  const [blurred, setBlurred] = React.useState(true);
  const [fontSize, setFontSize] = React.useState<(typeof fontSizeMap)[FontSize]>(fontSizeMap.xl);
  const [speed, setSpeed] = React.useState(1.2);
  const [flashcard, setFlashcard] = React.useState<Array<string>>([]);

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

  const addToFlashcard = React.useCallback((word: string) => {
    setFlashcard((prev) => {
      const flashcard = [...prev, word];
      localStorage.setItem("flashcard", JSON.stringify([...flashcard, word]));
      return flashcard;
    });
  }, []);

  const removeFromFlashcard = React.useCallback((word: string) => {
    setFlashcard((prev) => {
      const flashcard = prev.filter((w) => w !== word);
      localStorage.setItem("flashcard", JSON.stringify(flashcard.filter((w) => w !== word)));
      return flashcard;
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

    const savedFlashcard = localStorage.getItem("flashcard");
    if (savedFlashcard) {
      setFlashcard(JSON.parse(savedFlashcard));
    }
  }, []);

  return (
    <ReadingContext.Provider
      value={{
        blurred,
        fontSize,
        speed,
        flashcard,
        toggleBlur,
        changeFontSize,
        changeSpeed,
        addToFlashcard,
        removeFromFlashcard,
      }}
    >
      <SpeechProvider>{children}</SpeechProvider>
    </ReadingContext.Provider>
  );
}

export function ReadingLayout({ children }: { children: React.ReactNode }) {
  return <ReadingProvider>{children}</ReadingProvider>;
}
