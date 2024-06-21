import React from "react";
import { PrevSentenceButton } from "./buttons/prev-sentence-button";
import { PlayButton } from "./buttons/play-button";
import { NextSentenceButton } from "./buttons/next-sentence-button";
import { PlayingState, useDebounce } from "@/utils";
import clsx from "clsx";
import Image from "next/image";

export function BottomBar({
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
    <div className="sticky h-dvh top-0 mx-8 z-50 right-0 rounded-lg p-4 grid place-items-center">
      <div>
        <div className={clsx("flex flex-col items-center gap-4 duration-1000 ease", isPlaying && "opacity-50")}>
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
            <div className="mt-4 inline-flex text-xs items-center rounded-full backdrop-blur-sm bg-blue-500/10 dark:bg-blue-400/10 px-2 py-1 font-medium text-blue-500 dark:text-blue-400 ring-1 ring-inset ring-blue-500/20 dark:ring-blue-400/20">
              1 chapter
            </div>
          </div>
        </div>

        <div className="mt-8 grid place-items-center grid-cols-3">
          <PrevSentenceButton disabled={currentSentenceIdx === 0} onClick={() => toSentence(currentSentenceIdx - 1)} />
          <PlayButton isPlaying={playbackState === "playing"} onClick={handlePlayPause} />
          <NextSentenceButton
            disabled={currentSentenceIdx === sentences.length - 1}
            onClick={() => toSentence(currentSentenceIdx + 1)}
          />
          {/* <SelectSpeed onChange={(speed) => {}} /> */}
        </div>
      </div>
    </div>
  );
}
