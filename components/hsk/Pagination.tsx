import React from "react";
import { HSKLinkButton } from "./HSKLinkButton";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  canNextLevel: boolean;
  canPreviousLevel: boolean;
  previousHref: string;
  nextHref: string;
};

export function Pagination({
  currentPage,
  canNextLevel,
  canPreviousLevel,
  totalPages,
  previousHref,
  nextHref,
}: PaginationProps) {
  return (
    <div className="max-sm:w-full flex justify-center items-center gap-1 bg-black sm:p-1">
      <HSKLinkButton
        prefetch={false}
        shallow={currentPage !== 1}
        href={previousHref}
        disabled={currentPage === 1 && !canPreviousLevel}
      >
        &#x2190;
      </HSKLinkButton>

      <HSKLinkButton
        prefetch={false}
        shallow={currentPage !== totalPages}
        href={nextHref}
        disabled={currentPage === totalPages && !canNextLevel}
      >
        &#x2192;
      </HSKLinkButton>
    </div>
  );
}
