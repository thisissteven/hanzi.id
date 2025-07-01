import { useState } from "react";
import { DocsMetadaum, formatTime } from "./utils/media";
import Image from "next/image";
import Link from "next/link";

export const YoutubeCard = ({ doc }: { doc: DocsMetadaum }) => {
  const [error, setError] = useState(false);

  if (error) return null;

  return (
    <Link
      key={doc.diocoDocId}
      href={`/youtube/${doc.info.videoId}?lang=${doc.lang_G}`}
      className="active:opacity-80 transition"
    >
      <div className="overflow-hidden">
        <div className="relative sm:rounded-lg overflow-hidden aspect-video">
          <Image
            onError={() => setError(true)}
            onLoad={(e) => {
              const img = e.currentTarget;
              // Detect placeholder image heuristically
              if (img.naturalWidth <= 120 && img.naturalHeight <= 90) {
                setError(true);
              }
            }}
            src={error ? "https://placehold.co/320x180" : doc.image.src}
            alt="thumbnail"
            className="w-full h-full object-cover"
            width={480}
            height={360}
          />
          <span className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 inline-flex items-center rounded-md bg-subtle/80 px-2 py-1 text-xs font-medium text-secondary-100 ring-inset">
            {formatTime(doc.duration_ms / 1000)}
          </span>
        </div>
        <div className="mt-4 flex gap-2">
          <div className="relative rounded-full overflow-hidden w-10 h-10">
            <Image
              src={`https://api-cdn.dioco.io/mmd_ytChannelThumb/88/${doc.info.channelId}`}
              alt="avatar"
              className="w-full h-full object-cover"
              width={88}
              height={88}
            />
          </div>
          <div className="-mt-0.5 flex-1 space-y-1">
            <p className="font-medium text-smokewhite line-clamp-2">
              {doc.diocoDocName_translation?.translation || doc.diocoDocName}
            </p>
            <p className="text-sm text-secondary">
              {new Date(doc.publishDate.timestamp_unixms).toLocaleDateString()} • {doc.info.viewCount} views
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};
