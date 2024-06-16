import Link, { LinkProps } from "next/link";
import { cn } from "@/utils";

const buttonClassNames = "duration-[200ms] hover:bg-hovered shadow-md p-4 rounded-lg";

type TitleAndDescriptionProps = {
  title: string;
  description: string;
};

type LinkButtonProps = {
  children: React.ReactNode;
  className: string;
} & TitleAndDescriptionProps &
  LinkProps;

export function LinkButton({ className, title, description, ...props }: LinkButtonProps) {
  return (
    <Link className={cn(buttonClassNames, className)} {...props}>
      <p className="text-lg font-bold">{title}</p>
      <p className="text-sm mt-2 text-secondary">{description}</p>
    </Link>
  );
}

export function HyperLinkButton({
  className,
  title,
  description,
  ...props
}: React.ComponentPropsWithoutRef<"a"> & TitleAndDescriptionProps) {
  return (
    <a target="_blank" rel="noopener noreferrer" className={cn(buttonClassNames, className)} {...props}>
      <p className="text-lg font-bold">{title}</p>
      <p className="text-sm mt-2 text-secondary">{description}</p>
    </a>
  );
}

export function Button({
  className,
  title,
  description,
  ...props
}: React.ComponentPropsWithoutRef<"button"> & TitleAndDescriptionProps) {
  return (
    <button className={cn(buttonClassNames, "text-left", className)} {...props}>
      <p className="text-lg font-bold">{title}</p>
      <p className="text-sm mt-2 text-secondary">{description}</p>
    </button>
  );
}
