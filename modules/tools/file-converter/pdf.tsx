"use client";
import React, { useEffect, useState } from "react";
import { usePDFJS } from "../hooks/use-pdfjs";
import { useLocale } from "@/locales/use-locale";

export const FileConverterPDF = ({
  pdfUrl,
  whileLoading,
}: {
  pdfUrl: string;
  whileLoading: (loading: boolean, percentage: number) => void;
}) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [remainingPages, setRemainingPages] = useState<number>(0);

  const pdfjs = usePDFJS();

  const { t } = useLocale();

  useEffect(() => {
    if (pdfjs) {
      const loadTask = async () => {
        whileLoading(true, 0);
        const pdf = await pdfjs.getDocument(pdfUrl).promise;
        const urls = [];
        for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) {
          const page = await pdf.getPage(i);
          const scale = 2;
          const viewport = page.getViewport({ scale });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          if (!context) return;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };
          await page.render(renderContext).promise;

          const url = canvas.toDataURL("image/png");
          urls.push(url);

          const percentage = (i / Math.min(pdf.numPages, 10)) * 100;
          if (percentage < 100) whileLoading(true, percentage);
          else whileLoading(false, 100);
        }
        setImageUrls(urls);
        setRemainingPages(pdf.numPages - 10 > 0 ? pdf.numPages - 10 : 0);
      };

      loadTask();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfUrl, pdfjs]);

  return (
    <div className="flex gap-2">
      {imageUrls.map((url, index) => (
        // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
        <img key={index} src={url} className="h-40" />
      ))}
      {remainingPages > 0 && (
        <div className="flex items-center justify-center h-40 w-40">
          <p className="p-4 text-secondary">
            {remainingPages} {t.pagesNotShown}
          </p>
        </div>
      )}
    </div>
  );
};
