import React from "react";
import { BackRouteButton } from "@/components";
import { Layout } from "@/modules/layout";
import Image from "next/image";
import useSWRImmutable from "swr/immutable";
import { useRouter } from "next/router";

type Podcast = {
  id: string;
  minutes: number;
  publishedAt: string;
  title: string;
  description: string;
  thumbnails: {
    high: {
      url: string;
      width: number;
      height: number;
    };
  };
};

export default function Podcast() {
  const { data: podcasts } = useSWRImmutable<Podcast[]>("https://content.hanzi.id/subtitles/videos.json");

  const router = useRouter();

  return (
    <Layout>
      <div className="min-h-[200dvh]">
        <main className="max-w-[960px] mx-auto md:px-8 pb-4">
          <div className="max-md:sticky top-0 flex flex-col justify-end bg-black z-10 max-md:px-2 pb-2 border-b-[1.5px] border-b-subtle">
            <div className="w-fit">
              <BackRouteButton />
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            {podcasts
              ?.sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
              .map((podcast) => {
                return (
                  <div
                    key={podcast.id}
                    className="flex flex-col max-sm:border-b max-sm:border-b-secondary/10 sm:flex-row cursor-pointer"
                    onClick={() => {
                      router.push(`/podcast/${podcast.id}`);
                    }}
                  >
                    <div className="relative bg-[#000000] w-full sm:w-40 shrink-0 aspect-video">
                      <Image
                        src={podcast.thumbnails.high.url}
                        alt={podcast.title}
                        width={podcast.thumbnails.high.width}
                        height={podcast.thumbnails.high.height}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="p-4">
                      <h2 className="text-lg font-bold">{podcast.title}</h2>
                      <div className="space-x-2">
                        <div className="max-md:mt-4 mt-3 inline-flex text-xs items-center rounded-full bg-blue-500/10 dark:bg-blue-400/10 px-2 py-1 font-medium text-blue-500 dark:text-blue-400 ring-1 ring-inset ring-blue-500/20 dark:ring-blue-400/20">
                          {podcast.minutes} minutes
                        </div>
                        <div className="max-md:mt-4 mt-3 inline-flex text-xs items-center rounded-full bg-slate-500/10 dark:bg-slate-400/10 px-2 py-1 font-medium text-slate-500 dark:text-slate-400 ring-1 ring-inset ring-slate-500/20 dark:ring-slate-400/20">
                          {new Date(podcast.publishedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </main>
      </div>
    </Layout>
  );
}
