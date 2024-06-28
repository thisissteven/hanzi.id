import Link from "next/link";
import { useRouter } from "next/router";

export function ChangeLocaleButton() {
  const router = useRouter();
  const asPath = router.asPath;
  const locale = router.locale;
  console.log(asPath);

  return (
    <Link href={asPath} locale={locale === "en" ? "id" : "en"} className="relative z-50">
      {locale === "en" ? "EN" : "ID"}
    </Link>
  );
}
