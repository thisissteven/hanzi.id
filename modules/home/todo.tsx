import React from "react";
import { Button } from "./buttons";
import {
  FilePlus2Icon,
  GraduationCapIcon,
  LanguagesIcon,
  LibraryBigIcon,
  LightbulbIcon,
  SendIcon,
  TelescopeIcon,
} from "lucide-react";
import { ChangeLocaleButton, Divider } from "@/components";
import { AuthButton } from "./auth-button";
import { useLocale } from "@/locales/use-locale";

const isAdmin = process.env.NEXT_PUBLIC_IS_ADMIN;

export function HomeTodo() {
  const { t } = useLocale();
  return (
    <React.Fragment>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">今天你有什么计划？</h1>

        {isAdmin && <AuthButton />}
        <ChangeLocaleButton />
      </div>

      <Divider />

      <div className="grid md:grid-cols-2 gap-4">
        <Button
          className="hover:bg-blue-500/10"
          icon={
            <GraduationCapIcon
              size={48}
              strokeWidth={1.5}
              className="shrink-0 duration-200 group-hover:text-blue-500"
            />
          }
          path="/hsk/1"
          title={t.home.hsk.title}
          description={t.home.hsk.description}
        />

        {isAdmin && (
          <Button
            path="/new"
            className="hover:bg-amber-500/10"
            icon={
              <FilePlus2Icon size={48} strokeWidth={1.5} className="shrink-0 duration-200 group-hover:text-amber-500" />
            }
            title="New Reading"
            description="Upload PDFs, texts or images to practice reading."
          />
        )}

        <Button
          path="/explore"
          className="hover:bg-emerald-500/10"
          icon={
            <LibraryBigIcon
              size={48}
              strokeWidth={1.5}
              className="shrink-0 duration-200 group-hover:text-emerald-500"
            />
          }
          title={t.home.explore.title}
          description={t.home.explore.description}
        />

        <Button
          path="/flashcards"
          className="hover:bg-pink-500/10"
          icon={
            <LanguagesIcon size={48} strokeWidth={1.5} className="shrink-0 duration-200 group-hover:text-pink-500" />
          }
          title={t.home.flashcards.title}
          description={t.home.flashcards.description}
        />

        <Button
          path="/suggestions"
          className="hover:bg-yellow-500/10"
          icon={
            <LightbulbIcon size={48} strokeWidth={1.5} className="shrink-0 duration-200 group-hover:text-yellow-500" />
          }
          title={t.home.suggestions.title}
          description={t.home.suggestions.description}
        />
      </div>
    </React.Fragment>
  );
}
