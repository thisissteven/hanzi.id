import React from "react";

import { cn, PlayingState, useDebounce } from "@/utils";
import clsx from "clsx";
import Image from "next/image";
import { PrevSentenceButton, PlayButton, NextSentenceButton } from "../buttons";
import { SoundWave, TextMarquee } from "@/components";
import { useThrottledClickHandler } from "@/hooks";
import { ScanSearchIcon } from "lucide-react";
import { useRouter } from "next/router";
import useSWRImmutable from "swr/immutable";
import { GetBookByIdResponse } from "@/pages/api/book/[id]";

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
  const router = useRouter();

  const bookId = router.query.id;
  const chapterId = router.query.chapterId;

  const { data } = useSWRImmutable<GetBookByIdResponse>(
    bookId ? `/book/${bookId}` : undefined,
    async (url) => {
      const response = await fetch(`/api/${url}`);
      const data = await response.json();
      return data;
    },
    {
      keepPreviousData: true,
    }
  );

  const source = data?.image?.source;
  const title = data?.title;

  const lastChapterId = React.useRef(chapterId);

  React.useEffect(() => {
    if (chapterId) {
      lastChapterId.current = chapterId;
    }
  }, [chapterId]);

  const chapter = data?.chapters.find((chapter) => chapter.id === lastChapterId.current);

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
    <div className="sticky h-dvh top-0 mx-4 right-0 rounded-lg p-4 grid place-items-center overflow-x-hidden overflow-y-auto">
      <div className="relative mt-24">
        <SoundWave isPlaying={isPlaying} />
        <div className={clsx("flex flex-col items-start gap-4 duration-1000 ease", isPlaying && "opacity-50 blur-sm")}>
          <div className="relative w-56 aspect-[9/12] shrink-0">
            <div
              className={clsx(
                "absolute inset-0 w-full h-full"
                // "dark:shadow-[_0px_10px_140px_rgb(30,77,105,0.6)]"
              )}
              aria-hidden
            ></div>
            <div className="relative rounded-lg overflow-hidden w-full aspect-[9/12] ring-4 ring-blue-400/20">
              {source && (
                <Image src={source} width={430} height={430} alt="cover" className="object-cover w-full h-full" />
              )}
            </div>
          </div>

          <TextMarquee
            title={title}
            subtitle={chapter?.title}
            titleClassName="text-xl font-bold mt-2"
            subtitleClassName="text-[rgb(208,208,208)] text-base mt-1"
            containerClassName="max-w-[224px]"
            gradientClassName="from-black"
          />
        </div>

        <div className="mt-4 relative mx-0.5 bg-black">
          <div className="h-[1.5px] rounded-full bg-white/10"></div>
          <div
            style={{
              width: `${(currentSentenceIdx / (sentences.length - 1)) * 100}%`,
            }}
            className="absolute left-0 top-0 h-[1.5px] rounded-full bg-white duration-200"
          ></div>
        </div>

        <div
          className={cn(
            "pt-4 grid place-items-center grid-cols-3 relative bg-black/50 duration-1000",
            playbackState === "playing" && "backdrop-blur-sm"
          )}
        >
          <PrevSentenceButton disabled={currentSentenceIdx === 0} onClick={() => toSentence(currentSentenceIdx - 1)} />
          <PlayButton isPlaying={playbackState === "playing"} onClick={handlePlayPause} />
          <NextSentenceButton
            disabled={currentSentenceIdx === sentences.length - 1}
            onClick={() => toSentence(currentSentenceIdx + 1)}
          />
          {/* <SelectSpeed onChange={(speed) => {}} /> */}
        </div>

        <button
          className="mt-4 flex items-center justify-center gap-2 w-full py-3 font-medium rounded-md bg-subtle/50 active:bg-hovered duration-200 text-smokewhite"
          onClick={() => {
            if (playbackState === "playing") {
              pause();
            }
            router.push(
              router.asPath + `?sentence=${sentences[currentSentenceIdx]}&sentenceIndex=${currentSentenceIdx}`,
              undefined,
              {
                shallow: true,
              }
            );
          }}
        >
          <ScanSearchIcon size={24} /> View Definition
        </button>
      </div>
    </div>
  );
}
