import { FlashcardedResult } from "@/pages/api/flashcard/en";
import { Command } from "cmdk";
import React from "react";

export function CommandMenuItemCard({
  hanzi,
  entries,
  value,
  onSelect,
}: FlashcardedResult & {
  onSelect?: (value: string) => void;
  value?: string;
  hanzi: string;
}) {
  return (
    <Command.Item
      value={value}
      onSelect={onSelect}
      className="cursor-pointer w-full px-2 py-1.5 flex items-center rounded-md data-[selected=true]:bg-hovered active:bg-hovered select-none text-sm font-light gap-3"
    >
      <div className="flex-1">
        {/* <div className="text-primary">{displayName}</div>
        <div className="text-[11.5px] -mt-0.5 line-clamp-1">{bio ? bio : username ? `@${username}` : null}</div> */}
      </div>
    </Command.Item>
  );
}

export function CommandMenuItem({
  text,
  value,
  onSelect,
}: {
  onSelect?: (value: string) => void;
  value?: string;
  text: string;
}) {
  return (
    <Command.Item
      value={value}
      onSelect={onSelect}
      className="cursor-pointer w-full px-2 py-1.5 flex items-center rounded-md data-[selected=true]:bg-hovered active:bg-hovered select-none text-sm font-light gap-3"
    >
      <span>{text}</span>
    </Command.Item>
  );
}
