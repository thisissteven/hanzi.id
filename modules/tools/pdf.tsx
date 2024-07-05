import { Layout } from "@/modules/layout";
import React from "react";

import { useLocale } from "@/locales/use-locale";
import { FileInputPDF } from "./file-input";
import { cn } from "@/utils";
import { FileConverterPDF } from "./file-converter";
import { TextResultPDF } from "./text-result";

export function PDFTool() {
  const { t } = useLocale();
  const [pdfBlobUrl, setPdfBlobUrl] = React.useState<string | null>(null);
  const [loadingState, setLoadingState] = React.useState({ loading: false, percentage: 0 });

  return (
    <Layout>
      <div className="mt-4 px-2 md:px-4">
        <h1 className="text-2xl md:text-3xl font-bold">{t.pdfTool.title}</h1>
        <p className="mt-1 text-secondary">{t.pdfTool.description}</p>
      </div>

      <div className="mt-4">
        <div className="mt-3 grid md:grid-cols-2 gap-4 md:min-h-[calc(100dvh-320px)]">
          <FileInputPDF
            disabled={loadingState.loading}
            onChange={(url) => {
              setPdfBlobUrl(url);
            }}
          />
          <div className="max-md:mt-6 gap-4 md:flex md:flex-col">
            <div className="relative rounded-md border border-secondary/40 border-dashed p-2">
              <div className="h-44 overflow-x-auto overflow-y-hidden scrollbar">
                <div className={cn(loadingState.loading && "opacity-50", "h-full")}>
                  {pdfBlobUrl ? (
                    <FileConverterPDF
                      whileLoading={(loading, percentage) => {
                        setLoadingState({ loading, percentage });
                      }}
                      pdfUrl={pdfBlobUrl}
                    />
                  ) : (
                    <div className="grid place-items-center h-full">
                      <p className="text-secondary">Preview file PDF akan tampil di sini</p>
                    </div>
                  )}
                </div>
              </div>
              {loadingState.loading && (
                <p className="text-secondary absolute inset-0 w-full h-full grid place-items-center">
                  Memuat {loadingState.percentage}%
                </p>
              )}
            </div>
            <TextResultPDF isLoading={loadingState.loading} pdfUrl={pdfBlobUrl} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
