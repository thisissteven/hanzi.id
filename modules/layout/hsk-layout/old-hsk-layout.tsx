import React from "react";
import { DesktopSidebar, LastViewedHanzi } from "@/modules/old-hsk";
import { Layout } from "../layout";
import { AnimatePresence } from "framer-motion";
import { ReplaceRouteButton } from "@/components";
import { useLocale } from "@/locales/use-locale";
import { AudioProvider } from "./audio-provider";

export function OldHSKLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLocale();
  return (
    <Layout>
      <LastViewedHanzi />
      <AudioProvider>
        <AnimatePresence mode="wait">
          <Layout>
            <header className="fixed z-50 top-0 left-0 w-screen h-16 grid place-items-center bg-black border-b border-b-secondary/10">
              <ReplaceRouteButton path="/">
                <div className="mb-[3px]">&#8592;</div> {t.return}
              </ReplaceRouteButton>
            </header>
            <div className="mx-auto text-smokewhite max-w-[1440px] flex gap-1">
              <DesktopSidebar />
              {children}
            </div>
          </Layout>
        </AnimatePresence>
      </AudioProvider>
    </Layout>
  );
}
