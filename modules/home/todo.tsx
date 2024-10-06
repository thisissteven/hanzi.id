import React from "react";
import { Button } from "./buttons";
import {
  BookAIcon,
  ClapperboardIcon,
  FilePlus2Icon,
  KeyboardIcon,
  LibraryBigIcon,
  LightbulbIcon,
  LucidePodcast,
  PickaxeIcon,
  SearchIcon,
} from "lucide-react";
import { ChangeLocaleButton, ChangeSimplifiedTraditional, Divider, usePreferences } from "@/components";
import { AuthButton } from "./auth-button";
import { useLocale } from "@/locales/use-locale";
import { useRouter } from "next/router";
import { useWindowSize } from "@/hooks";

const isAdmin = process.env.NEXT_PUBLIC_IS_ADMIN;

export function HomeTodo() {
  const { t } = useLocale();

  const { isSimplified } = usePreferences();
  const { width } = useWindowSize();
  const router = useRouter();

  return (
    <React.Fragment>
      <div className="flex items-center justify-between">
        {isAdmin && <AuthButton />}
        <div className="flex gap-2">
          <ChangeSimplifiedTraditional />
          <ChangeLocaleButton />
        </div>
        {/* <h1 className="text-2xl md:text-3xl font-bold">{isSimplified ? "欢迎光临" : "歡迎光臨"} 🎉</h1> */}

        <button
          onClick={() => {
            router.push(
              {
                query: {
                  ...router.query,
                  search: true,
                },
              },
              undefined,
              {
                shallow: true,
              }
            );
          }}
          className="relative flex gap-2 items-center text-secondary sm:flex-1 rounded-md border border-secondary/10 p-2.5 sm:max-w-xs active:bg-hovered duration-200 bg-softblack"
        >
          <SearchIcon size={20} strokeWidth={1.5} className="shrink-0 duration-200 group-hover:text-sky-400" />
          {width > 640 && (
            <span>
              {isSimplified ? "搜索" : "搜尋"}
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 font-mono pl-2">⌘K</span>
            </span>
          )}
        </button>
      </div>

      <Divider />

      <div className="grid md:grid-cols-2 gap-4">
        <Button
          className="relative hover:bg-sky-200/5"
          icon={<div className="w-12 shrink-0 text-3xl font-bold text-sky-500">3.0</div>}
          path="/hsk/1"
          title={t.home.hsk.title}
          description={t.home.hsk.description}
        >
          <div className="absolute top-2 right-2 inline-flex text-xs items-center rounded-md bg-sky-500/10 px-2 py-1 font-medium text-sky-500 ring-1 ring-inset ring-sky-500/20">
            2024
          </div>
        </Button>

        <Button
          className="relative hover:bg-sky-200/5 disabled:pointer-events-none disabled:opacity-50"
          icon={<div className="w-12 shrink-0 text-3xl font-bold text-amber-500">2.0</div>}
          path="/old-hsk/1"
          title={t.home.oldHSK.title}
          description={t.home.oldHSK.description}
        >
          <div className="absolute top-2 right-2 inline-flex text-xs items-center rounded-md backdrop-blur-sm bg-amber-500/10 px-2 py-1 font-medium text-amber-500 ring-1 ring-inset ring-amber-500/20">
            {t.oldHSK}
          </div>
        </Button>

        <Button
          path="/teleprompter"
          className="hover:bg-sky-200/5 relative"
          icon={
            <ClapperboardIcon size={48} strokeWidth={1.5} className="shrink-0 duration-200 group-hover:text-sky-400" />
          }
          title={t.home.teleprompter.title}
          description={t.home.teleprompter.description}
        >
          <div className="absolute top-2 right-2 inline-flex text-xs items-center rounded-md backdrop-blur-sm bg-emerald-500/10 px-2 py-1 font-medium text-emerald-500 ring-1 ring-inset ring-emerald-500/20">
            {t.new}
          </div>
        </Button>

        <Button
          path="/podcast"
          className="relative hover:bg-sky-200/5"
          icon={
            <LucidePodcast size={48} strokeWidth={1.5} className="shrink-0 duration-200 group-hover:text-sky-400" />
          }
          title={t.home.podcast.title}
          description={t.home.podcast.description}
        />

        {isAdmin && (
          <Button
            path="/new"
            className="hover:bg-sky-200/5"
            icon={
              <FilePlus2Icon size={48} strokeWidth={1.5} className="shrink-0 duration-200 group-hover:text-sky-400" />
            }
            title="New Reading"
            description="Upload PDFs, texts or images to practice reading."
          />
        )}

        <Button
          path="/explore"
          className="hover:bg-sky-200/5"
          icon={
            <LibraryBigIcon size={48} strokeWidth={1.5} className="shrink-0 duration-200 group-hover:text-sky-400" />
          }
          title={t.home.explore.title}
          description={t.home.explore.description}
        />

        <Button
          path="/flashcards"
          className="hover:bg-sky-200/5"
          icon={<BookAIcon size={48} strokeWidth={1.5} className="shrink-0 duration-200 group-hover:text-sky-400" />}
          title={t.home.flashcards.title}
          description={t.home.flashcards.description}
        />

        <Button
          path="/typing-test"
          className="hover:bg-sky-200/5 relative disabled:pointer-events-none disabled:opacity-50"
          icon={<KeyboardIcon size={48} strokeWidth={1.5} className="shrink-0 duration-200 group-hover:text-sky-400" />}
          title={t.home.typingTest.title}
          description={t.home.typingTest.description}
        />

        <Button
          path="/tools"
          className="hover:bg-sky-200/5 relative disabled:pointer-events-none disabled:opacity-50"
          icon={<PickaxeIcon size={48} strokeWidth={1.5} className="shrink-0 duration-200 group-hover:text-sky-400" />}
          title={t.home.tools.title}
          description={t.home.tools.description}
        />

        <Button
          path="/suggestions"
          className="hover:bg-sky-200/5"
          icon={
            <LightbulbIcon size={48} strokeWidth={1.5} className="shrink-0 duration-200 group-hover:text-sky-400" />
          }
          title={t.home.suggestions.title}
          description={t.home.suggestions.description}
        />
      </div>
    </React.Fragment>
  );
}
