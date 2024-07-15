import { RouteDialog, usePreferences } from "@/components";
import { useRouter } from "next/router";
import { useLocale } from "@/locales/use-locale";
import { SelectButton } from "@/modules/typing-test";

export function FilterModal({
  categories,
  selectedCategory,
  idiomsOnly,
  onChange,
}: {
  categories: string[];
  selectedCategory: string;
  idiomsOnly: boolean;
  onChange: (category: string, idiomsOnly: boolean) => void;
}) {
  const router = useRouter();

  const open = Boolean(router.query.filter);

  const { t } = useLocale();
  const { isSimplified } = usePreferences();

  return (
    <RouteDialog
      className="sm:max-w-sm"
      open={open}
      onClose={() => {
        router.back();
      }}
    >
      <div className="space-y-8">
        <div className="space-y-2">
          <p className="text-center font-medium">{isSimplified ? "成语" : "成語"}</p>
          <SelectButton
            className={idiomsOnly ? "text-sky-500" : "opacity-50"}
            onClick={() => onChange(selectedCategory, true)}
          >
            {t.idiomsOnly}
          </SelectButton>
          <SelectButton
            className={!idiomsOnly ? "text-sky-500" : "opacity-50"}
            onClick={() => onChange(selectedCategory, false)}
          >
            {t.showAllWords}
          </SelectButton>
        </div>

        <div className="space-y-2">
          <p className="text-center font-medium">{isSimplified ? "类别" : "類別"}</p>
          {categories.map((category) => {
            return (
              <SelectButton
                key={category}
                className={selectedCategory === category ? "text-amber-500" : "opacity-50"}
                onClick={() => onChange(category, idiomsOnly)}
              >
                {category}
              </SelectButton>
            );
          })}
        </div>
      </div>
    </RouteDialog>
  );
}
