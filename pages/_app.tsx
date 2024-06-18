import "@/styles/globals.css";

import { ThemeProvider } from "next-themes";
import { SWRConfig } from "swr";
import type { AppProps } from "next/app";

import { Seo } from "@/components";
import { apiClient } from "@/utils";
import { AnimatePresence } from "framer-motion";
import { ConfettiProvider, NewReadingLayout } from "@/modules/layout";
import React from "react";

export default function App({ Component, pageProps, router }: AppProps) {
  const isNewReading = router.pathname.startsWith("/new");
  return (
    <ThemeProvider forcedTheme="dark">
      <Seo />
      <SWRConfig
        value={{
          fetcher: (url) => {
            if (url.includes("undefined")) return undefined;
            return apiClient.get(url).then((res) => res.data);
          },
        }}
      >
        <ConfettiProvider>
          <AnimatePresence mode="wait">
            {isNewReading ? (
              <NewReadingLayout>
                <Component key={router.pathname} {...pageProps} />
              </NewReadingLayout>
            ) : (
              <Component key={router.pathname} {...pageProps} />
            )}
          </AnimatePresence>
        </ConfettiProvider>
      </SWRConfig>
    </ThemeProvider>
  );
}
