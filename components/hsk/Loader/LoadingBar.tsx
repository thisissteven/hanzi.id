import { cn } from "@/utils/cn";
import styles from "./loader.module.css";

const bars = Array(12).fill(0);

export const LoadingBar = ({ visible, className }: { visible: boolean; className?: string }) => {
  return (
    <div className={cn(styles.sonnerLoadingWrapper, className)} data-visible={visible} aria-hidden={!visible}>
      <div className={styles.sonnerSpinner}>
        {bars.map((_, i) => (
          <div className={styles.sonnerLoadingBar} key={`spinner-bar-${i}`} />
        ))}
      </div>
    </div>
  );
};
