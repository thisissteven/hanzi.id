import React from "react";
import { Layout } from "@/modules/layout";
import { BackRouteButton, Textarea } from "@/components";
import { useLocale } from "@/locales/use-locale";
import { useRouter } from "next/router";

export default function TeleprompterPage() {
  const { t } = useLocale();

  const router = useRouter();

  return (
    <Layout>
      <div className="min-h-dvh">
        <main className="max-w-[960px] mx-auto md:px-8">
          <div className="max-md:sticky top-0 h-[11.25rem] flex flex-col justify-end bg-black z-10 max-md:px-2 pb-2 border-b-[1.5px] border-b-subtle">
            <div className="w-fit">
              <BackRouteButton />
            </div>
          </div>

          <form
            className="max-md:px-3 mt-4"
            onSubmit={async (e) => {
              e.preventDefault();
              const target = e.target as typeof e.target & { 0: { value: string } };
              const text = target[0].value;

              router.push({
                pathname: "/teleprompter/read",
                query: { text },
              });
            }}
          >
            <Textarea placeholder={t.teleprompter.placeholder} required />

            <div className="mt-4 md:flex justify-end">
              <button className="rounded-md font-medium max-md:w-full text-black dark:text-white p-2.5 md:py-2 md:px-4 duration-200 bg-emerald-600 active:bg-emerald-700 disabled:opacity-50">
                <React.Fragment>{t.teleprompter.submit} &#8594;</React.Fragment>
              </button>
            </div>
          </form>
        </main>
      </div>
    </Layout>
  );
}
