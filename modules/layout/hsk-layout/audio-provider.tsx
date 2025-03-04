// src/context/AudioContext.js
import useIsMobile from "@/hooks/useIsMobile";
import { useLocale } from "@/locales/use-locale";
import React, { createContext, useContext, useState } from "react";
import { toast } from "sonner";

// Create the context
const AudioContext = createContext(
  {} as {
    isSpeaking: {
      state: boolean;
      text: string | null;
    };
    speak: (text: string, speed: number) => void;
    stopAudio: () => void;
  }
);

export const useAudio = () => {
  return useContext(AudioContext);
};

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [isSpeaking, setIsSpeaking] = useState<{
    state: boolean;
    text: string | null;
  }>({
    state: false,
    text: null,
  });

  const { t } = useLocale();

  const isMobile = useIsMobile();

  const speak = (text: string, speed: number) => {
    setIsSpeaking({
      state: true,
      text: text,
    });

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = isMobile ? "zh_CN" : "zh-CN";

    const voices = window.speechSynthesis.getVoices();
    utterance.voice =
      voices.find((voice) => voice.lang === utterance.lang || voice.voiceURI.includes("zh-CN")) ?? voices[0];
    utterance.rate = speed;

    utterance.onstart = () =>
      setIsSpeaking({
        state: true,
        text: text,
      });

    utterance.onend = () =>
      setIsSpeaking({
        state: false,
        text: null,
      });
    utterance.onerror = (e) => {
      if ((!e.error || e.error === "synthesis-failed") && !isMobile) {
        toast.custom(
          (_) => (
            <div className="font-sans mx-auto select-none w-fit pointer-events-none rounded-full bg-[#232323] whitespace-nowrap py-3 px-6 flex items-center gap-3">
              <div className="shrink-0 mt-0.5 w-2 h-2 rounded-full bg-rose-500 indicator"></div>
              <span className="shrink-0">{t.audioNotFound}</span>
            </div>
          ),
          {
            id: "audio-source-not-found",
            duration: 5000,
            position: "bottom-center",
          }
        );
      }
      setIsSpeaking({
        state: false,
        text: null,
      });
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const stopAudio = React.useCallback(() => {
    window.speechSynthesis.cancel();
  }, []);

  const value = {
    isSpeaking,
    speak,
    stopAudio,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};
