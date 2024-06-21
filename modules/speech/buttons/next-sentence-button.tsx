import { NextSentenceIcon } from "../icons/next-sentence-icon";

export function NextSentenceButton({
  onClick,
  ...props
}: { onClick: () => void } & React.ComponentPropsWithoutRef<"button">) {
  return (
    <button
      type="button"
      className="group relative grid h-8 w-8 place-items-center group disabled:pointer-events-none"
      onClick={onClick}
      aria-label="next sentence"
      {...props}
    >
      <NextSentenceIcon className="h-6 w-6 text-tertiary group-active:text-white transition" />
    </button>
  );
}
