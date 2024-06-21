import React from "react";

import { PlayingState } from "@/utils";

import { useWindowSize } from "@/hooks";
import { MobileBottomBar } from "./mobile-bottom-bar";
import { DesktopBottomBar } from "./desktop-bottom-bar";

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
  const { width } = useWindowSize();

  if (width < 810) {
    return (
      <MobileBottomBar
        currentSentenceIdx={currentSentenceIdx}
        toSentence={toSentence}
        playbackState={playbackState}
        play={play}
        pause={pause}
        sentences={sentences}
      />
    );
  }

  return (
    <DesktopBottomBar
      currentSentenceIdx={currentSentenceIdx}
      toSentence={toSentence}
      playbackState={playbackState}
      play={play}
      pause={pause}
      sentences={sentences}
    />
  );
}
