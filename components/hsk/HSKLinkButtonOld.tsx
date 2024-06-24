import { cn } from "@/utils/cn";
import Link, { LinkProps } from "next/link";

type HSKLinkButtonProps = {
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
} & LinkProps;

export function HSKLinkButtonOld({ disabled = false, className, children, ...rest }: HSKLinkButtonProps) {
  return (
    <Link
      aria-disabled={disabled}
      className={cn(
        "select-none inline-block text-center max-sm:flex-1 bg-black active:bg-black/40 text-blue-200 rounded-lg px-6 py-3.5 font-medium active:shadow-none active:translate-y-1 shadow-[0_2px_0_rgba(191,219,254,0.7)] border-2 border-blue-200/70 aria-disabled:pointer-events-none aria-disabled:bg-softblack aria-disabled:text-blue-200/50 aria-disabled:shadow-blue-200/30 aria-disabled:border-blue-200/50 backdrop-blur-md",
        className
      )}
      {...rest}
    >
      {children}
    </Link>
  );
}
