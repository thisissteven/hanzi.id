"use client";

import { formatTime } from "../../../utils/transcripts";
import { getColorClass, getFreqRangeLabel, getTransliteration } from "../../components/utils";
import { freqColorMap, posColorMap } from "../../components/constants";
import { JSX, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSubtitleSettings } from "../../provider/subtitle-settings";
import { useParsedSubsData } from "../hook";
import { useDictEntry } from "../../provider/dict-entry";
import { useSearchParams } from "next/navigation";
import { LockWindowScroll } from "./lock-window-scroll";
import { CopyButton } from "./copy-button";
import { Button } from "@/components";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs";
import { cn } from "@/utils";

type SubtitleTabsProps = {
  getCurrentTime: () => number | null;
  onTimestampClick: (timestamp: number) => void;
  setPlaying: (playing: boolean) => void;
};

function OpenDictEntry({
  children,
}: {
  children: (update: (value: string, token: string) => void) => ReactNode;
}): JSX.Element | null {
  const { setDictParams, setDrawerOpen, setToken } = useDictEntry();
  return (
    <>
      {children((value, token) => {
        setDictParams(value);
        setToken(token);
        setDrawerOpen(true);
      })}
    </>
  );
}
export function SubtitleTabs({ getCurrentTime, onTimestampClick, setPlaying }: SubtitleTabsProps) {
  const subtitleWrapperRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);

  const { subsData, subsTranslations, isLoading, isError, colorBy, colorMode, showPinyin, showTranslation } =
    useSubtitleSettings();

  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") ?? "es";

  const useUnderline = colorMode === "underline";

  const { ranges, categorizedGroups, subtitles } = useParsedSubsData(subsData);

  const [activeIndex, setActiveIndex] = useState(0);

  const memoizedSubtitles = useMemo(() => {
    return subtitles.map((subtitle) => {
      return {
        start: subtitle.begin / 1000,
        end: subtitle.end / 1000,
      };
    });
  }, [subtitles]);

  const memoizedCategorizedGroups = useMemo(() => {
    return Object.entries(categorizedGroups).sort(([rangeA], [rangeB]) => {
      const startA = parseInt(rangeA.split("-")[0]) || 0;
      const startB = parseInt(rangeB.split("-")[0]) || 0;
      return startA - startB;
    });
  }, [categorizedGroups]);

  const scrollToCurrent = useCallback(() => {
    const activeEl = activeRef.current;
    const wrapper = subtitleWrapperRef.current;

    const isMobile = window.innerWidth < 768;

    if (activeEl && wrapper) {
      const verticalOffsetRatio = isMobile ? 0.1 : 0.25; // 0 = top, 0.5 = center, 1 = bottom

      const scrollTopOffset =
        activeEl.offsetTop - (isMobile ? wrapper.offsetTop : 0) - wrapper.clientHeight * verticalOffsetRatio;

      wrapper.scrollTo({
        top: scrollTopOffset,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    scrollToCurrent();
  }, [activeIndex, scrollToCurrent]);

  useEffect(() => {
    const interval = setInterval(() => {
      const seconds = getCurrentTime();

      if (!seconds) return;

      const OFFSET = 0.3;

      const activeIndex = memoizedSubtitles.findIndex((subtitle) => {
        return seconds + OFFSET >= subtitle.start && seconds + OFFSET < subtitle.end;
      });

      if (activeIndex != -1) {
        setActiveIndex(activeIndex);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [getCurrentTime, memoizedSubtitles]);

  return (
    <Tabs className="h-full" defaultValue="transcripts">
      <TabsList className="relative pt-4 max-sm:px-0 max-xl:px-2">
        <TabsTrigger value="transcripts" onClick={() => scrollToCurrent()}>
          Transcripts
        </TabsTrigger>
        <TabsTrigger value="words">Words</TabsTrigger>

        <LockWindowScroll />
      </TabsList>

      <div className="relative h-full">
        {/* Transcripts */}
        <TabsContent
          value="transcripts"
          ref={subtitleWrapperRef}
          className="h-full max-h-[calc(100%-48px)] overflow-y-auto scrollbar xl:space-y-4 sm:max-xl:px-2 pt-2 xl:pr-4 pb-4"
        >
          {subtitles.map((sub, i) => (
            <div
              key={i}
              ref={i === activeIndex ? activeRef : null}
              className={cn(
                "relative subtitle p-2 xl:rounded cursor-pointer transition-colors",
                i === activeIndex
                  ? "bg-blue-50 dark:bg-blue-800/30"
                  : "hover:bg-gray-200 dark:hover:bg-gray-800 opacity-50"
              )}
            >
              <CopyButton text={`${sub.text}\n${subsTranslations?.[i]}`} />
              <button
                onClick={() => onTimestampClick(sub.begin)}
                className="text-sm text-blue-300 active:text-blue-400"
              >
                {formatTime(sub.begin)}
              </button>

              {/* Tokens */}
              <div className="text-xl flex flex-wrap gap-1 pr-8">
                {sub.tokens.map((token, j: number) => {
                  const key = colorBy === "pos" ? token.pos : getFreqRangeLabel(token.freq, ranges) ?? "unknown";
                  const colorClass = getColorClass(key, useUnderline, colorBy === "pos" ? posColorMap : freqColorMap);

                  const transliteration = getTransliteration(token);

                  return (
                    <OpenDictEntry key={j}>
                      {(update) => (
                        <div
                          onClick={() => {
                            setPlaying(false);
                            update(`${token.form.text},${token.pos},${lang}`, `${token.form.text},${transliteration}`);
                          }}
                          className="flex flex-col items-center"
                        >
                          {showPinyin && (
                            <span className="text-xs text-gray-500 dark:text-gray-300">{transliteration}</span>
                          )}
                          <span className={cn(colorClass, colorBy === "none" && "text-gray-700")}>
                            {token.form.text}
                          </span>
                        </div>
                      )}
                    </OpenDictEntry>
                  );
                })}
              </div>

              {/* Translation */}
              {showTranslation && subsTranslations && (
                <p className="text-sm text-gray-400 dark:text-gray-400 italic mt-1">{subsTranslations[i]}</p>
              )}
            </div>
          ))}
          {isLoading && <p className="mt-2">Transcripts will show here.</p>}
          {isError && <p className="mt-2 text-red-500">Failed to fetch transcripts.</p>}
        </TabsContent>

        {/* Words */}
        <TabsContent
          value="words"
          className="h-full mt-0 max-h-[calc(100%-48px)] overflow-y-auto scrollbar xl:space-y-4 sm:max-xl:px-2 pt-2 xl:pr-4 pb-4"
        >
          {memoizedCategorizedGroups.map(([range, tokens]) => (
            <div key={range}>
              <p className="text-base">{range}</p>
              <div className="flex flex-wrap gap-2 mt-2 text-xl">
                {tokens.map((token, idx) => {
                  const key = colorBy === "pos" ? token.pos : range;
                  const colorClass = getColorClass(key, useUnderline, colorBy === "pos" ? posColorMap : freqColorMap);

                  const transliteration = getTransliteration(token);

                  return (
                    <OpenDictEntry key={idx}>
                      {(update) => (
                        <div
                          onClick={() => {
                            setPlaying(false);
                            update(`${token.form.text},${token.pos},${lang}`, `${token.form.text},${transliteration}`);
                          }}
                          className="py-1 flex flex-col items-center cursor-pointer"
                        >
                          {showPinyin && (
                            <span className="text-xs text-gray-500 dark:text-gray-300">{transliteration}</span>
                          )}
                          <span
                            key={idx}
                            className={cn("px-2 xl:rounded", colorClass, colorBy === "none" && "text-gray-700")}
                          >
                            {token.form.text}
                          </span>
                        </div>
                      )}
                    </OpenDictEntry>
                  );
                })}
              </div>
            </div>
          ))}
          {isLoading && <p className="mt-2">Vocabularies categorized by levels will show here.</p>}
          {isError && <p className="mt-2 text-red-500">Failed to fetch vocabularies.</p>}
        </TabsContent>
      </div>
    </Tabs>
  );
}
