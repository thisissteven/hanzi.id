import { useLocale } from "@/locales/use-locale";
import { cn } from "@/utils";
import React, { useState } from "react";

interface TeleprompterProps {
  text: string;
}

const countChineseCharacters = (input: string): number => {
  const matches = input.match(/[\u4e00-\u9fa5]/g);
  return matches ? matches.length : 0;
};

export const Teleprompter: React.FC<TeleprompterProps> = ({ text }) => {
  const [paused, setPaused] = useState(false);
  const [desiredCPM, setDesiredCPM] = useState(259);

  const duration = (countChineseCharacters(text) / desiredCPM) * 60;
  //   const duration = (text.split(" ").length / desiredCPM) * 60;

  const { t } = useLocale();

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full h-64 overflow-hidden relative bg-black p-4 text-2xl border border-subtle">
        {/* Animated text */}
        <div
          className={cn("min-h-full animate-teleprompter")}
          style={{
            animationDuration: `${duration}s`,
            animationPlayState: paused ? "paused" : "running",
            animationFillMode: "forwards",
          }}
        >
          {text}
        </div>
      </div>

      {/* Input for Desired CPM */}
      <div className="mt-4 w-full max-md:px-3">
        <label htmlFor="cpmInput" className="block mb-1 ml-1 text-xs text-secondary">
          {t.teleprompter.desiredReadingSpeed}
        </label>
        <input
          type="number"
          id="cpmInput"
          value={desiredCPM}
          onChange={(e) => setDesiredCPM(Number(e.target.value))}
          className="bg-transparent px-3 py-2 rounded-md border border-subtle ring-offset-black ring-smoke focus:ring-offset-2 focus:ring-2 text-secondary focus:text-white transition-shadow duration-200 placeholder:text-secondary/50 focus:outline-none w-full"
        />

        <p className="text-xs leading-normal">{t.teleprompter.readingSpeedInfo}</p>
      </div>

      {/* Pause / Resume Button */}
      <div className="mt-4 flex space-x-2 w-full md:w-fit max-md:px-3 mx-auto">
        <button onClick={() => setPaused(!paused)} className="w-full px-4 py-2 bg-blue-500 rounded hover:bg-blue-600">
          {paused ? t.resume : t.pause}
        </button>
      </div>
    </div>
  );
};
