import { ChineseCharacter } from "@/data";
import { cn } from "@/utils/cn";
import clsx from "clsx";
import { LucideCheckCircle } from "lucide-react";
import Link from "next/link";
import React from "react";
import { preload } from "swr";

export type Locale = "en" | "id";

export const url = (hanzi: string, locale: Locale) => `https://content.hanzi.id/character/${locale}/${hanzi}.json`;

export async function preloadHanziDetails(hanzi: string, locale: Locale) {
  await preload(url(hanzi, locale), async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  });
}

export function CharacterCard({
  id,
  character,
  pinyin,
  translations,
  isFlipped,
  isCompleted,
  hanziHref,
  locale,
  onFlip,
  onCompleteToggle,
}: ChineseCharacter & {
  character: string;
  hanziHref: string;
  isCompleted: boolean;
  onCompleteToggle: () => void;
  onFlip: () => void;
  locale: Locale;
  isFlipped: boolean;
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
      <div
        onClick={onFlip}
        className={clsx("select-none text-4xl aspect-square", isCompleted ? "text-smokewhite" : "text-lightgray")}
      >
        <div className={clsx("relative w-full h-full card", isFlipped && "card-flipped")}>
          <div
            className={clsx(
              "card-content has-[input:active]:scale-[98%] transition absolute inset-0 border-b-[1.5px] grid place-items-center bg-softblack border-secondary/10"
            )}
          >
            <span className="font-medium">{character}</span>

            <MarkAsCompleted
              className={isCompleted ? "bg-transparent" : ""}
              isCompleted={isCompleted}
              onClick={onCompleteToggle}
            />

            <div
              className={clsx(
                "absolute top-2 right-2 transition p-2 rounded-md",
                !isCompleted ? "text-lightgray/50 active:bg-zinc" : "active:bg-mossgreen/10"
              )}
            >
              <Link
                onMouseEnter={() => preloadHanziDetails(character, locale)}
                onClick={(e) => e.stopPropagation()}
                href={hanziHref}
                shallow
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              </Link>
            </div>

            <div className="absolute left-4 top-4 text-sm">{id}</div>
          </div>
          <div
            className={clsx(
              "card-content absolute inset-0 border-b-[1.5px] bg-softblack flex flex-col items-center justify-center text-flipped px-4 border-secondary/10"
            )}
          >
            <div className="text-3xl">{pinyin}</div>
            <div className="text-lg text-center">{translations.join(", ")}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export function MarkAsCompleted({
  className,
  checkmarkClassName,
  isCompleted,
  onClick,
}: {
  className?: string;
  checkmarkClassName?: string;
  isCompleted: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "absolute right-2 bottom-2 w-10 h-10 grid place-items-center transition active:scale-95 hover:opacity-100 rounded-md text-sm active:bg-mossgreen/10",
        isCompleted && "bg-sky-500/10",
        className
      )}
    >
      <input
        checked={isCompleted}
        onChange={onClick}
        type="checkbox"
        className="peer absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <Checkmark className={checkmarkClassName} />
    </div>
  );
}

export function Checkmark({ className }: { className?: string }) {
  return (
    <LucideCheckCircle
      className={cn(
        "h-6 w-6 text-smokewhite/20 peer-active:text-sky-500/50 peer-checked:text-sky-500/90 transition pointer-events-none",
        className
      )}
    />
  );
}
