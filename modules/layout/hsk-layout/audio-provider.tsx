// src/context/AudioContext.js
import useIsMobile from "@/hooks/useIsMobile";
import React, { createContext, useContext, useState } from "react";

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

  const isMobile = useIsMobile();

  const speak = (text: string, speed: number) => {
    setIsSpeaking({
      state: true,
      text: text,
    });

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = isMobile ? "zh_CN" : "zh-CN";
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
    utterance.onerror = () =>
      setIsSpeaking({
        state: false,
        text: null,
      });

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
