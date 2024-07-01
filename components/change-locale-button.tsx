import Link from "next/link";
import { useRouter } from "next/router";

export function ChangeLocaleButton() {
  const router = useRouter();
  const asPath = router.asPath;
  const locale = router.locale;

  return (
    <Link
      href={asPath}
      locale={locale === "en" ? "id" : "en"}
      className="relative grid place-items-center z-50 px-4 py-1.5 rounded-md text-sm bg-softblack border border-secondary/10"
    >
      {locale === "en" ? "EN" : "ID"}
    </Link>
  );
}
