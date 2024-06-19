import { cn } from "@/utils";
import clsx from "clsx";
import React from "react";
import { useFormContext, useWatch } from "react-hook-form";

type TextareaProps = {
  onEscape?: (e: KeyboardEvent) => void;
  minHeight?: string;
  placeholderClassName?: string | boolean | (string | boolean)[];
} & React.ComponentPropsWithoutRef<"textarea">;

export function Textarea({
  className,
  placeholderClassName,
  minHeight = "40px",
  onEscape = (_) => {},
  onChange,
  ...rest
}: TextareaProps) {
  const textAreaRef = React.useRef() as React.MutableRefObject<HTMLTextAreaElement>;

  React.useEffect(() => {
    const textArea = textAreaRef.current;

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        textAreaRef.current.blur();
        onEscape(e);
      }
    }

    textArea.addEventListener("keydown", handleEscape);

    return () => {
      textArea.removeEventListener("keydown", handleEscape);
    };
  }, [onEscape]);

  return (
    <div className="relative w-full">
      <textarea
        ref={textAreaRef}
        onChange={(e) => {
          if (onChange) onChange(e);
          textAreaRef.current.style.height = minHeight;
          textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }}
        className={cn(
          "bg-transparent placeholder:text-span resize-none focus:outline-none font-light text-soft-primary w-full",
          className
        )}
        {...rest}
      />
    </div>
  );
}

// use this when working with react-hook-form
export const FormTextarea = React.forwardRef(function FormTextarea(
  { className, placeholderClassName, minHeight = "136px", onEscape = (_) => {}, onChange, ...rest }: TextareaProps,
  ref: React.Ref<HTMLTextAreaElement>
) {
  const textAreaRef = React.useRef() as React.MutableRefObject<HTMLTextAreaElement>;
  const [focused, setFocused] = React.useState(false);

  React.useEffect(() => {
    const textArea = textAreaRef.current;

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        textAreaRef.current.blur();
        onEscape(e);
      }
    }

    textArea.addEventListener("keydown", handleEscape);

    return () => {
      textArea.removeEventListener("keydown", handleEscape);
    };
  }, [onEscape]);

  const value = (rest.value ?? "") as string;
  const displayedValue = focused ? rest.value : value.slice(0, 300) + (value.length > 300 ? "..." : "");

  React.useEffect(() => {
    if (focused) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    } else {
      textAreaRef.current.style.height = minHeight;
    }
  }, [focused, minHeight]);

  return (
    <textarea
      {...rest}
      ref={textAreaRef}
      onChange={(e) => {
        if (onChange) onChange(e);
        textAreaRef.current.style.height = "auto";
        textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
      }}
      onFocus={(e) => {
        setFocused(true);
      }}
      onBlur={(e) => {
        setFocused(false);
      }}
      style={{
        minHeight,
      }}
      className="relative bg-transparent px-3 py-2 rounded-md border border-subtle ring-offset-black ring-smoke focus:ring-offset-2 focus:ring-2 transition-shadow duration-200 text-secondary focus:text-white placeholder:text-secondary/50 focus:outline-none w-full h-[8.5rem] peer resize-none scrollbar-none"
      spellCheck={false}
      value={displayedValue}
    />
  );
});
