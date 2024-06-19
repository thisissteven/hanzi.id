import { useLastViewedHanzi, useLastViewedHanziActions } from "@/store/useLastViewedHanzi";
import { useRouter } from "next/router";
import React from "react";
import { Toaster, toast } from "sonner";

export function LastViewedHanzi() {
  const { hydrateLastViewedHanzi } = useLastViewedHanziActions();
  const lastViewedHanzi = useLastViewedHanzi();

  const isInteracted = React.useRef(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      hydrateLastViewedHanzi();
    }
  }, [hydrateLastViewedHanzi]);

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
                <div className="min-w-[300px] font-sans bg-black text-smokewhite border-2 border-blue-200/80 rounded-lg px-4 py-3 flex justify-between items-center">
                  <div className="text-blue-300">
                    {lastViewedHanzi} <span className="text-xs">(last visited)</span>
                  </div>
                  <button
                    className="px-2 py-1 text-sm bg-blue-500/10 active:bg-blue-500/20 transition text-blue-300 rounded-md"
                    onClick={() => {
                      router.push(
                        `/hsk/${router.query.level}?hanzi=${lastViewedHanzi}&page=${router.query.page ?? 1}`,
                        undefined,
                        {
                          shallow: true,
                        }
                      );
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

  return <Toaster position="top-center" />;
}
