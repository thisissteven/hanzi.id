import { usePreferences, VirtualizedList } from "@/components";
import { useLocale } from "@/locales/use-locale";
import { FlashcardedResult } from "@/pages/api/flashcard/en";
import { cn } from "@/utils";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { ChevronRightIcon } from "lucide-react";
import React from "react";

export function VirtualizedCards({
  cards,
  onCardClick,
}: {
  cards: FlashcardedResult[];
  onCardClick: (card: FlashcardedResult) => void;
}) {
  const { isSimplified } = usePreferences();
  const { t } = useLocale();

  const virtualizer = useWindowVirtualizer({
    count: cards.length,
    estimateSize: () => 92,
    overscan: 5,
  });

  return (
    <ul className="mt-4 border-t border-t-secondary/10 grid">
      <VirtualizedList virtualizer={virtualizer}>
        {(items, virtualizer) => {
          if (!cards) return null;

          return items.map((item) => {
            const index = item.index;
            const card = cards[index];

            if (!card.entries || card.entries.length === 0)
              return (
                <div key={item.key} className="h-[92px]">
                  -
                </div>
              );

            const pinyin = card.entries.map((entry) => entry.pinyin).join("/");
            const translations = card.entries[0].english.join(", ");

            return (
              <VirtualizedList.Item key={item.key} virtualizer={virtualizer} item={item}>
                <li className="h-full flex items-center border-b border-b-secondary/10">
                  <button
                    onClick={() => onCardClick(card)}
                    className="text-left w-full md:hover:bg-hovered active:bg-hovered duration-200 flex items-center justify-between pr-3 sm:pr-2"
                  >
                    <div className="relative group transition select-none w-full">
                      <div
                        className={cn(
                          "pl-3 pr-4 pt-8 pb-3 flex gap-2 items-center",
                          card?.simplified.length > 4 && "max-md:flex-col max-md:items-start"
                        )}
                      >
                        <div className="shrink-0 font-medium text-4xl">
                          {isSimplified ? card?.simplified : card?.traditional}
                        </div>

                        <div className="overflow-x-hidden flex-1 w-full">
                          <div className="font-medium text-smokewhite">{pinyin ?? t.loading}</div>
                          <div className="line-clamp-1 max-w-[95%] text-secondary">{translations ?? t.loading}</div>
                        </div>

                        <div className="absolute left-4 top-3 text-xs text-secondary">{index + 1}</div>
                      </div>
                    </div>

                    <ChevronRightIcon className="h-5 w-5 shrink-0 flex-none text-secondary/50" aria-hidden="true" />
                  </button>
                </li>
              </VirtualizedList.Item>
            );
          });
        }}
      </VirtualizedList>
    </ul>
  );
}
