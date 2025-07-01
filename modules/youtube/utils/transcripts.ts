export function parseTimeString(time: string) {
  const [h, m, s] = time.split(":").map(Number);
  return h * 3600 + m * 60 + s;
}

export function formatTime(ms: number): string {
  const totalSeconds = Math.round(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds].map((unit) => String(unit).padStart(2, "0")).join(":");
}

export function getYouTubeVideoId(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;

    // Handle standard watch URL: https://www.youtube.com/watch?v=VIDEO_ID
    if (hostname.includes("youtube.com")) {
      const id = parsedUrl.searchParams.get("v");
      if (id) return id;
    }

    // Handle short URL: https://youtu.be/VIDEO_ID
    if (hostname === "youtu.be") {
      return parsedUrl.pathname.slice(1); // remove leading "/"
    }

    // Fallback: try extracting from path
    const match = url.match(/(?:\/embed\/|\/v\/|\/shorts\/)([a-zA-Z0-9_-]{11})/);
    if (match && match[1]) {
      return match[1];
    }
  } catch {
    // Invalid URL
  }

  return null;
}

export interface TranscriptMeta {
  videoId: string;
  videoInfo: {
    name: string;
    thumbnailUrl: {
      hqdefault: string;
      maxresdefault: string;
    };
    embedUrl: string;
    duration: string;
    description: string;
    upload_date: string;
    genre: string;
    author: string;
    channel_id: string;
  };
  language_code: { code: string; name: string }[];
}

export async function fetchTranscripts(lang: string): Promise<TranscriptMeta[]> {
  const res = await fetch(`https://api.github.com/repos/thisissteven2/lang-learn/contents/transcripts/${lang}`, {
    headers: {
      Authorization: `token ${process.env.NEXT_PUBLIC_GITHUB_ACCESS_TOKEN}`,
    },
    cache: "no-store",
  });
  const files = await res.json();
  const jsonFiles = files.filter((file: any) => file.name.endsWith(".json"));

  const promises = jsonFiles.map(async (file: any) => {
    const contentRes = await fetch(file.download_url);
    return await contentRes.json();
  });

  return Promise.all(promises);
}

// src/lib/fetchTranscript.ts

export interface TranscriptEntry {
  start: string;
  end: string;
  text: string;
}

export interface TranscriptData {
  videoId: string;
  videoInfo: {
    name: string;
    embedUrl: string;
  };
  transcripts: Record<string, TranscriptEntry[]>;
}

export async function fetchTranscript(lang: string, videoId: string): Promise<TranscriptData> {
  const res = await fetch(
    `https://api.github.com/repos/thisissteven2/lang-learn/contents/transcripts/${lang}/${videoId}.json`,
    {
      headers: {
        Authorization: `token ${process.env.NEXT_PUBLIC_GITHUB_ACCESS_TOKEN}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch transcript for ${videoId} (${lang})`);
  }

  const fileMeta = await res.json();
  const contentRes = await fetch(fileMeta.download_url);

  if (!contentRes.ok) {
    throw new Error(`Failed to download JSON from GitHub for ${videoId}`);
  }

  return await contentRes.json();
}
