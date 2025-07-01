"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DocsMetadaum, fetchMediaDocs, fetchMediaPlaylists, Playlist } from "./utils/media";
import Image from "next/image";
import { BackRouteButton, Button, usePreferences } from "@/components";
import { YoutubeCard } from "./youtube-card";
import { usePersistedState } from "./hooks/usePersistedState";

const PlaylistCard = ({
  playlist,
  onPlaylistClicked,
}: {
  playlist: Playlist;
  onPlaylistClicked: (id: string) => void;
}) => {
  const [error, setError] = useState(false);

  const thumbnail = !error
    ? playlist.image_big?.src || playlist.image_small?.src || "https://placehold.co/320x180"
    : "https://placehold.co/320x180";

  return (
    <button onClick={() => onPlaylistClicked(playlist.diocoPlaylistId)} className="active:opacity-80 transition w-full">
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
          <p className="text-sm text-secondary">共 {playlist.satisfiesFiltersCount} 部</p>
        </div>
      </div>
    </button>
  );
};

export function VideoChannels() {
  const { isSimplified } = usePreferences();
  const lang = isSimplified ? "zh-CN" : "zh-TW";

  const [selectedPlaylistId, setSelectedPlaylistId] = usePersistedState<string | undefined>(
    "selected-playlist-id",
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

  const { data: docs, isLoading: isLoadingDocs } = useQuery({
    queryKey: ["docs", selectedPlaylistId, vocabRange, lang],
    queryFn: () => {
      if (selectedPlaylistId) {
        return fetchMediaDocs({
          diocoPlaylistId: selectedPlaylistId,
          freq95: { min: vocabRange[0], max: vocabRange[1] },
          lang_G: lang,
        });
      }
    },
    enabled: typeof selectedPlaylistId === "string",
  });

  const doc = docs?.data.docs_metadata[0];

  return (
    <div>
      <div className="px-3">{isLoadingPlaylists && !isLoadingDocs && <p className="mt-4">Loading...</p>}</div>

      {selectedPlaylistId && (
        <div className="relative overflow-y-auto scrollbar h-[calc(100vh-108px-33px)]">
          <div className="sticky top-0 z-50 bg-black">
            <button
              onClick={() => setSelectedPlaylistId(undefined)}
              className="flex items-center gap-2 px-4 py-3 rounded-br-xl group"
            >
              <div className="w-8 h-8 relative overflow-hidden rounded-full group-active:opacity-80">
                {doc && (
                  <Image
                    src={`https://api-cdn.dioco.io/mmd_ytChannelThumb/88/${doc.info.channelId}`}
                    width={100}
                    height={100}
                    alt="avatar"
                  />
                )}
              </div>
              <p className="font-medium text-smokewhite group-active:opacity-80">Back to Channel List</p>
            </button>
          </div>
          <div className="px-3">{isLoadingDocs && <p className="mt-4">Loading...</p>}</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:max-md:px-3">
            {docs?.data?.docs_metadata?.map((doc) => {
              return <YoutubeCard key={doc.diocoDocId} doc={doc} />;
            })}
          </div>
        </div>
      )}

      {!selectedPlaylistId && (
        <div className="mt-4 max-sm:p-3 grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] place-items-start gap-8 sm:max-md:px-3">
          {playlists?.data?.playlists?.map((playlist) => {
            return (
              <PlaylistCard
                key={playlist.diocoPlaylistId}
                playlist={playlist}
                onPlaylistClicked={setSelectedPlaylistId}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
