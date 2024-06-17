import React from "react";

import { Onboarding, useOnboarded } from "@/modules/onboarding";
import { AnimatePresence } from "framer-motion";
import { Home } from "@/modules/home";
import { Layout } from "@/modules/layout";

export default function Index() {
  const { isOnboarded, setIsOnboarded } = useOnboarded();

  return (
    <Layout>
      <div className="min-h-dvh">
        <main className="max-w-[960px] mx-auto px-4 md:px-8 pt-32 pb-8">
          <AnimatePresence mode="wait">
            {isOnboarded ? (
              <Home key="home" />
            ) : (
              <Onboarding
                onContinue={() => {
                  setIsOnboarded(true);
                  localStorage.setItem("focus_onboarded", "true");
                }}
              />
            )}
          </AnimatePresence>
        </main>
      </div>
    </Layout>
  );
}
