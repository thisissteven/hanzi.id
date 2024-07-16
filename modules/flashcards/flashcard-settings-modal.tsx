import { RouteDialog } from "@/components";
import { useRouter } from "next/router";
import React from "react";
import { SelectButton } from "../typing-test";
import { useLocale } from "@/locales/use-locale";
import { cn } from "@/utils";
import { Flashcard } from "../layout";
import { LucideBookType, LucidePencil } from "lucide-react";

const numOfCardsOptions = [5, 10, 15, 20, 30, 40, 50, 75, 100, 200, Infinity] as const;

export function FlashcardSettingsModal({ flashcard }: { flashcard: Flashcard }) {
  const router = useRouter();
  const open = Boolean(router.query.review);

  const { words, chapter } = flashcard;

  const { t } = useLocale();

  const [numOfCards, setNumOfCards] = React.useState(Infinity);
  const [selectedCategory, setSelectedCategory] = React.useState(t.random);
  const [reviewMode, setReviewMode] = React.useState(0);

  const options = React.useMemo(
    () => numOfCardsOptions.filter((value) => value <= words.length || value === Infinity),
    [words.length]
  );

  const cardCategories = React.useMemo(() => {
    const categories = [];
    for (let i = 0; i < words.length; i += numOfCards) {
      const start = i + 1;
      const end = Math.min(i + numOfCards, words.length);
      categories.push(`${start}-${end}`);
    }
    setSelectedCategory(t.random);
    return [t.random, ...categories];
  }, [numOfCards, t.random, words.length]);

  return (
    <RouteDialog open={open} onClose={() => router.back()} withoutOkButton>
      <div className="space-y-8">
        <div className="space-y-2">
          <p className="text-center font-medium">{t.reviewMode}</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {[0, 1].map((mode, index) => {
              return (
                <SelectButton
                  key={index}
                  className={cn(
                    reviewMode === mode ? "text-emerald-500" : "emerald-50",
                    "flex items-center justify-center gap-2"
                  )}
                  onClick={() => {
                    setReviewMode(mode);
                  }}
                >
                  {mode === 0 ? <LucideBookType size={18} /> : <LucidePencil size={18} />}
                  {t.reviewModes[mode]}
                </SelectButton>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-center font-medium">{t.numOfCards}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {options.map((value) => {
              return (
                <SelectButton
                  key={value}
                  className={cn(numOfCards === value ? "text-amber-500" : "opacity-50")}
                  onClick={() => {
                    setNumOfCards(value);
                  }}
                >
                  {value === Infinity ? t.all : value}
                </SelectButton>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-center font-medium">{t.cardNumbers}</p>
          <div className="grid grid-cols-2 gap-2">
            {cardCategories.map((category, index) => {
              return (
                <SelectButton
                  key={index}
                  className={cn(category === selectedCategory ? "text-sky-500" : "sky-50")}
                  onClick={() => {
                    setSelectedCategory(category);
                  }}
                >
                  {category}
                </SelectButton>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end bg-softblack">
          <button
            onClick={() => {
              if (reviewMode === 0) {
                router.replace(
                  `/flashcards/review?category=${selectedCategory}&numOfCards=${numOfCards}&chapter=${chapter}`
                );
              } else {
                const text = (function () {
                  if (selectedCategory === "Random") {
                    const sorted = words.sort(() => Math.random() - 0.5).slice(0, Number(numOfCards));
                    return sorted;
                  }

                  const [start, end] = selectedCategory.split("-").map(Number);
                  const toReturn = words.slice(start - 1, end);
                  return toReturn;
                })();
                router.replace(`/tools/hanzi-writer?text=${text.join("")}`);
              }
            }}
            className="block rounded-md font-medium duration-200 bg-hovered active:bg-subtle px-4 py-2"
          >
            {t.continue} &#x2192;
          </button>
        </div>
      </div>
    </RouteDialog>
  );
}
