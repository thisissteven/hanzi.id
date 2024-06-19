import { cn } from "@/utils/cn";
import styles from "./loader.module.css";

const bars = Array(12).fill(0);

export const LoadingBar = ({
  visible,
  className,
  color = "#e8e8e8",
}: {
  visible: boolean;
  className?: string;
  color?: string;
}) => {
  return (
    <div className={cn(styles.sonnerLoadingWrapper, className)} data-visible={visible} aria-hidden={!visible}>
      <div className={styles.sonnerSpinner}>
        {bars.map((_, i) => (
          <div
            className={styles.sonnerLoadingBar}
            style={
              {
                "--white": color,
              } as React.CSSProperties
            }
            key={`spinner-bar-${i}`}
          />
        ))}
      </div>
    </div>
  );
};
