import React from "react";
import { DesktopSidebar, LastViewedHanzi } from "@/modules/hsk";
import { Layout } from "./layout";
import { Noto_Sans } from "next/font/google";
import { AnimatePresence } from "framer-motion";
import { ReplaceRouteButton } from "@/components";

type AudioContextValues = {
  playAudio: (url: string, onEnded?: () => void) => void;
  stopAudio: () => void;
};

const AudioContext = React.createContext({} as AudioContextValues);

export function useAudio() {
  return React.useContext(AudioContext);
}

function AudioProvider({ children }: { children: React.ReactNode }) {
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

const notoSans = Noto_Sans({ subsets: ["latin"] });

export function HSKLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout>
      <style jsx global>{`
        :root {
          --font-chinese: ${notoSans.style.fontFamily};
        }
      `}</style>
      <LastViewedHanzi />
      <AudioProvider>
        <AnimatePresence mode="wait">
          <Layout>
            <header className="fixed z-10 top-0 left-0 w-screen h-16 grid place-items-center bg-black">
              <ReplaceRouteButton path="/">
                <div className="mb-[3px]">&#8592;</div> Return
              </ReplaceRouteButton>
            </header>
            <div className="bg-black text-smokewhite">
              <div className="mx-auto max-w-[1440px] flex gap-4">
                <DesktopSidebar />
                {children}
              </div>
            </div>
          </Layout>
        </AnimatePresence>
      </AudioProvider>
    </Layout>
  );
}
