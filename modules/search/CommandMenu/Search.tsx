import { LoadingBar } from "@/components";
import { Command } from "cmdk";
import { LucideX } from "lucide-react";
import React from "react";

function SearchIcon() {
  return (
    <svg className="shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.74 10.68a6.001 6.001 0 10-1.06 1.06l3.037 3.038a.75.75 0 001.061-1.06L11.74 10.68zm-1.558-6.862a4.5 4.5 0 11-6.364 6.364 4.5 4.5 0 016.364-6.364z"
        fill="#888"
      ></path>
    </svg>
  );
}

export function CommandMenuSearch({
  value,
  onValueChange,
  placeholder,
  isLoading,
}: {
  value: string;
  placeholder: string;
  onValueChange: (value: string) => void;
  isLoading: boolean;
}) {
  const ref = React.useRef() as React.MutableRefObject<HTMLInputElement>;

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      ref.current.focus();
    }
  }, []);

  return (
    <div className="relative px-4 py-3.5 flex items-center gap-2">
      <SearchIcon />
      <Command.Input
        ref={ref}
        className="w-full focus:outline-none tracking-wide bg-transparent placeholder:text-placeholder text-sm font-light placeholder:text-secondary"
        placeholder={placeholder}
        value={value}
        onValueChange={onValueChange}
      />
      {isLoading ? (
        <LoadingBar visible={isLoading} />
      ) : (
        value.length > 0 && (
          <button onClick={() => onValueChange("")}>
            <LucideX className="w-4 h-4 text-[#888]" />
          </button>
        )
      )}
    </div>
  );
}
