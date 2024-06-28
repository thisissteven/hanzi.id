import { cn } from "@/utils/cn";
import Link, { LinkProps } from "next/link";
import React from "react";

type HSKLinkButtonProps = {
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
} & LinkProps;

export function HSKLinkButton({ disabled = false, className, children, ...rest }: HSKLinkButtonProps) {
  return (
    <Link
      aria-disabled={disabled}
      className={cn(
        "select-none inline-block h-full text-center max-sm:flex-1 bg-softblack active:bg-softblack/40 text-smokewhite px-6 py-3.5 font-medium active:shadow-none active:translate-y-1 border-b border-secondary/10 aria-disabled:pointer-events-none aria-disabled:bg-softblack/80 aria-disabled:text-smokewhite/50 aria-disabled:border-secondary/10 backdrop-blur-md duration-200",
        className
      )}
      {...rest}
    >
      {children}
    </Link>
  );
}

type HSKButtonProps = {
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<"button">;

export function HSKButton({ disabled = false, className, children, ...rest }: HSKButtonProps) {
  return (
    <button
      disabled={disabled}
      className={cn(
        "select-none inline-block h-full text-center max-sm:flex-1 bg-softblack active:bg-softblack/40 text-smokewhite px-6 py-3.5 font-medium active:shadow-none active:translate-y-1 border-b border-secondary/10 aria-disabled:pointer-events-none aria-disabled:bg-softblack/80 aria-disabled:text-smokewhite/50 aria-disabled:border-secondary/10 backdrop-blur-md duration-200",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
