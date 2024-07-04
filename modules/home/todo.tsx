import React from "react";
import { Button } from "./buttons";
import { BookAIcon, CompassIcon, FilePlus2Icon, GraduationCapIcon, LibraryBigIcon, LightbulbIcon } from "lucide-react";
import { ChangeLocaleButton, ChangeSimplifiedTraditional, Divider, usePreferences } from "@/components";
import { AuthButton } from "./auth-button";
import { useLocale } from "@/locales/use-locale";
import { useRouter } from "next/router";

const isAdmin = process.env.NEXT_PUBLIC_IS_ADMIN;

export function HomeTodo() {
  const { t } = useLocale();
  const { isSimplified } = usePreferences();

  const router = useRouter();

  return (
    <React.Fragment>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">{isSimplified ? "欢迎光临" : "歡迎光臨"} 🎉</h1>

        {isAdmin && <AuthButton />}
        <div className="flex gap-2">
          <ChangeSimplifiedTraditional />
          <ChangeLocaleButton />
        </div>
      </div>

      <Divider />

      <div className="grid md:grid-cols-2 gap-4">
        <Button
          className="hover:bg-sky-200/5"
          icon={
            <GraduationCapIcon size={48} strokeWidth={1.5} className="shrink-0 duration-200 group-hover:text-sky-400" />
          }
          path="/hsk/1"
          title={t.home.hsk.title}
          description={t.home.hsk.description}
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
          path="?search=true"
          // onClick={() => {
          //   router.push(router.asPath + "?search=true", undefined, { shallow: true });
          // }}
          className="hover:bg-sky-200/5"
          icon={<CompassIcon size={48} strokeWidth={1.5} className="shrink-0 duration-200 group-hover:text-sky-400" />}
          title={t.home.search.title}
          description={t.home.search.description}
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
