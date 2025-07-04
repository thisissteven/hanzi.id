"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMediaDocs } from "./utils/media";
import { usePreferences } from "@/components";
import { YoutubeCard } from "./youtube-card";
import { useLocale } from "@/locales/use-locale";

export function VideoContainer() {
  const { isSimplified } = usePreferences();
  const lang = isSimplified ? "zh-CN" : "zh-TW";

  const [vocabRange] = useState<number[]>([0, 100000]);

  const { t, locale } = useLocale();

  const { data: docs, isLoading: isLoadingDocs } = useQuery({
    queryKey: ["docs", "all", locale],
    queryFn: () =>
      fetchMediaDocs({
        diocoPlaylistId: `t_yt_all_${lang}`,
        freq95: { min: vocabRange[0], max: vocabRange[1] },
        lang_G: lang,
        target: locale,
      }),
    enabled: typeof locale === "string",
  });

  return (
    <div>
      <div className="mt-4 px-3">{isLoadingDocs && <p>{t.loading}</p>}</div>

      <div className="max-sm:-mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:max-md:px-3">
        {docs?.data?.docs_metadata.map((doc) => {
          return <YoutubeCard key={doc.diocoDocId} doc={doc} />;
        })}
      </div>
    </div>
  );
}
