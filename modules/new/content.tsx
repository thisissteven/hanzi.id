import { Layout } from "@/modules/layout";
import React from "react";
import { ReadingType } from "./constants";
import { cn } from "@/utils";
import { ExtractFromImage, ExtractFromPDF, TypeOrPasteText } from "./create";

export function NewReadingContent({
  type,
  onReturn,
  onPreview,
}: {
  type: ReadingType;
  onReturn: () => void;
  onPreview: () => void;
}) {
  return (
    <Layout>
      <div className="flex justify-between">
        <button
          onClick={onReturn}
          type="button"
          className={cn(
            "mt-4 py-2 pl-3 pr-4 rounded-md",
            "duration-[200ms] hover:bg-hovered active:bg-hovered",
            "flex items-center gap-2"
          )}
          aria-label="Continue"
        >
          <div className="mb-[3px]">&#8592;</div> Return
        </button>

        <button
          onClick={onPreview}
          type="button"
          className={cn(
            "mt-4 py-2 pl-4 pr-3 rounded-md",
            "duration-300 hover:[200ms]-hovered active:bg-hovered",
            "flex items-center gap-2"
          )}
          aria-label="Preview"
        >
          Preview <div className="mb-[3px]">&#8594;</div>
        </button>
      </div>

      <div>
        {type === "pdf" && <ExtractFromPDF />}
        {type === "text" && <TypeOrPasteText />}
        {type === "image" && <ExtractFromImage />}
      </div>
    </Layout>
  );
}
