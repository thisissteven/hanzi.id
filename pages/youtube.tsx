import React from "react";
import { BackRouteButton } from "@/components";
import { AudioProvider, Layout } from "@/modules/layout";
import { VideoContainer } from "@/modules/youtube";
import { FlashcardProvider } from "@/modules/flashcards";

export default function Youtube() {
  return (
    <Layout>
      <div className="min-h-[200dvh]">
        <main className="max-w-[960px] mx-auto md:px-8 pb-4">
          <div className="max-md:sticky top-0 flex flex-col justify-end bg-black z-10 max-md:px-2 pb-2 border-b-[1.5px] border-b-subtle">
            <div className="w-fit">
              <BackRouteButton />
            </div>
          </div>

          <AudioProvider>
            <FlashcardProvider>
              <VideoContainer />
            </FlashcardProvider>
          </AudioProvider>
        </main>
      </div>
    </Layout>
  );
}
