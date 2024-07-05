import React from "react";
import { LucideCopy, LucideDownload } from "lucide-react";
import { toast } from "sonner";
import { useLocale } from "@/locales/use-locale";
import { TextResult } from "./pdf";

export function GeneratedText({
  textResult,
  isLoading,
  isImage = false,
}: {
  textResult: TextResult;
  isLoading: boolean;
  isImage?: boolean;
}) {
  const [currentPage, setCurrentPage] = React.useState(1);

  const { text, page } = textResult.find((result) => result.page === currentPage) || { text: [], page: 1 };
  const { t } = useLocale();

  return (
    <div className="relative mt-4 pb-4">
      <div className="sticky top-4 flex gap-2 justify-between">
        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            className="inline-flex items-center rounded-md backdrop-blur-sm bg-softblack/80 px-4 py-2 font-medium text-secondary ring-1 ring-inset ring-gray-400/20 text-sm duration-200 active:bg-hovered"
            onClick={() => {
              setCurrentPage(currentPage - 1);
            }}
          >
            &#8592;
          </button>
          <div className="inline-flex items-center rounded-md backdrop-blur-sm bg-softblack/80 px-4 py-2 font-medium text-secondary ring-1 ring-inset ring-gray-400/20 text-sm">
            {isImage ? t.image : t.page} {page} / {textResult.length}
          </div>
          <button
            disabled={currentPage === textResult.length}
            className="inline-flex items-center rounded-md backdrop-blur-sm bg-softblack/80 px-4 py-2 font-medium text-secondary ring-1 ring-inset ring-gray-400/20 text-sm duration-200 active:bg-hovered"
            onClick={() => {
              setCurrentPage(currentPage + 1);
            }}
          >
            &#8594;
          </button>
        </div>

        <div className="flex gap-2">
          <button
            className="inline-flex items-center rounded-md backdrop-blur-sm bg-softblack/80 px-4 py-2 font-medium text-secondary ring-1 ring-inset ring-gray-400/20 text-sm disabled:opacity-50 duration-200 active:bg-hovered"
            onClick={() => {
              // current page
              navigator.clipboard.writeText(text.join("\n"));
              toast.custom((_) => {
                return (
                  <div className="font-sans mx-auto select-none w-fit pointer-events-none rounded-full bg-[#232323] whitespace-nowrap py-3 px-6 flex items-center gap-3 shadow shadow-black">
                    <div className="shrink-0 mt-0.5 w-2 h-2 rounded-full bg-sky-400 indicator-blue"></div>
                    <span className="shrink-0">{t.copySuccess}</span>
                  </div>
                );
              });
            }}
          >
            <LucideCopy size={18} />
          </button>
          <button
            disabled={isLoading}
            className="inline-flex items-center rounded-md backdrop-blur-sm bg-softblack/80 px-4 py-2 font-medium text-secondary ring-1 ring-inset ring-gray-400/20 text-sm disabled:opacity-50 duration-200 active:bg-hovered"
            onClick={() => {
              // all pages
              const text = textResult
                .map((result) => result.text.join("\n"))
                .join("\n-------------------------------------------------------------------------\n\n");
              const blob = new Blob([text], { type: "text/plain" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");

              a.href = url;
              a.download = `extracted-text-${new Date().toISOString()}.txt`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            <LucideDownload size={18} />
          </button>
        </div>
      </div>
      <div className="mt-2">
        {text.map((t, i) => (
          <p key={i}>{t}</p>
        ))}
      </div>
    </div>
  );
}
