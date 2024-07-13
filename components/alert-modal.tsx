import { cn } from "@/utils";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { LucideTriangleAlert } from "lucide-react";

export function AlertModal({
  open,
  onClose,
  callback,
  alertProps,
}: {
  open: boolean;
  onClose: (value: boolean) => void;
  callback: () => void;
  alertProps: {
    title: string;
    description: string;
    confirmText: string;
    cancelText: string;
  };
}) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-y-0 left-0 w-screen z-[998] bg-black/20 backdrop-blur-sm transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-y-0 left-0 z-[998] w-screen p-2 sm:p-4 overflow-y-auto scrollbar-none">
        <div className="flex justify-center text-center items-end max-sm:min-h-full sm:items-center">
          <DialogPanel
            transition
            className={cn(
              "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all max-sm:data-[closed]:translate-y-4 data-[closed]:-translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95",
              "bg-softblack text-smokewhite p-3 sm:p-4 "
            )}
          >
            <div className="sm:flex sm:items-start">
              <div className="grid place-items-center">
                <LucideTriangleAlert aria-hidden="true" className="mt-2" size={32} />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <DialogTitle as="h3" className="text-lg font-semibold leading-6">
                  {alertProps.title}
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-sm text-secondary">{alertProps.description}</p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={callback}
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm active:bg-red-700 duration-200 sm:ml-3 sm:w-auto"
              >
                {alertProps.confirmText}
              </button>
              <button
                type="button"
                data-autofocus
                onClick={() => onClose(false)}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-smokewhite active:bg-secondary px-3 py-2 text-sm font-semibold text-softblack shadow-sm duration-200 sm:mt-0 sm:w-auto"
              >
                {alertProps.cancelText}
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
