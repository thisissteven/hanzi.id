import { cn } from "@/utils/cn";
import React from "react";

export function Button({ children, className, ...rest }: React.ComponentPropsWithoutRef<"button">) {
  return (
    <button
      className={cn(
        "max-sm:flex-1 bg-black text-smokewhite rounded-lg px-6 py-2 text-sm active:shadow-none active:translate-y-[2px] shadow-b-small shadow-border border border-border disabled:text-opacity-50 disabled:bg-zinc disabled:pointer-events-none",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
