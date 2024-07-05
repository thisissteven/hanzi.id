"use client";
import React from "react";
import Image from "next/image";

export const FileConverterImage = ({ imageUrls }: { imageUrls: string[] }) => {
  const remainingImages = Math.max(imageUrls.length - 10, 0);

  return (
    <div className="flex gap-2">
      {imageUrls.slice(0, 10).map((url, index) => (
        <div key={index} className="h-40 aspect-square">
          <Image alt="preview" src={url} className="object-cover w-full h-full" width={300} height={300} />
        </div>
      ))}
      {remainingImages > 0 && (
        <div className="flex items-center justify-center h-40 w-40 bg-tremor-background-subtle">
          <p className="p-4 text-secondary">{remainingImages} more images not displayed</p>
        </div>
      )}
    </div>
  );
};
