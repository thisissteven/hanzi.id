import { useDragToScroll } from "@/hooks";
import React from "react";

export function DragToScrollWrapper({ children }: { children: React.ReactNode }) {
  const { ref, ...rest } = useDragToScroll();
  return (
    <div
      className="relative"
      onPointerMove={(e) => {
        e.stopPropagation();
      }}
    >
      <div ref={ref} {...rest} className="mt-4 overflow-x-auto scrollbar-none">
        <div className="flex gap-2 w-fit px-4 whitespace-nowrap">{children}</div>
      </div>
      <div className="absolute bg-gradient-to-l w-4 sm:w-8 from-black h-full right-0 top-0 z-10"></div>
    </div>
  );
}
