import { Layout } from "@/modules/layout";
import React from "react";
import { ReadingType } from "./constants";
import { ExtractFromImage, ExtractFromPDF, TypeOrPasteText } from "./create";
import { BackRouteButton, RouteButton } from "@/components";

export function NewReadingContent({ type }: { type: ReadingType }) {
  return (
    <Layout>
      <div className="flex justify-between">
        <BackRouteButton />

        <RouteButton path="/new/preview">
          Preview <div className="mb-[3px]">&#8594;</div>
        </RouteButton>
      </div>

      <div>
        {type === "pdf" && <ExtractFromPDF />}
        {type === "text" && <TypeOrPasteText />}
        {type === "image" && <ExtractFromImage />}
      </div>
    </Layout>
  );
}
