import { createErrorToast, createSuccessToast, RouteDialog } from "@/components";
import { useRouter } from "next/router";
import { useLocale } from "@/locales/use-locale";

export function DumpToFlashcardModal({ cards, settings }: { cards: [string, string, number][]; settings: string }) {
  const router = useRouter();

  const open = Boolean(router.query.flashcards);

  const { t } = useLocale();

  return (
    <RouteDialog
      className="sm:max-w-lg"
      open={open}
      onClose={() => {
        router.back();
      }}
      withoutOkButton
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const target = e.target as typeof e.target & {
            0: { value: string };
            1: { value: string };
          };
          if (target) {
            const title = target[0].value;
            const description = target[1].value;

            const chapter = `${description}-${title}`;
            const flashcard = {
              chapter,
              words: cards.map(([word]) => word),
            };

            const currentFlashcards = JSON.parse(localStorage.getItem("flashcard-data") ?? "[]");

            if (currentFlashcards.some((f: any) => f.chapter === chapter)) {
              createErrorToast(t.flashcardExists, {
                id: "flashcard-exists",
              });
            } else {
              localStorage.setItem("flashcard-data", JSON.stringify([...currentFlashcards, flashcard]));
              createSuccessToast(t.wordsAdded, {
                id: "flashcard-success",
              });
              router.back();
            }
          }
        }}
        className="space-y-4"
      >
        <p>{t.pleaseFill}</p>
        <div className="relative">
          <input
            className="bg-transparent pl-3 pr-10 py-2 rounded-md border border-subtle ring-offset-black ring-smoke focus:ring-offset-2 focus:ring-2 text-secondary focus:text-white transition-shadow duration-200 placeholder:text-secondary/50 focus:outline-none w-full"
            type="text"
            placeholder={t.placeholderFlashcardTitle}
            required
          />
          <span className="absolute text-xs bg-black/50 backdrop-blur-sm h-7 w-8 text-secondary right-1 top-1/2 -translate-y-1/2 grid place-items-center">
            {1}
          </span>
        </div>

        <div className="relative">
          <input
            className="bg-transparent pl-3 pr-10 py-2 rounded-md border border-subtle ring-offset-black ring-smoke focus:ring-offset-2 focus:ring-2 text-secondary focus:text-white transition-shadow duration-200 placeholder:text-secondary/50 focus:outline-none w-full"
            type="text"
            placeholder={t.placeholderFlashcardDescription}
            required
          />
          <span className="absolute text-xs bg-black/50 backdrop-blur-sm h-7 w-8 text-secondary right-1 top-1/2 -translate-y-1/2 grid place-items-center">
            {2}
          </span>
        </div>

        <p>
          {t.dumpConfirmation[0]} {cards.length} {t.dumpConfirmation[1]}
        </p>
        <p>
          {t.yourFilterSettings} <b>{settings}</b>
        </p>

        <div className="mt-2 flex justify-end bg-softblack">
          <button
            type="submit"
            className="block rounded-md font-medium duration-200 bg-hovered active:bg-subtle px-3 py-1.5"
          >
            OK
          </button>
        </div>
      </form>
    </RouteDialog>
  );
}
