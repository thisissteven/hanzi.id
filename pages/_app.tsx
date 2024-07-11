import "@/styles/globals.css";

import { ThemeProvider } from "next-themes";
import { SWRConfig } from "swr";
import type { AppProps } from "next/app";

import { PreferencesProvider, Seo } from "@/components";
import { apiClient } from "@/utils";
import { AnimatePresence } from "framer-motion";
import {
  ConfettiProvider,
  HSKLayout,
  NewReadingLayout,
  OldHSKLayout,
  ReadingLayout,
  ToolsLayout,
} from "@/modules/layout";
import React from "react";

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/modules/auth";
import { Toaster } from "sonner";

import { Analytics } from "@vercel/analytics/react";
import { SearchCommandMenu } from "@/modules/search";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

if (typeof window !== "undefined") {
  // checks that we are client-side
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    person_profiles: "always", // or 'always' to create profiles for anonymous users as well
    loaded: (posthog) => {
      if (process.env.NODE_ENV === "development") posthog.debug(); // debug mode in development
    },
  });
}

export default function App({ Component, pageProps, router }: AppProps) {
  const isNewReading = router.pathname.startsWith("/new");
  const isTools = router.pathname.startsWith("/tools");
  const isHsk = router.pathname.startsWith("/hsk");
  const isOldHsk = router.pathname.startsWith("/old-hsk");
  const isReading = router.pathname.startsWith("/read");

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

  React.useEffect(() => {
    document.body.style.overflowY = "scroll";
    document.documentElement.style.scrollbarGutter = "";
  }, [router.pathname]);

  React.useEffect(() => {
    // Track page views
    const handleRouteChange = () => posthog?.capture("$pageview");
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider forcedTheme="dark" attribute="class">
      <Seo />

      <Toaster position="top-center" />

      {process.env.NODE_ENV === "production" && <Analytics />}

      <SWRConfig
        value={{
          fetcher: (url) => {
            if (url.includes("undefined")) return undefined;
            return apiClient.get(url).then((res) => res.data);
          },
        }}
      >
        <SessionProvider session={pageProps.session}>
          <PreferencesProvider>
            <SearchCommandMenu />
            <AuthProvider>
              <ConfettiProvider>
                <PostHogProvider client={posthog}>
                  <AnimatePresence mode="wait">
                    {isNewReading ? (
                      <NewReadingLayout key="new-reading">
                        <Component key={router.pathname} {...pageProps} />
                      </NewReadingLayout>
                    ) : isTools ? (
                      <ToolsLayout key="tools">
                        <Component key={router.pathname} {...pageProps} />
                      </ToolsLayout>
                    ) : isReading ? (
                      <ReadingLayout key="reading">
                        <Component key={router.pathname} {...pageProps} />
                      </ReadingLayout>
                    ) : isHsk ? (
                      <HSKLayout key="hsk">
                        <Component key={router.pathname} {...pageProps} />
                      </HSKLayout>
                    ) : isOldHsk ? (
                      <OldHSKLayout key="old-hsk">
                        <Component key={router.pathname} {...pageProps} />
                      </OldHSKLayout>
                    ) : (
                      <Component key={router.pathname} {...pageProps} />
                    )}
                  </AnimatePresence>
                </PostHogProvider>
              </ConfettiProvider>
            </AuthProvider>
          </PreferencesProvider>
        </SessionProvider>
      </SWRConfig>
    </ThemeProvider>
  );
}
