import { useLastViewedHanzi, useLastViewedHanziActions } from "@/store/useLastViewedHanzi";
import { useRouter } from "next/router";
import React from "react";
import { toast } from "sonner";

export function LastViewedHanzi() {
  const { handleValueMismatch, hydrateLastViewedHanzi } = useLastViewedHanziActions();
  const lastViewedHanzi = useLastViewedHanzi();

  const isInteracted = React.useRef(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      handleValueMismatch();
      hydrateLastViewedHanzi();
    }
  }, [handleValueMismatch, hydrateLastViewedHanzi]);

  const router = useRouter();

  React.useEffect(() => {
    if (isInteracted.current) toast.dismiss();

    const timeout = setTimeout(() => {
      if (lastViewedHanzi && !isInteracted.current) {
        isInteracted.current = true;
        if (!router.query.hanzi) {
          toast.custom(
            (t) => {
              return (
                <div className="border border-secondary/10 font-sans mx-auto min-w-[300px] select-none w-fit rounded-full bg-black whitespace-nowrap py-2 pl-6 pr-2 flex items-center gap-3">
                  <div className="shrink-0 mt-0.5 w-2 h-2 rounded-full bg-sky-400 indicator-blue"></div>
                  <span className="shrink-0 flex-1">
                    {lastViewedHanzi.character} <span className="text-xs">(last visited)</span>
                  </span>
                  <button
                    className="px-2 pt-0.5 pb-1.5 w-16 h-10 shrink-0 rounded-full text-sm bg-sky-500/10 active:bg-sky-500/20 transition text-blue-300 font-medium"
                    onClick={() => {
                      router.push(lastViewedHanzi.pathname);
                      toast.dismiss(t);
                    }}
                  >
                    &#x2192;
                  </button>
                </div>
              );
            },
            {
              duration: Infinity,
            }
          );
        }
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
    };
  }, [lastViewedHanzi, router]);

  return null;
}
