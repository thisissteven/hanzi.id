import "@/styles/globals.css";

import { ThemeProvider } from "next-themes";
import { SWRConfig } from "swr";
import type { AppProps } from "next/app";

import { Seo } from "@/components";
import { apiClient } from "@/utils";
import { AnimatePresence } from "framer-motion";
import { ConfettiProvider, HSKLayout, NewReadingLayout } from "@/modules/layout";
import React from "react";

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/modules/auth";

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export default function App({ Component, pageProps, router }: AppProps) {
  const isNewReading = router.pathname.startsWith("/new");
  const isHsk = router.pathname.startsWith("/hsk");

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (isHsk) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflowY = "scroll";
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [isHsk]);

  return (
    <ThemeProvider forcedTheme="dark" attribute="class">
      <Seo />

      <SWRConfig
        value={{
          fetcher: (url) => {
            if (url.includes("undefined")) return undefined;
            return apiClient.get(url).then((res) => res.data);
          },
        }}
      >
        <SessionProvider session={pageProps.session}>
          <AuthProvider>
            <ConfettiProvider>
              <AnimatePresence mode="wait">
                {isNewReading ? (
                  <NewReadingLayout>
                    <Component key={router.pathname} {...pageProps} />
                  </NewReadingLayout>
                ) : isHsk ? (
                  <HSKLayout>
                    <Component key={router.pathname} {...pageProps} />
                  </HSKLayout>
                ) : (
                  <Component key={router.pathname} {...pageProps} />
                )}
              </AnimatePresence>
            </ConfettiProvider>
          </AuthProvider>
        </SessionProvider>
      </SWRConfig>
    </ThemeProvider>
  );
}
