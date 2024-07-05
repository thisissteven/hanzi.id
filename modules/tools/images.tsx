import { Layout } from "@/modules/layout";
import React from "react";

import { useLocale } from "@/locales/use-locale";
import { FileInputImage } from "./file-input";
import { FileConverterImage } from "./file-converter";
import { cn } from "@/utils";
import { TextResultImage } from "./text-result";

export function ImagesTool() {
  const { t } = useLocale();

  const [imageBlobUrls, setImageBlobUrls] = React.useState<string[]>([]);
  const [loadingState, setLoadingState] = React.useState({ loading: false, percentage: 0 });

  return (
    <Layout>
      <div className="mt-4 px-2 md:px-4">
        <h1 className="text-2xl md:text-3xl font-bold">{t.imagesTool.title}</h1>
        <p className="mt-1 text-secondary">{t.imagesTool.description}</p>
      </div>

      <div className="mt-4">
        <div className="mt-3 grid md:grid-cols-2 gap-4 md:min-h-[calc(100dvh-320px)]">
          <FileInputImage
            disabled={loadingState.loading}
            onChange={(urls) => {
              setImageBlobUrls(urls);
            }}
          />
          <div className="max-sm:mt-12 max-md:mt-6 gap-4 md:flex md:flex-col">
            <div className="relative rounded-md border border-secondary/40 border-dashed p-2">
              <div className="h-44 overflow-x-auto overflow-y-hidden scrollbar">
                <div className={cn(loadingState.loading && "opacity-50", "h-full")}>
                  {imageBlobUrls.length > 0 ? (
                    <FileConverterImage imageUrls={imageBlobUrls} />
                  ) : (
                    <div className="grid place-items-center h-full">
                      <p className="text-secondary">{t.previewImage}</p>
                    </div>
                  )}
                </div>
              </div>
              {loadingState.loading && (
                <p className="text-secondary absolute inset-0 w-full h-full grid place-items-center">
                  {t.loading} {loadingState.percentage}%
                </p>
              )}
            </div>
            <TextResultImage isLoading={loadingState.loading} imageUrls={imageBlobUrls} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
