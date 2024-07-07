import { Layout } from "@/modules/layout";

import { useLocale } from "@/locales/use-locale";
import { HanziStrokeQuiz, HanziStrokeSimulator } from "@/components";
import { useRouter } from "next/router";

export function HanziWriterTool() {
  const { t } = useLocale();

  const router = useRouter();
  const quiz = router.query.quiz as string;

  return (
    <Layout>
      <div className="mt-4 px-2 md:px-4">
        <h1 className="text-2xl md:text-3xl font-bold">{t.hanziWriterTool.title}</h1>
        <p className="mt-1 text-secondary">{t.hanziWriterTool.description}</p>
      </div>

      <HanziStrokeQuiz quiz={quiz} onClose={() => router.back()} />

      <div className="mt-4">
        <HanziStrokeSimulator />
      </div>
    </Layout>
  );
}
