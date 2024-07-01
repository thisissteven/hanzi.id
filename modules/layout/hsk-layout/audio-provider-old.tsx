import React from "react";

type AudioContextValues = {
  playAudio: (url: string, onEnded?: () => void) => void;
  stopAudio: () => void;
};

const AudioContext = React.createContext({} as AudioContextValues);

export function useAudio() {
  return React.useContext(AudioContext);
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  return (
    <AudioContext.Provider
      value={{
        playAudio: (url, onEnded) => {
          audioRef.current = new Audio(url);
          audioRef.current.play();

          if (onEnded) {
            audioRef.current.addEventListener("ended", onEnded);
          }
        },
        stopAudio: () => {
          audioRef.current?.pause();
        },
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}
