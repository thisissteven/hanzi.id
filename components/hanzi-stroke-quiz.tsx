import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import React from "react";
import { cn } from "@/utils";
import HanziWriter from "hanzi-writer";
import { LucidePlay, LucideRotateCcw } from "lucide-react";
import { useWindowSize } from "@/hooks";
import { useLocale } from "@/locales/use-locale";

const maxWidth = 300;

export function HanziStrokeQuiz({ quiz, onClose }: { quiz: string; onClose: () => void }) {
  const latestQuiz = React.useRef(quiz) as React.MutableRefObject<string | undefined>;

  const writerRef = React.useRef() as React.MutableRefObject<HanziWriter | null>;

  const { width } = useWindowSize();

  const { t } = useLocale();

  React.useEffect(() => {
    if (quiz) {
      if (writerRef.current) {
        if (writerRef.current._character?.symbol !== quiz) {
          writerRef.current.setCharacter(quiz);
        }
        writerRef.current?.updateDimensions({
          width: Math.min(maxWidth, width - 80),
          height: Math.min(maxWidth, width - 80),
        });
      } else {
        const interval = setInterval(() => {
          const element = document.getElementById("quiz-target");
          if (element) {
            writerRef.current = HanziWriter.create(element, quiz, {
              width: Math.min(maxWidth, width - 80),
              height: Math.min(maxWidth, width - 80),
              padding: 5,
              showCharacter: false,
              strokeAnimationSpeed: 1,
              delayBetweenStrokes: 100,
              strokeColor: "#fefefe",
              outlineColor: "#333",
              drawingColor: "#fefefe",
              drawingWidth: 24,
              showHintAfterMisses: 2,
            });
            writerRef.current.quiz();
            clearInterval(interval);
          }
        }, 50);
      }
    } else {
      writerRef.current = null;
    }
  }, [quiz, width]);

  React.useEffect(() => {
    if (quiz) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.scrollbarGutter = "stable";
      latestQuiz.current = quiz;
    }

    const timeout = setTimeout(() => {
      if (!quiz) {
        document.body.style.overflowY = "scroll";
        document.documentElement.style.scrollbarGutter = "";
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [quiz]);

  return (
    <Dialog className="relative z-[998]" open={Boolean(quiz)} onClose={onClose}>
      <DialogBackdrop
        transition
        className="fixed inset-y-0 left-0 w-screen z-[998] bg-black/20 backdrop-blur-sm transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-y-0 left-0 z-[998] w-screen p-2 sm:p-4 overflow-y-auto">
        <div className="flex justify-center text-center sm:items-center">
          <DialogPanel
            transition
            className={cn(
              "relative transform overflow-hidden rounded-lg bg-white py-3 sm:py-4 text-left shadow-xl transition-all data-[closed]:-translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 w-full sm:max-w-xl data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95",
              "bg-softblack text-smokewhite"
            )}
          >
            <div className="mt-2 flex flex-col justify-between min-h-60">
              <div className="px-3 sm:px-4">
                <div className="pl-1">
                  <p className="text-secondary">{t.quiz}:</p>
                  <p className="text-sm text-secondary">{t.startWriting}</p>
                </div>

                <div className="flex max-sm:flex-col gap-2 items-end w-fit mx-auto">
                  <div className="mt-4 w-fit p-5 rounded-md border border-secondary/10">
                    <div id="quiz-target"></div>
                  </div>
                  <div className="flex flex-row sm:flex-col gap-2">
                    <button
                      onClick={() => {
                        writerRef.current?.animateCharacter();
                      }}
                      className="relative flex gap-2 items-center text-secondary rounded-md border border-secondary/10 p-2.5 active:bg-hovered duration-200 bg-softblack h-fit"
                    >
                      <LucidePlay
                        size={20}
                        strokeWidth={1.5}
                        className="shrink-0 duration-200 group-hover:text-sky-400"
                      />
                    </button>
                    <button
                      onClick={() => {
                        writerRef.current?.setCharacter(quiz);
                        writerRef.current?.quiz();
                      }}
                      className="relative flex gap-2 items-center text-secondary rounded-md border border-secondary/10 p-2.5 active:bg-hovered duration-200 bg-softblack h-fit"
                    >
                      <LucideRotateCcw
                        size={20}
                        strokeWidth={1.5}
                        className="shrink-0 duration-200 group-hover:text-sky-400"
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-2 px-3 sm:px-4 flex justify-end">
                <button
                  onClick={onClose}
                  className="block rounded-md font-medium duration-200 text-secondary bg-hovered active:bg-subtle px-3 py-1.5"
                >
                  OK
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
