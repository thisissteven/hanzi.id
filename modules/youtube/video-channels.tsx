"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DocsMetadaum, fetchMediaDocs, fetchMediaPlaylists, formatTime, Playlist } from "./utils/media";
import Image from "next/image";
import Link from "next/link";
import { usePersistedState } from "./hooks/usePersistedState";
import { usePreferences } from "@/components";

const PlaylistCard = ({ playlist }: { playlist: Playlist }) => {
  const [error, setError] = useState(false);

  const thumbnail = !error
    ? playlist.image_big?.src || playlist.image_small?.src || "https://placehold.co/320x180"
    : "https://placehold.co/320x180";

  return (
    <button className="active:opacity-80 transition">
      <div className="overflow-hidden">
        <div className="relative rounded-full overflow-hidden aspect-square">
          <Image
            onError={() => setError(true)}
            onLoad={(e) => {
              const img = e.currentTarget;
              if (img.naturalWidth <= 120 && img.naturalHeight <= 90) {
                setError(true);
              }
            }}
            src={thumbnail}
            alt="thumbnail"
            className="w-full h-full object-cover"
            width={480}
            height={360}
          />
        </div>
        <div className="mt-4 space-y-1 px-1">
          <p className="font-medium text-smokewhite line-clamp-2">
            {playlist.title_translation?.translation || playlist.title}
          </p>
          <p className="text-sm text-secondary">
            共 {playlist.count} 部影片 • 符合篩選：{playlist.satisfiesFiltersCount} 部
          </p>
        </div>
      </div>
    </button>
  );
};

export function VideoChannels() {
  const { isSimplified } = usePreferences();
  const lang = isSimplified ? "zh-CN" : "zh-TW";

  const [selectedPlaylistId, setSelectedPlaylistId] = usePersistedState<string | undefined>(
    "selectedPlaylistId",
    undefined
  );
  const [vocabRange] = useState<number[]>([0, 100000]);

  const { data: playlists, isLoading: isLoadingPlaylists } = useQuery({
    queryKey: ["playlists", lang],
    queryFn: () => fetchMediaPlaylists({ freq95: { min: vocabRange[0], max: vocabRange[1] }, lang_G: lang }),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return (
    <div>
      <div className="mt-4 px-3">{isLoadingPlaylists && <p>Loading...</p>}</div>

      <div className="max-sm:-mt-4 max-sm:p-3 grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(120px,1fr))] place-items-start gap-8 sm:max-md:px-3">
        {playlists?.data?.playlists?.map((playlist) => {
          return <PlaylistCard key={playlist.diocoPlaylistId} playlist={playlist} />;
        })}
      </div>
    </div>
  );
}
