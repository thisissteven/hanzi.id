import React from "react";
import { BackRouteButton } from "@/components";
import { VideoContainer } from "@/modules/youtube";
import { Layout } from "@/modules/layout";
import { useLocale } from "@/locales/use-locale";
import { cn } from "@/utils";
import { WatchHistory } from "@/modules/youtube/watch-history";
import { usePersistedState } from "@/modules/youtube/hooks/usePersistedState";
import { VideoChannels } from "@/modules/youtube/video-channels";

export default function Youtube() {
  const [category, setCategory] = usePersistedState<number | undefined>("youtube-category", undefined);

  const { t } = useLocale();

  return (
    <Layout>
      <div>
        <main className="max-w-[960px] mx-auto md:px-8 pb-4">
          <div className="sticky top-0 flex flex-col justify-end bg-black z-10 max-md:px-2 pb-4 border-b-[1.5px] border-b-subtle">
            <div className="w-fit">
              <BackRouteButton />
            </div>

            <div className="mt-2">
              <div className="flex">
                <button
                  className={cn("px-3 duration-200", category === 0 ? "opacity-100" : "opacity-50")}
                  onClick={() => setCategory(0)}
                >
                  {t.youtube.buttons[0]}
                </button>
                <button
                  className={cn("px-3 duration-200", category === 1 ? "opacity-100" : "opacity-50")}
                  onClick={() => setCategory(1)}
                >
                  {t.youtube.buttons[1]}
                </button>
                <button
                  className={cn("px-3 duration-200", category === 2 ? "opacity-100" : "opacity-50")}
                  onClick={() => setCategory(2)}
                >
                  {t.youtube.buttons[2]}
                </button>
              </div>
            </div>
          </div>

          {category === 0 && <VideoContainer />}
          {category === 1 && <VideoChannels />}
          {category === 2 && <WatchHistory />}
        </main>
      </div>
    </Layout>
  );
}
