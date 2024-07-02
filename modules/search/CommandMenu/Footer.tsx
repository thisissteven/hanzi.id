import { useLocale } from "@/locales/use-locale";
import React from "react";

function EnterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.146 10.354a.5.5 0 010-.708l2.5-2.5a.5.5 0 11.708.708L4.707 9.5H9.5c.337 0 .853-.105 1.27-.406.392-.282.73-.757.73-1.594v-4a.5.5 0 011 0v4c0 1.163-.496 1.938-1.145 2.406A3.292 3.292 0 019.5 10.5H4.707l1.647 1.646a.5.5 0 01-.708.708l-2.5-2.5z"
        fill="#888"
      ></path>
    </svg>
  );
}

export function CommandMenuFooter() {
  const { t } = useLocale();
  return (
    <div className="absolute bottom-0 w-full bg-zinc border-t border-t-secondary/10">
      <div className="flex gap-4 justify-end px-3 py-1.5">
        <span className="flex items-center gap-1 text-span text-xs font-light tracking-wide">
          <span className="flex items-center">⌘K</span>
          {t.openCommandMenu}
        </span>
        <span className="flex items-center gap-1 text-span text-xs font-light tracking-wide">
          <EnterIcon />
          {t.seeDetails}
        </span>
      </div>
    </div>
  );
}
