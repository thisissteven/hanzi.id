import { Layout } from "@/modules/layout";
import React from "react";

import { useLocale } from "@/locales/use-locale";

export function CharacterCountTool() {
  const { t } = useLocale();

  return (
    <Layout>
      <div className="mt-4 px-2 md:px-4">
        <h1 className="text-2xl md:text-3xl font-bold">{t.characterCountTool.title}</h1>
        <p className="mt-1 text-secondary">{t.characterCountTool.description}</p>
      </div>
      <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-2"></div>
    </Layout>
  );
}
