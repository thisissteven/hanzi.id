"use client";

import { usePreferences } from "@/components";
import { useYouTubeHistory } from "./hooks/useYoutubeHistory";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const pad = (num: number) => String(num).padStart(2, "0");

  if (h > 0) {
    return `${h}:${pad(m)}:${pad(s)}`;
  } else {
    return `${m}:${pad(s)}`;
  }
}

export function WatchHistory() {
  const isSimplified = usePreferences();
  const lang = isSimplified ? "zh-CN" : "zh-TW";

  const { getHistory } = useYouTubeHistory();

  const history = useMemo(() => {
    return getHistory().filter((metadata) => metadata.lang === lang);
  }, [getHistory, lang]);

  return (
    <div className="max-sm:-mt-4 sm:mt-4 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:max-md:px-3">
        {history.length === 0 ? (
          <p className="text-sm">You have watched 0 videos.</p>
        ) : (
          history.map((metadata) => {
            return (
              <Link
                key={metadata.videoId}
                href={`/youtube/${metadata.videoId}?lang=${metadata.lang}&last_watched=${metadata.lastTimestamp}`}
                className="active:opacity-80 transition"
              >
                <div className="overflow-hidden">
                  <div className="relative sm:rounded-lg overflow-hidden aspect-video">
                    <Image
                      src={metadata.thumbnail_url}
                      alt="thumbnail"
                      className="w-full h-full object-cover"
                      width={480}
                      height={360}
                    />
                    <span className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 inline-flex items-center rounded-md bg-subtle/80 px-2 py-1 text-xs font-medium text-secondary-100 ring-inset">
                      {formatTime(metadata.maxTimestamp)}
                    </span>
                    <div className="absolute bottom-0 left-0 right-0 h-1 w-full bg-subtle">
                      <div
                        className="bg-red-500 dark:bg-red-500 h-full"
                        style={{
                          width: `${(metadata.lastTimestamp / metadata.maxTimestamp) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2 max-sm:px-3">
                    {/* <div className="relative rounded-full overflow-hidden w-10 h-10">
                      <Image
                        src={`https://api-cdn.dioco.io/mmd_ytChannelThumb/88/${metadata.channelId}`}
                        alt="avatar"
                        className="w-full h-full object-cover"
                        width={88}
                        height={88}
                      />
                    </div> */}

                    <div className="-mt-0.5 flex-1 space-y-1">
                      <p className="font-medium text-smokewhite line-clamp-2">{metadata.title}</p>
                      <p className="text-sm text-secondary">{metadata.author_name}</p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
