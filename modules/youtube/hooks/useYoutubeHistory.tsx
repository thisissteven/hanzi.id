"use client";

import { fetchYTMetadata } from "../utils/media";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

const LOCAL_STORAGE_KEY = "yt_watch_history";
const MAX_HISTORY = 100;

export interface WatchHistoryEntry {
  videoId: string;
  lang: string;
  title: string;
  author_name: string;
  author_url: string;
  thumbnail_url: string;
  lastTimestamp: number;
  maxTimestamp: number;
}

export function useYouTubeHistory() {
  const queryClient = useQueryClient();

  const updateHistory = useCallback(
    async (videoId: string, lang: string, lastTimestamp: number, maxTimestamp: number) => {
      if (typeof window === "undefined") return;

      // Prefetch metadata or use cache if available
      const metadata = await queryClient.fetchQuery({
        queryKey: ["ytMetadata", videoId],
        queryFn: () => fetchYTMetadata(videoId),
      });

      const newEntry: WatchHistoryEntry = {
        videoId,
        lang,
        title: metadata.title,
        author_name: metadata.author_name,
        author_url: metadata.author_url,
        thumbnail_url: metadata.thumbnail_url,
        lastTimestamp,
        maxTimestamp,
      };

      // Read existing history
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      let history: WatchHistoryEntry[] = raw ? JSON.parse(raw) : [];

      // Remove duplicates (by videoId)
      history = history.filter((entry) => entry.videoId !== videoId);

      // Add new entry to top
      history.unshift(newEntry);

      // Limit to most recent 50
      if (history.length > MAX_HISTORY) {
        history = history.slice(0, MAX_HISTORY);
      }

      // Save back to localStorage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(history));
    },
    [queryClient]
  );

  const getHistory = useCallback((): WatchHistoryEntry[] => {
    if (typeof window === "undefined") return [];

    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }, []);

  return { updateHistory, getHistory };
}
