import Link, { LinkProps } from "next/link";
import { cn } from "@/utils";

const buttonClassNames = "group duration-[200ms] hover:bg-hovered shadow-md p-4 rounded-lg";

type AdditionalProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
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
  ...props
}: React.ComponentPropsWithoutRef<"button"> & AdditionalProps) {
  return (
    <button className={cn(buttonClassNames, "text-left", className)} {...props}>
      <div className="flex items-center gap-4">
        {icon}
        <div className="space-y-0">
          <p className="text-lg font-bold">{title}</p>
          <p className="text-sm mt-2 text-secondary">{description}</p>
        </div>
      </div>
    </button>
  );
}
