import React from "react";

import { PlayingState } from "@/utils";
import Image from "next/image";
import { MobilePlayButton, NextSentenceButton, PrevSentenceButton } from "../buttons";
import { SoundWaveMobile, TextMarquee } from "@/components";
import { useThrottledClickHandler } from "@/hooks";
import useSWRImmutable from "swr/immutable";
import { GetBookByIdResponse } from "@/pages/api/book/[id]";
import { useRouter } from "next/router";
import { useBookDetails } from "@/pages/read/[id]";

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
  const router = useRouter();

  const bookId = router.query.id as string;
  const chapterId = router.query.chapterId;

  const { data } = useBookDetails(bookId);

  const source = data?.image?.smallUrl;
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

  return (
    <div className="fixed bottom-2 px-2 w-full">
      <div className="bg-subtle/50 backdrop-blur-md h-16 rounded-lg w-full p-2 pb-2.5 duration-200 overflow-hidden">
        <div className="flex h-full items-center gap-3">
          <div className="relative shrink-0 rounded overflow-hidden h-full aspect-square ring-4 ring-subtle/20">
            {source && <Image src={source} width={92} height={92} alt="cover" className="object-cover w-full h-full" />}
            <SoundWaveMobile isPlaying={playbackState === "playing"} />
          </div>

          <TextMarquee title={title} subtitle={chapter?.title} />

          <div className="grid place-items-center grid-cols-3 min-w-32">
            <PrevSentenceButton
              disabled={currentSentenceIdx === 0}
              onClick={() => toSentence(currentSentenceIdx - 1)}
            />

            <MobilePlayButton isPlaying={playbackState === "playing"} onClick={handlePlayPause} />

            <NextSentenceButton
              disabled={currentSentenceIdx === sentences.length - 1}
              onClick={() => toSentence(currentSentenceIdx + 1)}
            />
          </div>
        </div>

        <div className="relative mt-2 -ml-2">
          <div className="h-[1.5px] rounded-full bg-white/20 w-[calc(100%+1rem)]"></div>
          <div
            style={{
              width: `${(currentSentenceIdx / (sentences.length - 1)) * 100}%`,
            }}
            className="absolute left-0 top-0 h-[1.5px] rounded-full bg-white duration-200"
          ></div>
        </div>
      </div>
    </div>
  );
}
