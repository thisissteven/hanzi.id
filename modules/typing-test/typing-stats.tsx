import { useLocale } from "@/locales/use-locale";
import { cn } from "@/utils";
import { AnimatePresence } from "framer-motion";
import { LucideSettings } from "lucide-react";
import { useRouter } from "next/router";
import { useTypingStats } from "./use-typing-stats";
import { Layout } from "../layout";

export function TypingStats() {
  const { accuracy, wpm, seconds, testStatus } = useTypingStats();
  const { t } = useLocale();
  const router = useRouter();
  return (
    <AnimatePresence mode="wait" initial={false}>
      {testStatus === "waiting for you" ? (
        <Layout key="waiting" className="h-8 sm:h-14 flex text-lightgray font-medium w-fit items-end gap-4">
          <button
            onClick={() => {
              router.push(
                {
                  query: {
                    ...router.query,
                    settings: true,
                  },
                },
                undefined,
                { shallow: true }
              );
            }}
            className="px-2 flex py-2 gap-1.5 items-center active:bg-hovered duration-200 rounded-md"
          >
            <LucideSettings size={18} />
            {t.settings}
          </button>
        </Layout>
      ) : (
        <Layout key="started" className="h-8 sm:h-14 grid grid-cols-3 text-lightgray font-medium w-fit items-end gap-4">
          <div
            className={cn(
              "text-3xl md:text-4xl duration-500 text-center",
              testStatus === "finished" && "text-sky-200/90"
            )}
          >
            {seconds}
            <span className="text-sm md:text-lg">s</span>
          </div>
          <div
            className={cn(
              "text-3xl md:text-4xl duration-500 text-center",
              testStatus === "finished" && "text-sky-200/90"
            )}
          >
            {wpm}
            <span className="text-sm md:text-lg">wpm</span>
          </div>
          <div
            className={cn(
              "text-3xl md:text-4xl duration-500 text-center",
              testStatus === "finished" && "text-sky-200/90"
            )}
          >
            {accuracy}
            <span className="text-sm md:text-lg">%</span>
          </div>
        </Layout>
      )}
    </AnimatePresence>
  );
}
