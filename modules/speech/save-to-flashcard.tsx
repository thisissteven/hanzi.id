import { cn } from "@/utils";
import { AnimatePresence, motion } from "framer-motion";
import { CircleCheckIcon, CirclePlusIcon } from "lucide-react";
import React from "react";
import { useReading } from "../layout";

export function SaveToFlashcard({ word }: { word?: string }) {
  const { flashcard, addToFlashcard, removeFromFlashcard } = useReading();

  if (!word) return null;

  const isSaved = flashcard.includes(word);
  const Icon = isSaved ? CircleCheckIcon : CirclePlusIcon;
  return (
    <button
      type="button"
      className="group relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-200 active:bg-hovered"
      onClick={() => {
        if (isSaved) {
          removeFromFlashcard(word);
        } else {
          addToFlashcard(word);
        }
      }}
      aria-label={isSaved ? "remove from flashcard" : "save to flashcard"}
    >
      <div className="absolute -inset-3 md:hidden" />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isSaved.toString()}
          initial={{
            scale: 0.9,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          exit={{
            scale: 0.9,
            opacity: 0,
          }}
          transition={{
            duration: 0.15,
          }}
          className="flex items-center justify-center w-full h-full"
        >
          <Icon strokeWidth={1.5} className={cn("h-7 w-7 duration-200", isSaved ? "text-sky-400" : "")} />
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
