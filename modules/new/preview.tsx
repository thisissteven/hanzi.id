import { Layout, useConfetti } from "@/modules/layout";
import React from "react";
import { useFormContext } from "react-hook-form";
import { NewReadingProps } from "./constants";
import Image from "next/image";
import { BackRouteButton, CustomRouteButton, Divider } from "@/components";
import { cn } from "@/utils";

function PlayIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 10 10" className="h-2.5 w-2.5 fill-current">
      <path d="M8.25 4.567a.5.5 0 0 1 0 .866l-7.5 4.33A.5.5 0 0 1 0 9.33V.67A.5.5 0 0 1 .75.237l7.5 4.33Z"></path>
    </svg>
  );
}

export function PreviewContent() {
  const { getValues } = useFormContext<NewReadingProps>();

  const values = getValues();

  const title = values?.title || "Untitled";
  const description = values?.description || "No description";
  const source = values?.image?.source || "/placeholder.png";

  const chapters = values.chapters.map((chapter) => {
    return {
      title: chapter.title || "Untitled",
      content: chapter.content || "-",
    };
  });

  return (
    <Layout>
      <BackRouteButton />

      <div className="mt-4">
        <div className="flex max-md:flex-col max-md:items-center items-end gap-4 md:gap-6">
          <div className="relative w-56 md:w-52 aspect-square shrink-0">
            <div
              className={cn("absolute inset-0 w-full h-full", "dark:shadow-[_0px_10px_140px_rgb(30,77,105,0.8)]")}
              aria-hidden
            ></div>
            <div className="relative rounded-xl overflow-hidden w-full h-full ring-4 ring-blue-400/20">
              <Image src={source} width={430} height={430} alt="cover" className="object-cover w-full h-full" />
            </div>
          </div>

          <div className="max-md:text-center">
            <h1 className="text-2xl md:text-3xl font-bold mt-2">{title}</h1>
            <p className="mt-2 text-secondary">{description}</p>
            <div className="max-md:mt-4 mt-3 inline-flex text-xs items-center rounded-full backdrop-blur-sm bg-blue-500/10 dark:bg-blue-400/10 px-2 py-1 font-medium text-blue-500 dark:text-blue-400 ring-1 ring-inset ring-blue-500/20 dark:ring-blue-400/20">
              {chapters.length} {chapters.length > 1 ? "chapters" : "chapter"}
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
                className="flex duration-200 items-center gap-x-3 text-sm font-bold leading-6 text-blue-500 active:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500 dark:active:text-blue-500"
              >
                <PlayIcon />
                <span aria-hidden="true">Read</span>
              </button>
            </div>
          </div>
        ))}

        <PublishButton />
      </div>
    </Layout>
  );
}

function PublishButton() {
  const { party } = useConfetti();
  return (
    <div className="sticky bottom-4 mt-4 flex justify-end">
      <button
        type="button"
        onClick={party}
        className="rounded-md font-medium max-md:w-full text-black dark:text-white p-2.5 md:py-2 md:px-4 duration-200 bg-blue-500 active:bg-blue-600"
      >
        Publish &#8594;
      </button>
    </div>
  );
}
