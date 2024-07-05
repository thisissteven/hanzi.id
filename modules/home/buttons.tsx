import Link, { LinkProps } from "next/link";
import { cn, push } from "@/utils";
import { useRouter } from "next/navigation";
import React from "react";

const buttonClassNames = "group duration-200 hover:bg-hovered border dark:border-black p-4 rounded-lg";

type AdditionalProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
};

type LinkButtonProps = {
  className?: string;
} & AdditionalProps &
  LinkProps;

export function LinkButton({ className, title, description, icon, ...props }: LinkButtonProps) {
  return (
    <Link className={cn(buttonClassNames, className)} {...props}>
      <div className="flex items-center gap-4">
        {icon}
        <div className="space-y-0">
          <p className="text-lg font-bold">{title}</p>
          <p className="text-sm mt-2 text-secondary">{description}</p>
        </div>
      </div>
    </Link>
  );
}

export function HyperLinkButton({
  className,
  title,
  description,
  icon,
  ...props
}: React.ComponentPropsWithoutRef<"a"> & AdditionalProps) {
  return (
    <a target="_blank" rel="noopener noreferrer" className={cn(buttonClassNames, className)} {...props}>
      <div className="flex items-center gap-4">
        {icon}
        <div className="space-y-0">
          <p className="text-lg font-bold">{title}</p>
          <p className="text-sm mt-2 text-secondary">{description}</p>
        </div>
      </div>
    </a>
  );
}

export function Button({
  className,
  title,
  description,
  icon,
  path,
  children,
  onClick,
  ...props
}: React.ComponentPropsWithoutRef<"button"> & AdditionalProps) {
  const router = useRouter();

  return (
    <button
      className={cn(buttonClassNames, "text-left", className)}
      onClick={(e) => {
        onClick?.(e);
        push(router, path);
      }}
      {...props}
    >
      <div className="flex items-center gap-4 h-full">
        {icon}
        <div className="space-y-0">
          <p className="text-lg font-bold">{title}</p>
          <p className="text-sm mt-2 text-secondary">{description}</p>
        </div>
      </div>
      {children}
    </button>
  );
}
