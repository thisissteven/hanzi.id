import React from "react";
import { back, cn, push, replace } from "@/utils";
import { useRouter } from "next/navigation";
import { useLocale } from "@/locales/use-locale";

const buttonClassName = "mt-4 py-2 pl-3 pr-4 rounded-md duration-200 active:bg-hovered flex items-center gap-2";

export function BackRouteButton({ defaultBack = false }: { defaultBack?: boolean }) {
  const router = useRouter();
  const { t } = useLocale();

  const ref = React.useRef() as React.MutableRefObject<HTMLButtonElement>;

  return (
    <button
      ref={ref}
      onClick={() => {
        if (defaultBack) {
          router.back();
        } else {
          if (ref.current) {
            ref.current.disabled = true;
            back(router);
          }
        }
      }}
      type="button"
      className={buttonClassName}
    >
      <div className="mb-[3px]">&#8592;</div> {t.return}
    </button>
  );
}

export function ReplaceRouteButton({ children, path }: { children: React.ReactNode; path: string }) {
  const router = useRouter();

  const ref = React.useRef() as React.MutableRefObject<HTMLButtonElement>;

  return (
    <button
      ref={ref}
      onClick={() => {
        if (ref.current) {
          ref.current.disabled = true;
          replace(router, path);
        }
      }}
      type="button"
      className={cn("py-2 pl-4 pr-3 rounded-md", "duration-200 active:bg-hovered", "flex items-center gap-2")}
    >
      {children}
    </button>
  );
}

export function RouteButton({
  children,
  path,
  className,
}: {
  children: React.ReactNode;
  path: string;
  className?: string;
}) {
  const router = useRouter();

  const ref = React.useRef() as React.MutableRefObject<HTMLButtonElement>;

  return (
    <button
      ref={ref}
      onClick={() => {
        if (ref.current) {
          ref.current.disabled = true;
          push(router, path);
        }
      }}
      type="button"
      className={cn(
        "mt-4 py-2 pl-4 pr-3 rounded-md",
        "duration-200 active:bg-hovered",
        "flex items-center gap-2",
        className
      )}
    >
      {children}
    </button>
  );
}

export function CustomRouteButton({
  children,
  onClick,
  path,
  ...rest
}: React.ComponentPropsWithoutRef<"button"> & { path: string }) {
  const router = useRouter();

  const ref = React.useRef() as React.MutableRefObject<HTMLButtonElement>;

  return (
    <button
      ref={ref}
      onClick={() => {
        if (ref.current) {
          ref.current.disabled = true;
          push(router, path);
        }
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
