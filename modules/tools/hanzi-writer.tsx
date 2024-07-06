import { Layout } from "@/modules/layout";

import { useLocale } from "@/locales/use-locale";

export function HanziWriterTool() {
  const { t } = useLocale();

  return (
    <Layout>
      <div className="mt-4 px-2 md:px-4">
        <h1 className="text-2xl md:text-3xl font-bold">{t.hanziWriterTool.title}</h1>
        <p className="mt-1 text-secondary">{t.hanziWriterTool.description}</p>
      </div>

      <div className="mt-4"></div>
    </Layout>
  );
}
