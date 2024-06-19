import { Level } from "@/data";
import { useCompletedCharactersActions } from "@/store";
import React from "react";
import { Dialog } from "./Dialog";
import { Button } from "./Button";

export function ResetButton({ level, disabled }: { level: Level; disabled: boolean }) {
  const { resetLevel } = useCompletedCharactersActions();
  return (
    <Dialog>
      <Dialog.Trigger asChild>
        <button className="text-gray disabled:opacity-50" disabled={disabled}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>
      </Dialog.Trigger>
      <Dialog.Content className="p-3 md:p-4 md:max-w-sm md:border-2 md:border-border md:shadow-b-small md:shadow-border">
        <Dialog.MobilePan />
        <div className="text-base">
          <div className="my-4">
            <p className="mb-2 font-medium">Reset HSK {level} progress?</p>
            <p className="text-sm text-red-500">Changes made cannot be undone.</p>
          </div>
          <div className="flex flex-col md:flex-row-reverse gap-2">
            <Dialog.Close asChild>
              <Button
                className="flex-1 text-red-500 border-red-500/80 shadow-red-500/80"
                onClick={(e) => {
                  e.stopPropagation();
                  resetLevel(level);
                }}
              >
                Reset
              </Button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <Button className="flex-1" onClick={(e) => e.stopPropagation()}>
                Cancel
              </Button>
            </Dialog.Close>
          </div>
        </div>
      </Dialog.Content>
    </Dialog>
  );
}
