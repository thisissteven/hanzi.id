"use client";
import React from "react";
import { useLocale } from "@/locales/use-locale";

export const FileConverterImage = ({ imageUrls }: { imageUrls: string[] }) => {
  const remainingImages = Math.max(imageUrls.length - 10, 0);

  const { t } = useLocale();

  return (
    <div className="flex gap-2">
      {imageUrls.slice(0, 10).map((url, index) => (
        // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
        <img key={index} src={url} className="h-40" />
      ))}
      {remainingImages > 0 && (
        <div className="flex items-center justify-center h-40 w-40 bg-tremor-background-subtle">
          <p className="p-4 text-secondary">
            {remainingImages} {t.imagesNotShown}
          </p>
        </div>
      )}
    </div>
  );
};
