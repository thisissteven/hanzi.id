import React from "react";
import { HanziApiResponse } from "../types";
import { Popover, Drawer } from "@/components";
import { useWindowSize } from "@/hooks";
import clsx from "clsx";

export function ExampleIdioms({ hanzi, idioms }: { hanzi: string; idioms: HanziApiResponse["idioms"] }) {
  const { width } = useWindowSize();
  const isMobile = width < 640;

  const regex = new RegExp(`(${hanzi})`);

  if (!idioms) return null;

  return (
    <Drawer.NestedRoot direction={isMobile ? "bottom" : "right"}>
      <Drawer.Trigger className="pl-2 text-sm underline underline-offset-2">see idioms</Drawer.Trigger>
      <Drawer.Content className={clsx("pt-4", isMobile ? "h-[90dvh] left-0" : "h-dvh rounded-none max-w-xl w-full")}>
        <div className="relative space-y-2 p-4 max-sm:pb-8 h-full overflow-y-auto scrollbar-none">
          <p className="text-xl font-medium">Example idioms of {hanzi}</p>
          {idioms.length === 0 && (
            <p>
              Idioms for <span className="text-xl">{hanzi}</span> not found.
            </p>
          )}
          <ul>
            {idioms.map((idiom, index) => {
              const splitted = idiom.simplified.split(regex);

              return (
                <li key={index} className="list-none">
                  <Popover>
                    <Popover.Trigger className="text-left sm:text-lg font-medium">
                      {splitted.map((part) => {
                        if (part === hanzi)
                          return (
                            <span className="text-wheat" key={part}>
                              {hanzi}
                            </span>
                          );
                        return part;
                      })}
                    </Popover.Trigger>
                    <Popover.Content
                      align="start"
                      className="text-xs sm:text-sm leading-5 text-smokewhite px-2 max-w-[calc(100vw-1rem)] md:max-w-[calc(540px-1rem)]"
                    >
                      <p>{idiom.pinyin}</p>
                    </Popover.Content>
                  </Popover>
                  <p className="text-sm sm:text-base text-lightgray">{idiom.definition}</p>
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
