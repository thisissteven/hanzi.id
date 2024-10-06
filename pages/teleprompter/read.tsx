import React from "react";
import { Layout } from "@/modules/layout";
import { BackRouteButton, Textarea } from "@/components";
import { useLocale } from "@/locales/use-locale";
import { useRouter } from "next/router";
import { Teleprompter } from "@/modules/teleprompter";

export default function ReadTeleprompterPage() {
  const { t } = useLocale();

  const router = useRouter();

  const text = router.query.text as string;

  return (
    <Layout>
      <div className="min-h-dvh">
        <main className="max-w-[960px] mx-auto md:px-8">
          <div className="max-md:sticky top-0 h-[11.25rem] flex flex-col justify-end bg-black z-10 max-md:px-2 pb-2 border-b-[1.5px] border-b-subtle">
            <div className="w-fit">
              <BackRouteButton />
            </div>
          </div>

          <div className="mt-4 max-w-sm mx-auto">{text && <Teleprompter text={text} />}</div>
        </main>
      </div>
    </Layout>
  );
}
