import { useLocale } from "@/locales/use-locale";
import { LucideFilter } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { FilterModal } from "./filter-modal";
import React from "react";
import { Divider } from "@/components";
import { DumpToFlashcardModal } from "./dump-to-flashcard-modal";

const CategoryChart = dynamic(() => import("./category-chart"), { ssr: false });

function getSettingsText(locale: string, selectedCategory: string, idiomsOnly: boolean) {
  if (locale === "en") {
    return `${selectedCategory.toLowerCase()} category, ${idiomsOnly ? "idioms only" : "all words"}`;
  }

  return `kategori ${selectedCategory.toLowerCase()}, ${idiomsOnly ? "hanya idiom" : "semua kata"}`;
}

export function AnalysisDisplay({
  chartData,
  sorted,
}: {
  chartData: {
    name: any;
    idioms: any;
    words: any;
  }[];
  sorted: [string, string, number][];
}) {
  const { t, locale } = useLocale();

  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [idiomsOnly, setIdiomsOnly] = React.useState(false);

  const sortedByCategory = React.useMemo(() => {
    return sorted
      .filter(([_, category, __]) => {
        if (selectedCategory === "All") {
          return true;
        }
        return category === selectedCategory.toLowerCase();
      })
      .filter(([hanzi, _, __]) => {
        if (idiomsOnly && hanzi.length < 4) {
          return false;
        }
        return true;
      });
  }, [sorted, selectedCategory, idiomsOnly]);

  return (
    <React.Fragment>
      <DumpToFlashcardModal cards={sortedByCategory} settings={getSettingsText(locale, selectedCategory, idiomsOnly)} />
      <FilterModal
        categories={["All", ...chartData.map((data) => data.name)]}
        selectedCategory={selectedCategory}
        idiomsOnly={idiomsOnly}
        onChange={(category, idiomsOnly) => {
          setSelectedCategory(category);
          setIdiomsOnly(idiomsOnly);
        }}
      />

      <div className="mt-4 w-full h-80">
        <CategoryChart data={chartData} />
      </div>

      <Divider />

      <div className="sm:mx-4 flex justify-between">
        <button
          onClick={() => {
            router.push(
              {
                query: {
                  ...router.query,
                  filter: true,
                },
              },
              undefined,
              { shallow: true }
            );
          }}
          className="px-2 flex py-2 gap-1.5 items-center active:bg-hovered duration-200 rounded-md"
        >
          <LucideFilter size={18} />
          Filter
        </button>
        <button
          onClick={() => {
            router.push(
              {
                query: {
                  ...router.query,
                  flascards: true,
                },
              },
              undefined,
              { shallow: true }
            );
          }}
          className="px-2 flex py-2 gap-1.5 items-center active:bg-hovered duration-200 rounded-md"
        >
          + {t.addToFlashcard}
        </button>
      </div>

      <table className="mt-2 min-w-full divide-y divide-secondary/10">
        <thead className="text-smokewhite">
          <tr>
            <th scope="col" className="sm:px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
              {t.analyzerTool.words}
            </th>
            <th scope="col" className="sm:px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
              {t.analyzerTool.type}
            </th>
            <th scope="col" className="sm:px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
              {t.analyzerTool.count}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-secondary/10">
          {sortedByCategory.map(([hanzi, category, count], index) => {
            return (
              <tr key={hanzi}>
                <td className="sm:px-6 py-4 whitespace-nowrap text-lg font-medium">{hanzi}</td>
                <td className="sm:px-6 py-4 whitespace-nowrap text-sm">{category}</td>
                <td className="sm:px-6 py-4 whitespace-nowrap text-sm">{count}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </React.Fragment>
  );
}
