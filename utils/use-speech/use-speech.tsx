import { PlayingState } from "./speech";
import { toast } from "sonner";
import React from "react";
import { useParagraphs } from "./use-paragraphs";
import { useReading } from "@/modules/layout";
import { useRouter } from "next/router";
import { useChapterById } from "@/modules/speech";
import { useBookDetails } from "@/pages/read/[id]";
import { useLocale } from "@/locales/use-locale";
import { usePreferences } from "@/components";
import { useSpeechManager } from "./use-speech-manager";
import Link from "next/link";

type SpeechContextValues = {
  currentSentenceIdx: number;
  currentWordRange: [number, number];
  playbackState: PlayingState;
  play: () => void;
  pause: () => void;
  toSentence: (index: number) => void;
  sentences: Array<string>;
};

const SpeechContext = React.createContext({} as SpeechContextValues);

export const useSpeech = () => {
  return React.useContext(SpeechContext);
};

export function SpeechProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const isChapterPage = router.pathname === "/read/[id]/[chapterId]" || router.asPath === "/read/[id]/[chapterId]";

  React.useEffect(() => {
    if (!isChapterPage && typeof window !== "undefined") {
      window.speechSynthesis.cancel();
      toast.dismiss("last-read");
    }
  }, [isChapterPage]);

  if (!isChapterPage) return children;
  return <SpeechContextProvider>{children}</SpeechContextProvider>;
}

function SpeechContextProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [_, rerender] = React.useReducer((s) => s + 1, 0);

  const bookId = router.query.id as string;
  const chapterId = router.query.chapterId as string;

  const { isSimplified } = usePreferences();

  const { data: chapter } = useChapterById(bookId, chapterId, isSimplified);
  const { data: book } = useBookDetails(bookId, isSimplified);

  const { sentences } = useParagraphs(chapter?.content ?? "", chapter?.book?.isUnique ?? false);
  const { speed } = useReading();

  const { t } = useLocale();

  const nextChapterId = React.useMemo(() => {
    try {
      return book?.chapters[book?.chapters.findIndex((chapter) => chapter.id === chapterId) + 1];
    } catch {
      return null;
    }
  }, [book?.chapters, chapterId]);

  const onEndCallback = React.useCallback(() => {
    if (nextChapterId) {
      toast.custom(
        (_) => (
          <div className="border border-secondary/10 font-sans mx-auto min-w-[300px] select-none w-fit rounded-full bg-black whitespace-nowrap py-2 pl-6 pr-2 flex items-center gap-3">
            <div className="shrink-0 mt-0.5 w-2 h-2 rounded-full bg-sky-400 indicator-blue"></div>
            <span className="shrink-0 flex-1">{t.nextChapter}</span>
            <Link
              className="px-2 pt-0.5 pb-1.5 w-16 h-10 shrink-0 rounded-full text-sm bg-sky-500/10 active:bg-sky-500/20 transition text-blue-300 font-medium"
              href={`/read/${bookId}/${nextChapterId.id}`}
            >
              &#x2192;
            </Link>
          </div>
        ),
        {
          id: "next-chapter",
          duration: Infinity,
        }
      );
    }
  }, [bookId, nextChapterId, t.nextChapter]);

  const baseUrl = React.useCallback(
    (index: number) => `books/${bookId}/${chapterId}/audio/${index}.json`,
    [bookId, chapterId]
  );

  const value = useSpeechManager(sentences, {
    rate: speed,
    onEndCallback,
    baseUrl,
  });

  const lastChapterId = React.useRef(chapterId);

  React.useEffect(() => {
    if (chapterId) {
      toast.dismiss("next-chapter");
      lastChapterId.current = chapterId;
      rerender();
    }
  }, [chapterId]);

  return (
    <SpeechContext.Provider value={value}>
      <audio ref={value.audioRef} />
      {children}
    </SpeechContext.Provider>
  );
}
