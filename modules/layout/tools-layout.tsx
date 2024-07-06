import { AnimatePresence, motion } from "framer-motion";
import { Layout } from "./layout";

import React from "react";

import { usePathname } from "next/navigation";
import { BackRouteButton } from "@/components";

export function ToolsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <Layout>
      <div className="min-h-dvh">
        <main className="max-w-[960px] mx-auto md:px-8 pb-4">
          <div className="max-md:sticky top-0 md:h-[11.25rem] flex flex-col justify-end bg-black z-20 max-md:px-4 border-b-[1.5px] border-b-subtle">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "tween", duration: 0.2 }}
                className="w-fit"
              >
                <BackRouteButton className="max-md:my-3 mb-2" />
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">{children}</AnimatePresence>
        </main>
      </div>
    </Layout>
  );
}
