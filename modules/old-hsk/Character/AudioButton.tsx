import { useLocale } from "@/locales/use-locale";
import { useAudio } from "@/modules/layout";
import clsx from "clsx";
import * as React from "react";
import { toast } from "sonner";

function isOpera() {
  var userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes("opera") || userAgent.includes("opr");
}

export function AudioButton({
  text,
  speed = 1,
  size = "normal",
}: {
  text: string;
  speed?: number;
  size?: "small" | "normal" | "large";
}) {
  const { speak, isSpeaking, stopAudio } = useAudio();

  const { t } = useLocale();

  const isLoading = isSpeaking.text === text;

  React.useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  return (
    <button
      role="button"
      onClick={async (e) => {
        e.stopPropagation();
        if (isOpera()) {
          toast.custom(
            (_) => (
              <div className="font-sans mx-auto select-none w-fit pointer-events-none rounded-full bg-[#232323] whitespace-nowrap py-3 px-6 flex items-center gap-3">
                <div className="shrink-0 mt-0.5 w-2 h-2 rounded-full bg-rose-500 indicator"></div>
                <span className="shrink-0">{t.operaNotSupported}</span>
              </div>
            ),
            {
              id: "opera not supported",
              duration: 5000,
              position: "bottom-center",
            }
          );
          return;
        }
        if (isLoading) {
          stopAudio();
          return;
        }
        if (text) {
          speak(text, speed);
        }
      }}
      className={clsx(
        "text-sky-500 active:opacity-100 transition",
        size === "small" && "inline align-middle max-sm:mb-0.5",
        isLoading ? "opacity-100" : "opacity-50"
      )}
    >
      <svg
        className={clsx(
          size === "small" && "w-[18px] h-[18px]",
          size === "normal" && "w-6 h-6",
          size === "large" && "w-8 h-8"
        )}
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
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </svg>
    </button>
  );
}
