import { useRouter } from "next/router";
import en from "@/locales/en.json";
import id from "@/locales/id.json";

const contents = {
  en,
  id,
};

export function useLocale() {
  const router = useRouter();

  const locale = router.locale as "en" | "id";

  if (locale) {
    const t = contents[locale];
    return { t, locale };
  }

  return {
    t: contents["en"],
    locale: "en",
  };
}
