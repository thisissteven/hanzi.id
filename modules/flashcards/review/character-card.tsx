import React from "react";
import { CardStatus } from "./content";
import { cn } from "@/utils";

export type Locale = "en" | "id";

export function CharacterCard({
  id,
  character,
  pinyin,
  translations,
  isFlipped,
  className,
  status,
}: {
  id: number;
  character: string;
  translations: string;
  pinyin: string;
  isFlipped: boolean;
  className: string;
  status: CardStatus;
}) {
  return (
    <>
      <style jsx>{`
        .card {
          transition: transform 0.5s;
          transform-style: preserve-3d;
        }

        .card-flipped {
          transform: rotateY(180deg);
        }

        .card-content {
          -webkit-backface-visibility: hidden; /* Safari */
          backface-visibility: hidden;
        }

        .text-flipped {
          transform: rotateY(180deg);
        }
      `}</style>
      <div className={cn("select-none aspect-square text-smokewhite duration-200", className)}>
        <div className={cn("relative w-full h-full card", isFlipped && "card-flipped")}>
          <div
            className={cn(
              "card-content has-[input:active]:scale-[98%] transition absolute inset-0 border-b-4 grid place-items-center bg-softblack border-secondary/10 rounded-lg overflow-hidden"
            )}
          >
            <span className="font-medium text-4xl sm:text-5xl">{character}</span>

            <div className="absolute left-4 top-4 text-sm">{id}</div>

            <div className="absolute right-4 top-4 text-sm">
              <span
                className={cn(
                  "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset duration-200",
                  status === "wrong" && "bg-red-400/10 text-red-400 ring-red-400/20",
                  status === "correct" && "bg-emerald-400/10 text-emerald-400 ring-emerald-400/20",
                  status === "untouched" && "opacity-0"
                )}
              >
                {status}
              </span>
            </div>
          </div>
          <div
            className={cn(
              "card-content absolute inset-0 border-b-4 bg-softblack flex flex-col items-center justify-center text-flipped px-4 border-secondary/10 rounded-lg overflow-hidden text-center"
            )}
          >
            <div className="text-3xl">{pinyin}</div>
            <div className="mt-2 text-lg text-center leading-6">{translations}</div>
          </div>
        </div>
      </div>
    </>
  );
}
