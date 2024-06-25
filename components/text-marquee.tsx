import React from "react";
import { m, useAnimate } from "framer-motion";
import { cn } from "@/utils";

function calculateElementWidth(elementRef: HTMLElement) {
  const clone = elementRef.cloneNode(true) as HTMLElement;
  clone.style.visibility = "hidden";
  clone.style.display = "block";
  clone.style.position = "absolute";
  clone.style.opacity = "0";
  let width = 0;
  document.body.appendChild(clone);
  width = clone.offsetWidth;
  document.body.removeChild(clone);
  return width;
}

const offset = 24;

export function TextMarquee({
  title,
  subtitle,
  titleClassName,
  subtitleClassName,
  containerClassName,
  gradientClassName,
}: {
  title?: string;
  subtitle?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  containerClassName?: string;
  gradientClassName?: string;
}) {
  const [scope, animate] = useAnimate();

  const ref = React.useRef() as React.MutableRefObject<HTMLParagraphElement>;

  React.useEffect(() => {
    if (ref.current !== undefined) {
      const elementWidth = calculateElementWidth(ref.current);
      const maxWidth = scope.current.clientWidth;
      if (elementWidth < maxWidth) return;

      const translateBy = elementWidth - maxWidth + offset;
      const duration = translateBy / 8;
      animate(
        "h2",
        {
          x: [0, -translateBy, -translateBy, 0],
        },
        {
          ease: "linear",
          repeat: Infinity,
          duration: duration,
          repeatDelay: 4,
          delay: 2,
        }
      );
    }
  }, [animate, scope]);

  return (
    <div ref={scope} className={cn("-ml-1 w-full overflow-hidden relative", containerClassName)}>
      <div className={cn("absolute z-10 h-1/2 bg-gradient-to-r from-subtle/50 w-2", gradientClassName)}></div>
      <div className={cn("absolute z-10 h-1/2 right-0 bg-gradient-to-l from-subtle/50 w-2", gradientClassName)}></div>

      <m.h2 ref={ref} className={cn("ml-1 text-sm font-semibold whitespace-nowrap", titleClassName)}>
        {title}
      </m.h2>

      <p
        className={cn(
          "ml-1 text-xs text-smokewhite whitespace-nowrap text-ellipsis overflow-hidden",
          subtitleClassName
        )}
      >
        {subtitle}
      </p>
    </div>
  );
}
