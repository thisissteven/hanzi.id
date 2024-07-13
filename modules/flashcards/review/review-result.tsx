import React from "react";
import { CountingNumbers, RouteDialog } from "@/components";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { cn } from "@/utils";
import { useLocale } from "@/locales/use-locale";
import { useReview } from "./provider";

export function ReviewResult() {
  const { reviewResult } = useReview();

  const wrong = reviewResult.filter((result) => result === "wrong").length;
  const correct = reviewResult.filter((result) => result === "correct").length;
  const untouched = reviewResult.length - wrong - correct;

  const { t } = useLocale();

  return (
    <div className="px-2 w-full flex flex-wrap gap-4 justify-center">
      <div className="flex gap-2 items-center text-sm">
        <div className="w-2 h-2 rounded-full bg-red-500"></div> {wrong} {t.wrong}
      </div>
      <div className="flex gap-2 items-center text-sm">
        <div className="w-2 h-2 rounded-full bg-emerald-500"></div> {correct} {t.correct}
      </div>
      <div className="flex gap-2 items-center text-sm">
        <div className="w-2 h-2 rounded-full bg-gray-500"></div> {untouched} {t.untouched}
      </div>
    </div>
  );
}

export function ReviewResultsModal() {
  const { t } = useLocale();

  const router = useRouter();

  const open = Boolean(router.query.results);

  const correctPercentage = parseInt((router.query.percentage as string) ?? "-1");
  const lastCorrectPercentage = React.useRef(correctPercentage);

  React.useEffect(() => {
    if (correctPercentage && correctPercentage > -1) {
      lastCorrectPercentage.current = correctPercentage;
    }
  }, [correctPercentage]);

  const displayPercentage = correctPercentage > -1 ? correctPercentage : lastCorrectPercentage.current;

  return (
    <RouteDialog
      okButtonText={t.done}
      open={open}
      onClose={() => {
        router.replace(`/flashcards/${router.query.chapter}`);
      }}
      noDismiss
    >
      <div className="space-y-4 h-64 flex flex-col items-center">
        <EndResult correctPercentage={displayPercentage} />
        <h2 className="text-center font-medium">
          {displayPercentage >= 80 ? t.youDidGreat : displayPercentage >= 50 ? t.notBad : t.keepPracticing}
        </h2>
      </div>
    </RouteDialog>
  );
}

export function EndResult({ correctPercentage }: { correctPercentage: number }) {
  return (
    <div className="relative w-52 aspect-square">
      <motion.svg className="absolute inset-0 m-auto" viewBox="0 0 100 100" width={140} height={140}>
        <motion.circle
          initial={{ pathLength: 0 }}
          animate={{ pathLength: correctPercentage / 100 }}
          whileInView={{ pathLength: correctPercentage / 100 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 2, ease: "easeOut" }}
          strokeWidth={7}
          strokeDasharray="0 1"
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          cx="50"
          cy="50"
          r="45"
          fill={correctPercentage >= 80 ? "#DCFCE7" : correctPercentage >= 50 ? "#FEF3C7" : "#FEE2E2"}
          stroke={correctPercentage >= 80 ? "#22C55E" : correctPercentage >= 50 ? "#F59E0B" : "#EF4444"}
        />
      </motion.svg>
      <CountingNumbers
        value={correctPercentage}
        duration={2500}
        className={cn(
          "absolute inset-0 mx-auto flex items-center justify-center text-5xl",
          correctPercentage >= 80 ? "text-emerald-500" : correctPercentage >= 50 ? "text-amber-500" : "text-red-500"
        )}
      />
    </div>
  );
}
