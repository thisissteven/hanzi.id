interface FreqRange {
  min: number;
  max: number;
}

interface DurationRange {
  min: number | null;
  max: number | null;
}

interface FetchMediaParams {
  freq95?: FreqRange;
  searchText?: string;
  sortBy?: string;
  duration?: DurationRange;
  lang_G?: string;
}

interface FetchMediaDocsParams extends FetchMediaParams {
  diocoPlaylistId: string;
  forceIncludeDiocoDocId?: string | null;
  lang_G?: string;
}

const BASE_FILTERS = {
  mediaTab: "TAB_YOUTUBE",
  searchText: "",
  duration: { min: null, max: null },
  sortBy: "date",
};

export interface Playlist {
  lang_G: string;
  title: string;
  title_translation: TitleTranslation;
  diocoPlaylistId: string;
  description?: string;
  description_translation?: DescriptionTranslation;
  image_small?: ImageSmall;
  image_big?: ImageBig;
  count: number;
  satisfiesFiltersCount: number;
  type: string;
}

export interface TitleTranslation {
  translation: string;
  destLang_G: string;
}

export interface DescriptionTranslation {
  translation: string;
  destLang_G: string;
}

export interface ImageSmall {
  type: string;
  src: string;
}

export interface ImageBig {
  type: string;
  src: string;
}

export interface Data {
  docs_metadata: DocsMetadaum[];
}

export interface DocsMetadaum {
  mediaClass: string;
  source: string;
  diocoDocName: string;
  diocoDocName_translation: DiocoDocNameTranslation;
  diocoDocId: string;
  lang_G: string;
  description: string;
  description_translation: any;
  image: Image;
  publishDate: PublishDate;
  freqRank95: number;
  freq95Bucket: number;
  popularityScore: number;
  info: Info;
  duration_ms: number;
  durationBucket_ms: number;
  subsAvailable: SubsAvailable;
}

export interface DiocoDocNameTranslation {
  translation: string;
  destLang_G: string;
}

export interface Image {
  type: string;
  src: string;
}

export interface PublishDate {
  type: string;
  timestamp_unixms: number;
}

export interface Info {
  videoId: string;
  viewCount: number;
  channelId: string;
  channelName: string;
}

export interface SubsAvailable {
  YT: boolean;
  DIOCO_ASR: boolean;
}

export function formatTime(seconds: number): string {
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

export async function fetchMediaPlaylists({
  freq95 = { min: 0, max: 100000 },
  searchText = "",
  sortBy = "date",
  duration = { min: null, max: null },
  lang_G = "es",
}: FetchMediaParams): Promise<{ data: { playlists: Playlist[] } }> {
  const payload = {
    auth: null,
    translationLang_G: "en",
    freq95,
    lang_G,
    filters: {
      ...BASE_FILTERS,
      searchText,
      sortBy,
      duration,
    },
    pinnedDiocoPlaylistIds: [],
  };

  const response = await fetch("https://api-cdn.dioco.io/base_media_getMediaPlaylists_5", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch media playlists: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchMediaDocs({
  diocoPlaylistId,
  freq95 = { min: 0, max: 100000 },
  searchText = "",
  sortBy = "date",
  duration = { min: null, max: null },
  forceIncludeDiocoDocId = null,
  lang_G = "es",
}: FetchMediaDocsParams): Promise<{ data: Data }> {
  const payload = {
    auth: null,
    translationLang_G: "en",
    freq95,
    lang_G,
    filters: {
      ...BASE_FILTERS,
      searchText,
      sortBy,
      duration,
    },
    pinnedDiocoPlaylistIds: [],
    diocoPlaylistId,
    forceIncludeDiocoDocId,
  };

  const response = await fetch("https://api-cdn.dioco.io/base_media_getMediaDocs_5", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch media docs: ${response.statusText}`);
  }

  return response.json();
}

export interface YTMetadata {
  title: string;
  author_name: string;
  author_url: string;
  type: string;
  height: number;
  width: number;
  version: string;
  provider_name: string;
  provider_url: string;
  thumbnail_height: number;
  thumbnail_width: number;
  thumbnail_url: string;
  html: string;
}

export async function fetchYTMetadata(videoId: string): Promise<YTMetadata> {
  const response = await fetch(
    `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch youtube video metadata: ${response.statusText}`);
  }

  return response.json();
}
