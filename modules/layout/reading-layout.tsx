import React from "react";

type FontSize = "base" | "lg" | "xl" | "2xl";

const fontSizeMap = {
  base: "text-base md:text-lg",
  lg: "text-lg md:text-xl",
  xl: "text-xl md:text-2xl",
  "2xl": "text-2xl md:text-3xl",
} as const;

const ReadingContext = React.createContext(
  {} as {
    blurred: boolean;
    fontSize: string;
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
  const [blurred, setBlurred] = React.useState(false);
  const [fontSize, setFontSize] = React.useState<(typeof fontSizeMap)[FontSize]>("text-base md:text-lg");
  const [speed, setSpeed] = React.useState(1.2);

  const toggleBlur = React.useCallback(() => setBlurred((prev) => !prev), []);
  const changeFontSize = React.useCallback((fontSize: FontSize) => setFontSize(fontSizeMap[fontSize]), []);
  const changeSpeed = React.useCallback((speed: number) => setSpeed(speed), []);

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
      {children}
    </ReadingContext.Provider>
  );
}

export function ReadingLayout({ children }: { children: React.ReactNode }) {
  return <ReadingProvider>{children}</ReadingProvider>;
}
