import React from "react";

import { PlayingState, useDebounce } from "@/utils";
import clsx from "clsx";
import Image from "next/image";
import { PlayButton } from "../buttons";

export function MobileBottomBar({
  currentSentenceIdx,
  toSentence,
  playbackState,
  play,
  pause,
  sentences,
}: {
  currentSentenceIdx: number;
  toSentence: (index: number) => void;
  playbackState: PlayingState;
  play: () => void;
  pause: () => void;
  sentences: string[];
}) {
  const handlePlayPause = () => {
    if (playbackState === "playing") {
      pause();
    } else {
      play();
    }
  };

  const isPlaying = useDebounce(playbackState === "playing", 200);

  return (
    <div className="sticky h-dvh top-0 mx-4 md:mx-8 z-50 right-0 rounded-lg p-4 grid place-items-center">
      <div>
        <div className={clsx("flex flex-col items-center gap-4 duration-1000 ease", isPlaying && "opacity-50 blur-sm")}>
          <div className="relative w-56 aspect-square shrink-0">
            <div
              className={clsx("absolute inset-0 w-full h-full", "dark:shadow-[_0px_10px_140px_rgb(30,77,105,0.8)]")}
              aria-hidden
            ></div>
            <div className="relative rounded-xl overflow-hidden w-full h-full ring-4 ring-blue-400/20">
              <Image
                src={
                  "https://res.cloudinary.com/drjgq6umm/image/upload/c_limit,w_430/dpr_2.0/v1718698982/uploads/focus-web-app/poster_rm1k6w.png"
                }
                width={430}
                height={430}
                alt="cover"
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold mt-2">Their Side</h1>
            <p className="mt-2 text-[rgb(208,208,208)">Chapter 1 - Aliens</p>
          </div>
        </div>

        <div className="mt-4 grid place-items-center grid-cols-3">
          <PlayButton isPlaying={playbackState === "playing"} onClick={handlePlayPause} />
        </div>
      </div>
    </div>
  );
}
