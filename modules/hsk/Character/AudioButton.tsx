import { useAudio } from "@/modules/layout";
import clsx from "clsx";
import * as React from "react";
import useSWRImmutable from "swr/immutable";

export function AudioButton({ url, size = "normal" }: { url: string; size?: "small" | "normal" | "large" }) {
  const { data, mutate } = useSWRImmutable<string | undefined>(url, () => undefined);
  const [isLoading, setIsLoading] = React.useState(false);

  const { playAudio, stopAudio } = useAudio();

  React.useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  return (
    <button
      onClick={async (e) => {
        e.stopPropagation();
        if (isLoading) {
          stopAudio();
          setIsLoading(false);
          return;
        }
        setIsLoading(true);
        if (data) {
          playAudio(data, () => {
            setIsLoading(false);
          });
        } else {
          const response = await fetch(url);
          const blob = await response.blob();

          const objectURL = URL.createObjectURL(blob);

          mutate(objectURL, {
            revalidate: false,
          });

          playAudio(objectURL, () => {
            setIsLoading(false);
          });
        }
      }}
      className={clsx(
        "text-sky-500 active:opacity-100 transition",
        size === "small" && "inline align-middle",
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
