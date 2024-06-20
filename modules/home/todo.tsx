import React from "react";
import { Button } from "./buttons";
import { GraduationCapIcon, LanguagesIcon, LibraryBigIcon, TargetIcon } from "lucide-react";
import { Divider } from "@/components";

export function HomeTodo() {
  return (
    <React.Fragment>
      <h1 className="text-2xl md:text-3xl font-bold">What would you like to do today?</h1>

      <Divider />

      <div className="grid md:grid-cols-2 gap-4">
        <Button
          className="hover:bg-yellow-500/10"
          icon={<GraduationCapIcon size={48} strokeWidth={1.5} className="duration-200 group-hover:text-yellow-500" />}
          path="/hsk/1"
          title="Learn HSK 1-9"
          description="Chinese HSK vocabulary lists and practice exams."
        />

        <Button
          path="/new"
          className="hover:bg-indigo-500/10"
          icon={<TargetIcon size={48} strokeWidth={1.5} className="duration-200 group-hover:text-indigo-500" />}
          title="Immersed reading"
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
