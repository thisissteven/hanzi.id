import { Layout } from "@/modules/layout";
import React from "react";
import { ReadingType } from "./constants";
import { cn } from "@/utils";

export function NewReading({ type, onReturn }: { type: ReadingType; onReturn: () => void }) {
  return (
    <Layout>
      <div className="">
        <button
          onClick={onReturn}
          className={cn(
            "mt-4 ease duration-500 py-2 pl-3 pr-4 rounded-md",
            "duration-300 hover:bg-hovered active:bg-hovered",
            "flex items-center gap-2"
          )}
          aria-label="Continue"
        >
          <div className="mb-[3px]">&#8592;</div> Return
        </button>
      </div>
    </Layout>
  );
}
