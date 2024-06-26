import React from "react";

import { Home } from "@/modules/home";
import { Layout } from "@/modules/layout";

export default function Index() {
  return (
    <Layout>
      <div className="min-h-dvh">
        <main className="max-w-[960px] mx-auto px-4 md:px-8 pt-32 pb-6">
          <Home />
        </main>
      </div>
    </Layout>
  );
}
