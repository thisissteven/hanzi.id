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
    toggleBlur: () => void;
    changeFontSize: (fontSize: FontSize) => void;
    changeSpeed: (speed: number) => void;
  }
);

export function useReading() {
  return React.useContext(ReadingContext);
}

export function ReadingProvider({ children }: { children: React.ReactNode }) {
  const [blurred, setBlurred] = React.useState(true);
  const [fontSize, setFontSize] = React.useState<(typeof fontSizeMap)[FontSize]>(fontSizeMap.xl);
  const [speed, setSpeed] = React.useState(1.2);

  const toggleBlur = React.useCallback(() => {
    setBlurred((prev) => !prev);
    localStorage.setItem("blurred", JSON.stringify(!blurred));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeFontSize = React.useCallback((fontSize: FontSize) => {
    setFontSize(fontSizeMap[fontSize]);
    localStorage.setItem("fontSize", fontSize);
  }, []);

  const changeSpeed = React.useCallback((speed: number) => {
    setSpeed(speed);
    localStorage.setItem("speed", JSON.stringify(speed));
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

    // const savedBlurred = localStorage.getItem("blurred");
    // if (savedBlurred) {
    //   setBlurred(JSON.parse(savedBlurred));
    // }
  }, []);

  return (
    <ReadingContext.Provider
      value={{
        blurred,
        fontSize,
        speed,
        toggleBlur,
        changeFontSize,
        changeSpeed,
      }}
    >
      <SpeechProvider>{children}</SpeechProvider>
    </ReadingContext.Provider>
  );
}

export function ReadingLayout({ children }: { children: React.ReactNode }) {
  return <ReadingProvider>{children}</ReadingProvider>;
}
