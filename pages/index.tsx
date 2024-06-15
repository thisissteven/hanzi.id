import React from "react";

import { Onboarding } from "@/modules/onboarding";

export default function Home() {
  return (
    <div className="bg-deepblack min-h-dvh">
      <main className="max-w-[960px] mx-auto px-4 md:px-8 py-32">
        <Onboarding />
      </main>
    </div>
  );
}
