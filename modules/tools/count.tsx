import { Layout } from "@/modules/layout";
import React from "react";

import { useLocale } from "@/locales/use-locale";
import { Textarea } from "@/components";
import { getCharactersFromText } from "@/utils";

function exportToCSV(data: { char: string; count: number }[]) {
  const csvRows = data.map(({ char, count }) => `${char},${count}`);
  const csvContent = `\uFEFFCharacter,Count\n${csvRows.join("\r\n")}`;

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "character_counts.csv");

  // Trigger the download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function Stat({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex text-sm items-center rounded-full backdrop-blur-sm bg-blue-500/10 dark:bg-blue-400/10 px-3 py-1.5 font-medium text-blue-500 dark:text-blue-400 ring-1 ring-inset ring-blue-500/20 dark:ring-blue-400/20 w-fit h-fit">
      {children}
    </div>
  );
}

export function CharacterCountTool() {
  const { t } = useLocale();

  const [text, setText] = React.useState("");

  const { count, unique, sorted } = getCharactersFromText(text);

  return (
    <Layout>
      <div className="mt-4 px-2 md:px-4">
        <h1 className="text-2xl md:text-3xl font-bold">{t.characterCountTool.title}</h1>
        <p className="mt-1 text-secondary">{t.characterCountTool.description}</p>
      </div>

      <div className="mt-4 md:px-2 flex justify-between flex-wrap gap-3 items-end">
        <div className="flex gap-2">
          <Stat>
            {count} {t.characterCountTool.characters}
          </Stat>
          <Stat>
            {unique} {t.characterCountTool.uniqueCharacters}
          </Stat>
        </div>

        {sorted.length > 0 && (
          <button
            className="px-4 py-2 bg-subtle/50 active:bg-hovered duration-200 rounded-md"
            onClick={() => {
              exportToCSV(sorted);
            }}
          >
            {t.characterCountTool.export}
          </button>
        )}
      </div>

      <div className="mt-4 md:px-2">
        <Textarea
          placeholder={t.characterCountTool.placeholder}
          required
          value={text}
          onChange={(e) => setText(e.target.value)}
          minHeight="136px"
          limitHeightOnBlur
        />

        {sorted.length > 0 && (
          <table className="mt-4 min-w-full divide-y divide-secondary/10">
            <thead className="text-smokewhite">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                  {t.characterCountTool.characters}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                  {t.characterCountTool.count}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/10">
              {sorted.map((char, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-lg font-medium">{char.char}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-lg">{char.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}
