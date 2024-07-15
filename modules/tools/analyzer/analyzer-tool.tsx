import { useLocale } from "@/locales/use-locale";
import { Layout } from "@/modules/layout";
import React from "react";
import { Stat } from "../count";
import { Textarea } from "@/components";
import { useWords } from "./use-words";
import { AnalysisDisplay } from "./analysis-display";

function exportToCSV(data: [string, string, number][]) {
  // Create CSV header
  const csvHeader = `\uFEFFHanzi,Category,Occurrence\n`;

  // Map each array item to a CSV row
  const csvRows = data.map(([hanzi, category, occurrence]) => `${hanzi},${category},${occurrence}`);

  // Join the rows into a single string, with each row separated by a newline character
  const csvContent = `${csvHeader}${csvRows.join("\r\n")}`;

  // Create a Blob object from the CSV string
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // Create a URL for the Blob object
  const url = URL.createObjectURL(blob);

  // Create a link element
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "text-analysis.csv");

  // Append the link to the document body, trigger a click to download the file, and remove the link
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function AnalyzerTool() {
  const { t } = useLocale();

  const [text, setText] = React.useState("");

  const { count, unique, sorted, chartData } = useWords(text);

  return (
    <Layout>
      <div className="mt-4 px-2 md:px-4">
        <h1 className="text-2xl md:text-3xl font-bold">{t.analyzerTool.title}</h1>
        <p className="mt-1 text-secondary">{t.analyzerTool.description}</p>
      </div>

      <div className="mt-4 md:px-2 flex justify-between flex-wrap gap-3 items-end">
        <div className="flex gap-2">
          <Stat>
            {count} {t.analyzerTool.words}
          </Stat>
          <Stat>
            {unique} {t.analyzerTool.uniqueWords}
          </Stat>
        </div>

        {sorted.length > 0 && (
          <button
            className="px-4 py-2 bg-subtle/50 active:bg-hovered duration-200 rounded-md"
            onClick={() => {
              exportToCSV(sorted);
            }}
          >
            {t.analyzerTool.export}
          </button>
        )}
      </div>

      <div className="mt-4 md:px-2">
        <Textarea
          placeholder={t.analyzerTool.placeholder}
          required
          value={text}
          onChange={(e) => setText(e.target.value)}
          minHeight="136px"
          preventHeightChange
        />

        {sorted.length > 0 && <AnalysisDisplay sorted={sorted} chartData={chartData} />}
      </div>
    </Layout>
  );
}
