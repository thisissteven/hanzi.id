import React from "react";
import { Button } from "./buttons";
import { FilePlus2Icon, GraduationCapIcon, LanguagesIcon, LibraryBigIcon } from "lucide-react";
import { Divider } from "@/components";
import { AuthButton } from "./auth-button";
import Link from "next/link";

export function HomeTodo() {
  return (
    <React.Fragment>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">今天你有什么计划？</h1>

        <AuthButton />
      </div>

      <Divider />

      <Link href="/read/1/1">read</Link>

      <div className="grid md:grid-cols-2 gap-4">
        <Button
          className="hover:bg-blue-500/10"
          icon={<GraduationCapIcon size={48} strokeWidth={1.5} className="duration-200 group-hover:text-blue-500" />}
          path="/hsk/1"
          title="Learn HSK 1-9"
          description="Chinese HSK vocabulary lists and practice exams."
        />

        <Button
          path="/new"
          className="hover:bg-yellow-500/10"
          icon={<FilePlus2Icon size={48} strokeWidth={1.5} className="duration-200 group-hover:text-yellow-500" />}
          title="New Reading"
          description="Upload PDFs, texts or images to practice reading."
        />

        <Button
          path="/flashcards"
          className="hover:bg-pink-500/10"
          icon={<LanguagesIcon size={48} strokeWidth={1.5} className="duration-200 group-hover:text-pink-500" />}
          title="Flashcards"
          description="Memorize words and phrases with spaced repetition."
        />

        <Button
          path="/library"
          className="hover:bg-emerald-500/10"
          icon={<LibraryBigIcon size={48} strokeWidth={1.5} className="duration-200 group-hover:text-emerald-500" />}
          title="Library"
          description="View your saved collections and continue reading."
        />
      </div>
    </React.Fragment>
  );
}
