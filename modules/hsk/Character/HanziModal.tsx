import { useRouter } from "next/router";
import useSWRImmutable from "swr/immutable";
import * as React from "react";
import { LoadingBar, HSKButton, MarkAsCompleted, preloadHanziDetails, Drawer, url } from "@/components";
import IdHanziMap from "@/data/id-hanzi-map.json";
import { HanziApiResponse } from "./types";
import { HanziDetails } from "./HanziDetails";
import { useCompletedCharacters, useCompletedCharactersActions } from "@/store";
import { LAST_VIEWED_HANZI_KEY } from "@/store/useLastViewedHanzi";
import { useWindowSize } from "@/hooks";
import clsx from "clsx";
import { Level } from "@/data";
import { useAudio } from "@/modules/layout";
import { motion, AnimatePresence } from "framer-motion";

export type IdHanziMapKey = keyof typeof IdHanziMap;

export function HanziModal() {
  const router = useRouter();
  const hanzi = router.query.hanzi as IdHanziMapKey;

  const { width } = useWindowSize();

  React.useEffect(() => {
    const pathname = `/hsk/${router.query.level}?hanzi=${hanzi}&page=${router.query.page}`;
    if (typeof window !== "undefined" && !pathname.includes("undefined")) {
      localStorage.setItem(
        LAST_VIEWED_HANZI_KEY,
        JSON.stringify({
          character: hanzi,
          pathname,
        })
      );
    }
  }, [hanzi, router]);

  const currentLevel = router.query.level as unknown as Level;

  const currentHanziId = IdHanziMap[hanzi];
  const previousHanziId = (parseInt(currentHanziId) - 1).toString() as IdHanziMapKey;
  const nextHanziId = (parseInt(currentHanziId) + 1).toString() as IdHanziMapKey;

  const previousHanzi = currentHanziId == "1" ? undefined : IdHanziMap[previousHanziId];
  const nextHanzi = currentHanziId == "11092" ? undefined : IdHanziMap[nextHanziId];

  const { stopAudio } = useAudio();

  const { data, isLoading } = useSWRImmutable<HanziApiResponse>(
    hanzi ? url(hanzi) : null,
    async (url) => {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    },
    {
      keepPreviousData: true,
    }
  );

  const completedCharacters = useCompletedCharacters();
  const currentCompletedCharacters = data?.definition && !isLoading ? completedCharacters[currentLevel] : null;
  const isCompleted = currentCompletedCharacters && currentCompletedCharacters.includes(currentHanziId);

  const { addCompletedCharacters, removeCompletedCharacters } = useCompletedCharactersActions();

  const isMobile = width < 640;

  return (
    <Drawer
      direction={isMobile ? "bottom" : "right"}
      open={Boolean(hanzi)}
      onOpenChange={(open) => {
        if (!open) {
          if (Boolean(hanzi)) {
            router.back();
          }
          stopAudio();
        }
      }}
    >
      <Drawer.Content
        className={clsx(
          "px-0 pt-4 pb-[72px] flex flex-col",
          isMobile ? "h-[90dvh] left-0" : "h-dvh rounded-none max-w-xl w-full"
        )}
      >
        {data && <HanziDetails currentLevel={currentLevel} currentHanzi={hanzi} {...data} />}

        <div className="absolute top-8 sm:top-4 left-0 right-0 mx-4 bg-gradient-to-b from-black h-6"></div>
        <div className="absolute bottom-14 sm:bottom-12 left-0 right-0 mx-4 bg-gradient-to-t from-black h-12"></div>

        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "tween", duration: 0.2 }}
              className="grid place-items-center absolute inset-0 h-full z-50 bg-black/50"
            >
              {<LoadingBar className="scale-150" visible />}
            </motion.div>
          )}
        </AnimatePresence>

        <MarkAsCompleted
          className="absolute top-12 sm:top-9 right-4 sm:right-8 w-12 h-12"
          checkmarkClassName="w-8 h-8"
          isCompleted={Boolean(isCompleted)}
          onClick={() => {
            console.log(currentLevel, currentHanziId);
            if (isCompleted) {
              removeCompletedCharacters(currentLevel, currentHanziId);
            } else {
              addCompletedCharacters(currentLevel, currentHanziId);
            }
          }}
        />

        <div className="absolute flex gap-2 bottom-0 left-0 right-0 px-3 pb-3 sm:px-4 sm:pb-4">
          <HSKButton
            onMouseEnter={() => {
              if (previousHanzi) preloadHanziDetails(previousHanzi);
            }}
            disabled={!previousHanzi}
            className="flex-1 shadow-none border-zinc text-smokewhite aria-disabled:shadow-none aria-disabled:border-zinc aria-disabled:text-smokewhite/50"
            onClick={() => {
              router.replace(`/hsk/${router.query.level}?hanzi=${previousHanzi}&page=${router.query.page}`, undefined, {
                shallow: true,
              });
            }}
          >
            &#x2190; {previousHanzi}
          </HSKButton>
          <HSKButton
            onMouseEnter={() => {
              if (nextHanzi) preloadHanziDetails(nextHanzi);
            }}
            disabled={!nextHanzi}
            className="flex-1 shadow-none border-zinc text-smokewhite aria-disabled:shadow-none aria-disabled:border-zinc aria-disabled:text-smokewhite/50"
            onClick={() => {
              router.replace(`/hsk/${router.query.level}?hanzi=${nextHanzi}&page=${router.query.page}`, undefined, {
                shallow: true,
              });
            }}
          >
            {nextHanzi} &#x2192;
          </HSKButton>
        </div>
      </Drawer.Content>
    </Drawer>
  );
}
