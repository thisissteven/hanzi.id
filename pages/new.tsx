import { Divider } from "@/components";
import { Layout } from "@/modules/layout";
import { NewReading, NewReadingOnboarding } from "@/modules/new";
import { AnimatePresence } from "framer-motion";
import React from "react";

type ReadingType = "pdf" | "text" | "image";

export default function New() {
  const [readingType, setReadingType] = React.useState<ReadingType | null>();
  return (
    <Layout>
      <div className="min-h-dvh">
        <main className="max-w-[960px] mx-auto px-4 md:px-8 pt-32 pb-8">
          <h1 className="text-2xl md:text-3xl font-bold">New Reading</h1>

          <Divider />

          <AnimatePresence mode="wait" initial={false}>
            {readingType ? (
              <NewReading key="new" type={readingType} onReturn={() => setReadingType(null)} />
            ) : (
              <NewReadingOnboarding onSelected={(type) => setReadingType(type)} />
            )}
          </AnimatePresence>
        </main>
      </div>
    </Layout>
  );
}
