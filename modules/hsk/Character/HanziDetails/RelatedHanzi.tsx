import React from "react";
import { HanziApiResponse } from "../types";
import { Popover, Drawer, usePreferences } from "@/components";
import clsx from "clsx";
import { useWindowSize } from "@/hooks";

export function RelatedHanzi({ hanzi, related }: { hanzi: string; related: HanziApiResponse["related"] }) {
  const { width } = useWindowSize();
  const isMobile = width < 640;

  const { isSimplified } = usePreferences();

  const regex = new RegExp(`(${hanzi})`);

  if (!related) return null;

  return (
    <Drawer.NestedRoot direction={isMobile ? "bottom" : "right"}>
      <Drawer.Trigger className="pl-4 text-sm underline underline-offset-2">see related</Drawer.Trigger>
      <Drawer.Content className={clsx("pt-4", isMobile ? "h-[90dvh] left-0" : "h-dvh rounded-none max-w-xl w-full")}>
        <div className="relative space-y-2 p-4 max-sm:pb-8 h-full overflow-y-auto scrollbar-none">
          <p className="text-xl font-medium">Related to {hanzi}</p>
          {related.length === 0 && (
            <p>
              Related Hanzi for <span className="text-xl">{hanzi}</span> not found.
            </p>
          )}
          <ul>
            {related.map((phrase, index) => {
              const splitted = isSimplified ? phrase.simplified.split(regex) : phrase.traditional.split(regex);
              return (
                <li key={index} className="list-none">
                  <Popover>
                    <Popover.Trigger className="text-left sm:text-lg font-medium">
                      {splitted.map((part, index) => {
                        if (part === hanzi)
                          return (
                            <span className="text-wheat" key={index}>
                              {hanzi}
                            </span>
                          );
                        return <React.Fragment key={index}>{part}</React.Fragment>;
                      })}
                    </Popover.Trigger>
                    <Popover.Content
                      align="start"
                      className="text-xs sm:text-sm leading-5 text-smokewhite px-2 max-w-[calc(100vw-1rem)] md:max-w-[calc(540px-1rem)]"
                    >
                      <p>{phrase.pinyin}</p>
                    </Popover.Content>
                  </Popover>
                  <p className="text-sm sm:text-base text-lightgray">{phrase.definition}</p>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="absolute top-6 sm:top-0 left-0 right-0 mx-4 bg-gradient-to-b from-black h-6"></div>
        <div className="absolute bottom-0 left-0 right-0 mx-4 bg-gradient-to-t from-black h-6"></div>
      </Drawer.Content>
    </Drawer.NestedRoot>
  );
}
