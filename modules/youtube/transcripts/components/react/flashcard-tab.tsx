"use client";

import { memo, useMemo, useState } from "react";
import useSWRImmutable from "swr/immutable";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { useSubtitleSettings } from "../../provider/subtitle-settings";
import { useDictEntryActions } from "../../provider/dict-entry";
import { usePersistedState } from "../../../hooks/usePersistedState";
import { useParsedSubsData } from "../hook";
import type { Token } from "../types";
import { getTransliteration } from "../utils";
import { usePreferences } from "@/components";
import { useLocale } from "@/locales/use-locale";
import { CharacterCard } from "@/modules/flashcards/review/character-card";
import type { FlashcardedResult } from "@/pages/api/flashcard/en";
import {
  LucideCheck,
  LucideChevronLeft,
  LucideChevronRight,
  LucideChevronsUpDown,
  LucideColumns2,
  LucideEye,
  LucideEyeOff,
} from "lucide-react";

const WORD_COUNT_OPTIONS = [5, 10, 20, 50, 100, 250, Infinity] as const;

type FlashcardRow = {
  card: FlashcardedResult;
  token?: Token;
};

function ConfigDropdown<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
}) {
  const [open, setOpen] = useState(false);

  const selected = options.find((option) => option.value === value);

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          aria-label={label}
          className="flex w-full min-w-0 items-center justify-between gap-2 rounded-md border border-border bg-black px-3 py-2 text-sm text-white duration-200 hover:bg-hovered"
        >
          <span className="truncate text-secondary">{label}</span>
          <span className="truncate">{selected?.label ?? "-"}</span>
          <LucideChevronsUpDown className="size-4 shrink-0 text-secondary" />
        </button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          side="bottom"
          align="start"
          sideOffset={4}
          collisionPadding={8}
          className="z-[999] max-h-72 min-w-[var(--radix-popover-trigger-width)] overflow-y-auto scrollbar rounded-md border border-border bg-black p-1 shadow-xl"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between gap-2 rounded-sm px-3 py-2 text-left text-sm text-white duration-200 hover:bg-hovered active:bg-hovered"
            >
              <span className="truncate">{option.label}</span>
              {option.value === value && <LucideCheck className="size-4 shrink-0 text-emerald-500" />}
            </button>
          ))}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

export const FlashcardTab = memo(function FlashcardTab({
  setPlaying,
}: {
  setPlaying: (playing: boolean) => void;
}) {
  const { subsData, isLoading: isLoadingSubs, lang } = useSubtitleSettings();
  const { ranges, categorizedGroups } = useParsedSubsData(subsData);

  const { setDictParams, setDrawerOpen, setToken } = useDictEntryActions();

  const { isSimplified } = usePreferences();
  const { t, locale } = useLocale();

  const levels = useMemo(
    () => ranges.filter((range) => (categorizedGroups[range.label]?.length ?? 0) > 0),
    [ranges, categorizedGroups]
  );

  const [selectedLevel, setSelectedLevel] = usePersistedState<string>("yt_flashcard_level", "");
  const [storedWordCount, setStoredWordCount] = usePersistedState<number | null>("yt_flashcard_word_count", 10);

  const wordCount = storedWordCount === null ? Infinity : storedWordCount;

  const [reviewing, setReviewing] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const activeLevel = levels.some((level) => level.label === selectedLevel)
    ? selectedLevel
    : levels[0]?.label;

  const selectedTokens = useMemo(() => {
    if (!activeLevel) return [];

    const tokens = categorizedGroups[activeLevel] ?? [];
    const limit = wordCount === Infinity ? tokens.length : wordCount;

    return tokens.slice(0, limit);
  }, [activeLevel, categorizedGroups, wordCount]);

  const words = useMemo(() => selectedTokens.map((token) => token.form.text), [selectedTokens]);

  const { data, isLoading: isLoadingFlashcards } = useSWRImmutable<FlashcardedResult[]>(
    words.length > 0 ? `flashcard/${locale}?text=${words.join("-")}` : undefined,
    async (url: string) => {
      const response = await fetch(`/api/${url}`);
      return response.json();
    }
  );

  const rows = useMemo<FlashcardRow[]>(() => {
    return (data ?? [])
      .map((card, index) => ({ card, token: selectedTokens[index] }))
      .filter(({ card }) => card.entries && card.entries.length > 0);
  }, [data, selectedTokens]);

  const currentRow = rows[reviewIndex];

  const resetReview = () => {
    setReviewing(false);
    setReviewIndex(0);
    setFlipped(false);
  };

  const openDictEntry = (row: FlashcardRow) => {
    const { token } = row;
    if (!token) return;

    setPlaying(false);
    setDictParams(`${token.form.text},${token.pos},${lang}`);
    setToken(`${token.form.text},${getTransliteration(token)}`);
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      {reviewing && currentRow ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={resetReview}
              className="flex items-center gap-1 text-sm text-secondary duration-200 active:text-smokewhite"
            >
              <LucideChevronLeft className="h-4 w-4" /> Back to list
            </button>
            <p className="text-xs text-secondary">
              {reviewIndex + 1} / {rows.length}
            </p>
          </div>

          <div className="max-w-72 mx-auto cursor-pointer" onClick={() => setFlipped((value) => !value)}>
            <CharacterCard
              index={reviewIndex}
              character={isSimplified ? currentRow.card.simplified : currentRow.card.traditional}
              pinyin={currentRow.card.entries?.map((entry) => entry.pinyin).join("/") ?? ""}
              translations={currentRow.card.entries?.[0]?.english.join(", ") ?? ""}
              className=""
              status="untouched"
              isFlipped={flipped}
            />
          </div>

          <div className="flex gap-2 max-w-72 mx-auto">
            <button
              disabled={reviewIndex === 0}
              onClick={() => {
                setFlipped(false);
                setReviewIndex((index) => Math.max(0, index - 1));
              }}
              className="flex-1 grid place-items-center rounded-md bg-subtle/50 border-b-2 border-secondary/10 p-2 duration-200 active:bg-hovered disabled:opacity-50 disabled:pointer-events-none"
            >
              <LucideChevronLeft />
            </button>

            <button
              onClick={() => setFlipped((value) => !value)}
              className="grid place-items-center rounded-md bg-sky-400/10 text-sky-400 border-b-2 border-sky-400/20 p-2 duration-200 active:bg-sky-400/20 flex-1"
            >
              {flipped ? <LucideEyeOff /> : <LucideEye />}
            </button>

            <button
              disabled={reviewIndex === rows.length - 1}
              onClick={() => {
                setFlipped(false);
                setReviewIndex((index) => Math.min(rows.length - 1, index + 1));
              }}
              className="flex-1 grid place-items-center rounded-md bg-subtle/50 border-b-2 border-secondary/10 p-2 duration-200 active:bg-hovered disabled:opacity-50 disabled:pointer-events-none"
            >
              <LucideChevronRight />
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <div className="min-w-28 flex-1">
              <ConfigDropdown
                label="Level"
                value={activeLevel ?? ""}
                options={levels.map((level) => ({ value: level.label, label: level.label }))}
                onChange={(value) => {
                  setSelectedLevel(value);
                  resetReview();
                }}
              />
            </div>

            <div className="min-w-24 flex-1">
              <ConfigDropdown
                label="Cards"
                value={wordCount}
                options={WORD_COUNT_OPTIONS.map((value) => ({
                  value,
                  label: value === Infinity ? t.all : String(value),
                }))}
                onChange={(value) => {
                  setStoredWordCount(value);
                  resetReview();
                }}
              />
            </div>

            {!isLoadingFlashcards && rows.length > 0 && (
              <button
                onClick={() => {
                  setReviewIndex(0);
                  setFlipped(false);
                  setReviewing(true);
                }}
                className="ml-auto flex shrink-0 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-white duration-200 bg-emerald-600 active:bg-emerald-700"
              >
                {t.review} <LucideColumns2 size={16} />
              </button>
            )}
          </div>

          {isLoadingSubs ? (
            <p className="text-sm text-secondary">{t.loading}</p>
          ) : levels.length === 0 ? (
            <p className="text-sm text-secondary">No vocabulary levels available for this video.</p>
          ) : null}

          {isLoadingFlashcards && <p className="text-sm text-secondary">{t.loadingFlashcards}</p>}

          {!isLoadingFlashcards && !isLoadingSubs && levels.length > 0 && rows.length === 0 && (
            <p className="text-sm text-secondary">No flashcards available for this level.</p>
          )}

          {rows.length > 0 && (
            <div>
              {rows.map((row, index) => {
                const hanzi = isSimplified ? row.card.simplified : row.card.traditional;
                const pinyin = row.card.entries?.map((entry) => entry.pinyin).join("/");
                const translations = row.card.entries?.[0]?.english.join(", ");

                return (
                  <div
                    key={`${hanzi}-${index}`}
                    onClick={() => openDictEntry(row)}
                    className="relative group w-full text-left transition select-none text-smokewhite bg-softblack active:bg-hovered cursor-pointer"
                  >
                    <div className="pl-3 pr-4 pt-7 pb-3 flex gap-2 items-center border-b border-b-secondary/10">
                      <div className="shrink-0 font-medium text-4xl">{hanzi}</div>

                      <div className="overflow-x-hidden flex-1 -space-y-1">
                        <div className="text-base font-medium">{pinyin}</div>
                        <div className="text-base line-clamp-1 max-w-[90%]">{translations}</div>
                      </div>

                      <LucideChevronRight className="h-5 w-5 shrink-0 text-secondary/50" />

                      <div className="absolute left-4 top-3 text-xs">{index + 1}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
});
