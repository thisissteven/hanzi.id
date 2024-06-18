import { Layout } from "@/modules/layout";
import React from "react";
import { cn } from "@/utils";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { NewReadingProps } from "./constants";
import Image from "next/image";
import { Divider } from "@/components";

function PlayIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 10 10" className="h-2.5 w-2.5 fill-current">
      <path d="M8.25 4.567a.5.5 0 0 1 0 .866l-7.5 4.33A.5.5 0 0 1 0 9.33V.67A.5.5 0 0 1 .75.237l7.5 4.33Z"></path>
    </svg>
  );
}

export function PreviewContent() {
  const router = useRouter();

  const { getValues } = useFormContext<NewReadingProps>();

  const { title, description, image, chapters } = getValues();

  return (
    <Layout>
      <button
        onClick={() => router.back()}
        type="button"
        className={cn(
          "mt-4 ease duration-500 py-2 pl-3 pr-4 rounded-md",
          "duration-300 hover:bg-hovered active:bg-hovered",
          "flex items-center gap-2"
        )}
        aria-label="Continue"
      >
        <div className="mb-[3px]">&#8592;</div> Return
      </button>

      <div className="mt-2">
        <div className="flex max-md:flex-col max-md:items-center items-end gap-4">
          {image && (
            <div className="relative w-48 rounded-md overflow-hidden aspect-square">
              <Image src={image.source} width={430} height={430} alt="cover" className="object-cover w-full h-full" />
            </div>
          )}

          <div className="max-md:text-center">
            <h1 className="text-2xl font-bold mt-4">{title}</h1>
            <p className="max-md:mt-2 text-secondary">{description}</p>
            <div className="max-md:mt-4 mt-2 inline-flex text-xs items-center rounded-full backdrop-blur-sm bg-blue-400/10 px-2 py-1 font-medium text-blue-400 ring-1 ring-inset ring-blue-400/20">
              {chapters.length} chapters
            </div>
          </div>
        </div>

        <Divider className="my-6" />

        <h2 className="text-xl md:text-2xl font-semibold">Chapters</h2>

        {chapters.map((chapter, index) => (
          <div key={index} className="mt-8">
            <h2 className="text-xl font-medium">
              {index + 1}: {chapter.title}
            </h2>
            <p className="mt-2 text-secondary leading-7 line-clamp-4 md:line-clamp-3">{chapter.content}</p>

            <div className="mt-4 flex items-center gap-4">
              <button
                type="button"
                aria-label="Play episode 2: Hank Scorpio"
                className="flex duration-[200ms] items-center gap-x-3 text-sm font-bold leading-6 text-blue-400 hover:text-blue-500 active:text-blue-500"
              >
                <PlayIcon />
                <span aria-hidden="true">Read</span>
              </button>
              {/* <span aria-hidden="true" className="text-sm font-bold text-secondary">
                /
              </span>
              <a
                className="flex duration-[200ms] items-center text-sm font-bold leading-6 text-blue-400 hover:text-blue-500 active:text-blue-500"
                aria-label="Show notes for episode 2: Hank Scorpio"
                href="/2"
              >
                Show notes
              </a> */}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
