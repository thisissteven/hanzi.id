"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center", className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-subtle">
      <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-red-500 to-lime-300" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      after-dynamic-value={props.value + "x"}
      className={cn(
        "relative block h-5 w-5 rounded-full transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50",
        "focus:outline-none",
        "border bg-gradient-to-r from-white to-secondary",
        // Tooltip
        "after:absolute after:top-7 after:left-1/2 after:hidden after:-translate-x-1/2 after:rounded after:bg-brand-100 after:px-2 after:py-1 after:text-sm after:shadow after:content-[attr(after-dynamic-value)] focus:after:block after:bg-white text-black font-medium"
      )}
    />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
