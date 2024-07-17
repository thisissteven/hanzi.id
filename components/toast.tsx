import { toast } from "sonner";

export const dismissToast = (id: string) => {
  toast.dismiss(id);
};

export function createSuccessToast(
  message: string,
  {
    id = "toast",
    duration = 5000,
    position = "top-center",
  }: {
    id?: string;
    duration?: number;
    position?: "top-center" | "bottom-center";
  }
) {
  toast.custom(
    (_) => {
      return (
        <div className="font-sans mx-auto select-none w-fit pointer-events-none rounded-full bg-[#232323] whitespace-nowrap py-3 px-6 flex items-center gap-3">
          <div className="shrink-0 mt-0.5 w-2 h-2 rounded-full bg-sky-400 indicator-blue"></div>
          <span className="shrink-0">{message}</span>
        </div>
      );
    },
    {
      id,
      duration,
      position,
      className: "w-full",
    }
  );
}

export function createErrorToast(
  message: string,
  {
    id = "error-toast",
    duration = 5000,
    position = "top-center",
  }: {
    id?: string;
    duration?: number;
    position?: "top-center" | "bottom-center";
  }
) {
  toast.custom(
    (_) => (
      <div className="font-sans mx-auto select-none w-fit pointer-events-none rounded-full bg-[#232323] whitespace-nowrap py-3 px-6 flex items-center gap-3">
        <div className="shrink-0 mt-0.5 w-2 h-2 rounded-full bg-rose-500 indicator"></div>
        <span className="shrink-0">{message}</span>
      </div>
    ),
    {
      id,
      duration,
      position,
      className: "w-full",
    }
  );
}
