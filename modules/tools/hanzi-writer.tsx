import { Layout } from "@/modules/layout";

import { useLocale } from "@/locales/use-locale";
import { HanziStrokeQuiz, HanziStrokeSimulator } from "@/components";
import React from "react";

export function HanziWriterTool() {
  const { t } = useLocale();

  const [quiz, setQuiz] = React.useState<string | null>(null);

  return (
    <Layout>
      <div className="mt-4 px-2 md:px-4">
        <h1 className="text-2xl md:text-3xl font-bold">{t.hanziWriterTool.title}</h1>
        <p className="mt-1 text-secondary">{t.hanziWriterTool.description}</p>
      </div>

      <HanziStrokeQuiz
        quiz={quiz}
        onClose={() => {
          setQuiz(null);
        }}
      />

      <div className="mt-4">
        <HanziStrokeSimulator
          toggleQuiz={(hanzi) => {
            setQuiz((prev) => {
              if (prev) {
                return null;
              }
              return hanzi;
            });
          }}
        />
      </div>
    </Layout>
  );
}
