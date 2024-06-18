import { cn } from "@/utils";
import React from "react";

export function Divider({ className, ...rest }: React.ComponentPropsWithoutRef<"hr">) {
  return <hr className={cn("w-full h-[1px] bg-subtle border-none my-4", className)} {...rest} />;
}
