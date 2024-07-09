import React from "react";
import { TestStatus } from "./utils";

const SPACE_KEY = " ";

type TypingInputProps = {
  testStatus: TestStatus;
  onNextWord: (value: string) => void;
} & React.ComponentPropsWithoutRef<"input">;

export const TypingInput = React.forwardRef(function TypingInput(
  { testStatus, onNextWord, onChange, ...rest }: TypingInputProps,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    if (testStatus === "waiting for you") {
      setValue("");
    }
  }, [testStatus]);

  return (
    <input
      type="text"
      ref={ref}
      className="absolute inset-0 focus:outline-none bg-transparent caret-transparent placeholder:text-lightgray text-sm h-5"
      value={value}
      onChange={(e) => {
        if (testStatus !== "finished") {
          onChange?.(e);
          const value = e.target.value;
          if (value.charAt(value.length - 1) === SPACE_KEY) {
            const trimmedValue = value.trim();
            onNextWord(trimmedValue);
            setValue("");
          } else {
            setValue(value);
          }
        }
      }}
      {...rest}
    />
  );
});
