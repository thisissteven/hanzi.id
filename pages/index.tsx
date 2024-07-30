import React from "react";

import { Home } from "@/modules/home";
import { Layout } from "@/modules/layout";
import { useLocale } from "@/locales/use-locale";

function HanziIdRedirect() {
  const { t } = useLocale();

  return (
    <a
      target="_blank"
      href="https://dict.hanzi.id"
      className="group whitespace-nowrap -my-2 items-center gap-2 rounded-full px-3 py-2 text-sm ring-1 ring-inset ring-white/[0.08] hover:bg-black/50 hover:ring-white/[0.13] sm:flex md:ml-8 flex"
    >
      <svg className="h-4 w-4 fill-blue-400" viewBox="0 0 24 24">
        <path
          fill-rule="evenodd"
          d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z"
          clip-rule="evenodd"
        ></path>
      </svg>
      <span className="font-semibold">dict.hanzi.id</span>
      <svg width="2" height="2" aria-hidden="true" className="fill-white">
        <circle cx="1" cy="1" r="1"></circle>
      </svg>
      <span className="font-medium">{t.banner}</span>
      <svg
        viewBox="0 0 5 8"
        className="mt-[2px] h-2 w-[5px] fill-lightgray/50 group-hover:fill-lightgray/80 duration-200"
        fill-rule="evenodd"
        clip-rule="evenodd"
        aria-hidden="true"
      >
        <path d="M.2.24A.75.75 0 0 1 1.26.2l3.5 3.25a.75.75 0 0 1 0 1.1L1.26 7.8A.75.75 0 0 1 .24 6.7L3.148 4 .24 1.3A.75.75 0 0 1 .2.24Z"></path>
      </svg>
    </a>
  );
}

export default function Index() {
  return (
    <Layout>
      <div className="min-h-dvh">
        <div className="mt-8 md:mt-12 w-fit mx-auto">
          <HanziIdRedirect />
        </div>
        <main className="max-w-[960px] mx-auto px-4 md:px-8 pt-16 pb-6">
          <Home key="home" />
        </main>
      </div>
    </Layout>
  );
}
