import React from "react";
import * as SelectPrimitives from "@radix-ui/react-select";
import { cn } from "@/utils";
import { LucideCheck, LucideChevronsUpDown } from "lucide-react";

const Select = SelectPrimitives.Root;
Select.displayName = "Select";

const SelectGroup = SelectPrimitives.Group;
SelectGroup.displayName = "SelectGroup";

const SelectValue = SelectPrimitives.Value;
SelectValue.displayName = "SelectValue";

const selectTriggerStyles = [
  cn(
    "group/trigger flex w-full select-none items-center justify-between gap-2 truncate rounded-md border px-3 py-2 shadow-xs outline-hidden transition sm:text-sm",
    "border-border",
    "text-white",
    "data-placeholder:text-lightgray",
    "bg-black",
    "hover:bg-hovered",
    "data-disabled:bg-smokewhite data-disabled:text-secondary data-disabled:border-border"
  ),
];

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitives.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitives.Trigger> & {
    hasError?: boolean;
  }
>(({ className, hasError, children, ...props }, forwardedRef) => {
  return (
    <SelectPrimitives.Trigger ref={forwardedRef} className={cn(selectTriggerStyles)} tremor-id="tremor-raw" {...props}>
      <span className="truncate">{children}</span>
      <SelectPrimitives.Icon asChild>
        <LucideChevronsUpDown
          className={cn("size-4 shrink-0", "text-smoke", "group-data-disabled/trigger:text-border")}
        />
      </SelectPrimitives.Icon>
    </SelectPrimitives.Trigger>
  );
});
SelectTrigger.displayName = "SelectTrigger";

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitives.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitives.Content>
>(({ className, position = "popper", children, sideOffset = 8, collisionPadding = 10, ...props }, forwardedRef) => (
  <SelectPrimitives.Portal>
    <SelectPrimitives.Content
      ref={forwardedRef}
      className={cn(
        "relative z-50 overflow-hidden rounded-md border shadow-xl shadow-black/[2.5%]",
        "min-w-[calc(var(--radix-select-trigger-width)-2px)] max-w-[95vw]",
        "max-h-(--radix-select-content-available-height)",
        "bg-black",
        "text-white",
        "border-border",
        "will-change-[transform,opacity]",
        "data-[state=closed]:animate-hide",
        "data-[side=bottom]:animate-slide-down-and-fade data-[side=left]:animate-slide-left-and-fade data-[side=right]:animate-slide-right-and-fade data-[side=top]:animate-slide-up-and-fade",
        className
      )}
      sideOffset={sideOffset}
      position={position}
      collisionPadding={collisionPadding}
      {...props}
    >
      <SelectPrimitives.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[calc(var(--radix-select-trigger-width))]"
        )}
      >
        {children}
      </SelectPrimitives.Viewport>
    </SelectPrimitives.Content>
  </SelectPrimitives.Portal>
));
SelectContent.displayName = "SelectContent";

const SelectGroupLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitives.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitives.Label>
>(({ className, ...props }, forwardedRef) => (
  <SelectPrimitives.Label
    ref={forwardedRef}
    className={cn("px-3 py-2 text-xs font-medium tracking-wide", "text-lightgray", className)}
    {...props}
  />
));
SelectGroupLabel.displayName = "SelectGroupLabel";

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitives.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitives.Item>
>(({ className, children, ...props }, forwardedRef) => {
  return (
    <SelectPrimitives.Item
      ref={forwardedRef}
      className={cn(
        "grid cursor-pointer grid-cols-[1fr_20px] gap-x-2 rounded-sm px-3 py-2 outline-hidden transition-colors data-[state=checked]:font-semibold sm:text-sm",
        "text-white",
        "data-disabled:pointer-events-none data-disabled:text-secondary data-disabled:hover:bg-none",
        "focus-visible:bg-hovered",
        "hover:bg-hovered",
        className
      )}
      {...props}
    >
      <SelectPrimitives.ItemText className="flex-1 truncate">{children}</SelectPrimitives.ItemText>
      <SelectPrimitives.ItemIndicator>
        <LucideCheck className="size-5 shrink-0 text-softblack" aria-hidden="true" />
      </SelectPrimitives.ItemIndicator>
    </SelectPrimitives.Item>
  );
});
SelectItem.displayName = "SelectItem";

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitives.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitives.Separator>
>(({ className, ...props }, forwardedRef) => (
  <SelectPrimitives.Separator
    ref={forwardedRef}
    className={cn("-mx-1 my-1 h-px", "bg-light-smokewhite", className)}
    {...props}
  />
));
SelectSeparator.displayName = "SelectSeparator";

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
