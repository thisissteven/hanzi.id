import * as RadixPopover from "@radix-ui/react-popover";
import React from "react";

import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { useDebounce } from "@/hooks/useDebounce";

type PopoverContextProps = {
  open: boolean;
  closePopover: () => void;
};

const PopoverContext = React.createContext({} as PopoverContextProps);

export const usePopover = () => {
  return React.useContext(PopoverContext);
};

export function Popover({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return (
    <RadixPopover.Root open={open} onOpenChange={setOpen}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 brightness-0 z-40"
          ></motion.div>
        )}
      </AnimatePresence>
      <PopoverContext.Provider value={{ open, closePopover: () => setOpen(false) }}>{children}</PopoverContext.Provider>
    </RadixPopover.Root>
  );
}

Popover.Content = function PopoverContent({
  children,
  className,
  align = "end",
  customContent = false,
  ...rest
}: {
  children: React.ReactNode;
  customContent?: boolean;
} & RadixPopover.PopoverContentProps) {
  return (
    <RadixPopover.Portal>
      <RadixPopover.Content
        side="bottom"
        sideOffset={4}
        align={align}
        className={cn(
          "z-40 data-[align=start]:-ml-2 data-[align=end]:ml-2 bg-softblack py-2 rounded-md duration-200 shadow-xl",
          "data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:slide-in-from-top-2",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:slide-out-to-top-2 data-[state=closed]:duration-300",
          className
        )}
        {...rest}
      >
        {customContent ? children : <ul>{children}</ul>}
      </RadixPopover.Content>
    </RadixPopover.Portal>
  );
};

Popover.Close = RadixPopover.Close;
Popover.Trigger = function PopoverTrigger({ children, className, ...rest }: RadixPopover.PopoverTriggerProps) {
  const { open } = usePopover();

  const delayedOpen = useDebounce(open, 300);
  return (
    <RadixPopover.Trigger className={cn("relative", (open || delayedOpen) && "z-40", className)} {...rest}>
      {children}
    </RadixPopover.Trigger>
  );
};

type PopoverItemProps = { onSelect: () => Promise<void> | void } & Omit<
  React.ComponentPropsWithoutRef<"button">,
  "onClick"
>;

export const popoverItemClassName =
  "cursor-pointer text-sm w-full px-4 py-1.5 text-left font-light hover:bg-zinc active:bg-zinc";

Popover.Item = function PopoverItem({ children, onSelect, className }: PopoverItemProps) {
  const { closePopover } = usePopover();

  return (
    <li>
      <button
        className={cn(popoverItemClassName, className)}
        value={children?.toString()}
        onClick={async (e) => {
          e.stopPropagation();
          await onSelect();
          closePopover();
        }}
      >
        {children}
      </button>
    </li>
  );
};
