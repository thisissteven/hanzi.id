import React from "react";

import { PlayingState, useDebounce } from "@/utils";
import clsx from "clsx";
import Image from "next/image";
import { PrevSentenceButton, PlayButton, NextSentenceButton } from "../buttons";
import { SoundWave, TextMarquee } from "@/components";
import { useThrottledClickHandler } from "@/hooks";

export function DesktopBottomBar({
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
  const [handlePlayPause] = useThrottledClickHandler(
    () => {
      if (playbackState === "playing") {
        pause();
      } else {
        play();
      }
    },
    {
      maxClicks: 1,
      throttle: 300,
    }
  );

  const isPlaying = useDebounce(playbackState === "playing", 200);

  return (
    <div className="sticky h-dvh top-0 mx-4 z-50 right-0 rounded-lg p-4 grid place-items-center overflow-x-hidden overflow-y-auto">
      <div className="relative space-y-4">
        <SoundWave isPlaying={isPlaying} />
        <div className={clsx("flex flex-col items-start gap-4 duration-1000 ease", isPlaying && "opacity-50 blur-sm")}>
          <div className="relative w-56 aspect-square shrink-0">
            <div
              className={clsx("absolute inset-0 w-full h-full", "dark:shadow-[_0px_10px_140px_rgb(30,77,105,0.6)]")}
              aria-hidden
            ></div>
            <div className="relative rounded-xl overflow-hidden w-full aspect-square ring-4 ring-blue-400/20">
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

          <TextMarquee
            title="The legend of bees of thousand years ago"
            subtitle="The legend of bees of thousand years ago"
            titleClassName="text-xl font-bold mt-2"
            subtitleClassName="text-[rgb(208,208,208)] text-base mt-1"
            containerClassName="max-w-[224px]"
          />
        </div>

        <div className="relative mx-0.5">
          <div className="h-[1.5px] rounded-full bg-white/10"></div>
          <div
            style={{
              width: `${(currentSentenceIdx / (sentences.length - 1)) * 100}%`,
            }}
            className="absolute left-0 top-0 h-[1.5px] rounded-full bg-white duration-200"
          ></div>
        </div>

        <div className="grid place-items-center grid-cols-3">
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
