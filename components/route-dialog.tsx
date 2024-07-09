import { cn } from "@/utils";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import React from "react";

export function RouteDialog({
  children,
  open,
  onClose,
  className,
  withoutOkButton,
}: {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
  className?: string;
  withoutOkButton?: boolean;
}) {
  // Prevent scrolling when dialog is open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.scrollbarGutter = "stable";
    }

    const timeout = setTimeout(() => {
      if (!open) {
        document.body.style.overflowY = "scroll";
        document.documentElement.style.scrollbarGutter = "";
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-y-0 left-0 w-screen z-[998] bg-black/20 backdrop-blur-sm transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-y-0 left-0 z-[998] w-screen p-2 sm:p-4 sm:overflow-y-auto">
        <div className="flex justify-center text-center items-end max-sm:min-h-full sm:items-center">
          <DialogPanel
            transition
            className={cn(
              "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all max-sm:data-[closed]:translate-y-4 data-[closed]:-translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95",
              "bg-softblack text-smokewhite p-3 sm:p-4",
              className
            )}
          >
            {children}

            {!withoutOkButton && (
              <div className="mt-2 flex justify-end bg-softblack">
                <button
                  onClick={onClose}
                  className="block rounded-md font-medium duration-200 bg-hovered active:bg-subtle px-3 py-1.5"
                >
                  OK
                </button>
              </div>
            )}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
