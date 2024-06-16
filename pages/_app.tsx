import "@/styles/globals.css";

import { ThemeProvider } from "next-themes";
import { SWRConfig } from "swr";
import type { AppProps } from "next/app";

import { Seo } from "@/components";
import { apiClient } from "@/utils";
import { AnimatePresence } from "framer-motion";

export default function App({ Component, pageProps, router }: AppProps) {
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
        <AnimatePresence mode="wait">
          <Component key={router.pathname} {...pageProps} />
        </AnimatePresence>
      </SWRConfig>
    </ThemeProvider>
  );
}
