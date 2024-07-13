import clsx from "clsx";
import React from "react";

export type Locale = "en" | "id";

export function CharacterCard({
  id,
  character,
  pinyin,
  translations,
  isFlipped,
  className,
}: {
  id: number;
  character: string;
  translations: string;
  pinyin: string;
  isFlipped: boolean;
  className: string;
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
      <div className={clsx("select-none text-4xl aspect-square text-smokewhite duration-200", className)}>
        <div className={clsx("relative w-full h-full card", isFlipped && "card-flipped")}>
          <div
            className={clsx(
              "card-content has-[input:active]:scale-[98%] transition absolute inset-0 border-b-4 grid place-items-center bg-softblack border-secondary/10 rounded-lg overflow-hidden"
            )}
          >
            <span className="font-medium">{character}</span>

            <div className="absolute left-4 top-4 text-sm">{id}</div>
          </div>
          <div
            className={clsx(
              "card-content absolute inset-0 border-b-4 bg-softblack flex flex-col items-center justify-center text-flipped px-4 border-secondary/10 rounded-lg overflow-hidden"
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
