import * as RadixDialog from "@radix-ui/react-dialog";
import React from "react";

import { useDialogState } from "./hook";
import { cn } from "@/utils/cn";

type DialogContextProps = {
  canEscape: boolean;
  overlayRef: React.RefObject<HTMLDivElement>;
  contentRef: React.RefObject<HTMLDivElement>;
  closeDialog: () => void;
  needAuth?: boolean;
};

const DialogContext = React.createContext({} as DialogContextProps);

export function useDialog() {
  return React.useContext(DialogContext);
}

type DialogProps = {
  children: React.ReactNode;
  canEscape?: boolean;
  triggerKey?: string;
  needAuth?: boolean;
};

export function Dialog({ children, canEscape = true, triggerKey, needAuth }: DialogProps) {
  const { open, onOpenChange, overlayRef, contentRef } = useDialogState();

  // Toggle the menu when ⌘[trigger_key] is pressed
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === triggerKey && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [triggerKey, onOpenChange, open]);

  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <DialogContext.Provider
        value={{
          canEscape,
          overlayRef,
          contentRef,
          needAuth,
          closeDialog: () => onOpenChange(false),
        }}
      >
        {children}
      </DialogContext.Provider>
    </RadixDialog.Root>
  );
}

type DialogContentProps = {
  children: React.ReactNode;
  className?: string;
  overlayClassName?: string;
};

function DialogContent({ children, className, overlayClassName }: DialogContentProps) {
  const { overlayRef, contentRef } = useDialog();

  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay
        ref={overlayRef}
        data-dialog-overlay
        data-dialog-state="initial"
        className={cn("fixed inset-0 z-[1001] w-full h-full bg-black/60 brightness-0", overlayClassName)}
      />
      <RadixDialog.Content
        ref={contentRef}
        data-dialog-content
        data-dialog-state="initial"
        className={cn(
          "fixed z-[1001] md:top-1/2 left-1/2",
          "max-h-dialog overflow-y-auto scrollbar bg-black text-smokewhite",

          // default
          "w-full rounded-md",

          // desktop styles override
          "md:w-[calc(100%-2rem)] md:max-w-[540px]",
          "md:[--scale-from:1] md:[--scale-to:1]",
          "md:[--y-from:-50%] md:[--y-to:-50%]",

          // mobile styles override
          "max-md:[--y-from:100%] max-md:[--y-to:0%]",
          "max-md:bottom-0 max-md:max-h-[80dvh] max-md:rounded-t-lg max-md:rounded-b-none",
          className
        )}
      >
        {children}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
}

Dialog.Content = DialogContent;

Dialog.Trigger = RadixDialog.Trigger;

Dialog.Close = RadixDialog.Close;

Dialog.MobilePan = function MobilePan() {
  return <div className="md:hidden mx-auto rounded-full h-1 w-8 bg-softzinc mb-3"></div>;
};
