import React from "react";
import clsx from "clsx";
import { formatFileSize } from "./utils";
import { LucideFile, LucideTrash2 } from "lucide-react";
import { useLocale } from "@/locales/use-locale";

export function FileInputImage({
  onChange,
  disabled = false,
}: {
  onChange: (blob: string[]) => void;
  disabled?: boolean;
}) {
  const [fileNames, setFileNames] = React.useState<string[]>([]);
  const [fileSize, setFileSize] = React.useState<string | null>(null);
  const [blobUrls, setBlobUrls] = React.useState<string[]>([]);

  const { t } = useLocale();

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) return;

    const firstFile = files[0];
    const fileBlobs = Array.from(files).map((file) => URL.createObjectURL(file));

    onChange(fileBlobs);
    setFileNames(Array.from(files).map((file) => file.name));
    setFileSize(formatFileSize(firstFile.size));
    setBlobUrls(fileBlobs);
  }

  return (
    <div
      className={clsx(
        "rounded-md border border-secondary/40 border-dashed w-full",
        disabled && "cursor-not-allowed opacity-50",
        "max-md:min-h-60"
      )}
    >
      <div className={clsx("relative w-full h-full grid place-items-center", disabled && "pointer-events-none")}>
        <div className="grid place-items-center gap-2 w-full px-4">
          <LucideFile className="w-10 h-10 text-secondary" />
          <p className="text-secondary text-center">
            {t.fileUploadText[0]} <span className="font-medium text-sky-500">{t.fileUploadText[1]}</span>{" "}
            {t.fileUploadText[2]}
          </p>
          {fileNames.length > 0 && (
            <div className="mt-2 relative z-10 rounded-md border border-secondary/10 bg-softblack p-4 w-full max-w-sm">
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <button
                  disabled={disabled}
                  onClick={() => {
                    setFileNames([]);
                    setFileSize(null);
                    setBlobUrls([]);
                    onChange([]);
                  }}
                  type="button"
                  className="rounded p-2 duration-200 text-secondary hover:text-sky-500"
                  aria-label="Remove files"
                >
                  <LucideTrash2 className="h-5 w-5 shrink-0" />
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center">
                  <LucideFile className="h-5 w-5 shrink-0" />
                </span>
                <div className="pr-8 overflow-hidden">
                  <a
                    href={blobUrls[0]}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-sky-500 line-clamp-1 hover:underline"
                  >
                    {fileNames[0]}
                  </a>
                  <p className="mt-0.5 text-secondary text-xs">
                    {fileSize}{" "}
                    {fileNames.length > 1 && (
                      <span className="mt-0.5 text-secondary text-xs">
                        +{fileNames.length - 1} {t.moreImages}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        <input
          disabled={disabled}
          type="file"
          accept="image/jpeg, image/png, image/gif, image/webp"
          multiple
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileUpload}
        />
      </div>
      <div className="mt-2">
        <p className="text-secondary">
          {t.fileMakeSureImage[0]} <b>{t.fileMakeSureImage[1]}</b>
        </p>
      </div>
    </div>
  );
}
