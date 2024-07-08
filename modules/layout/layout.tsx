import { cn } from "@/utils";
import { motion } from "framer-motion";

export function Layout({
  children,
  duration = 0.2,
  className,
  enterDelay = 0,
}: {
  children: React.ReactNode;
  duration?: number;
  className?: string;
  enterDelay?: number;
}) {
  return (
    <motion.div
      className={cn("flex-grow antialiased", className)}
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: {
          delay: enterDelay,
        },
      }}
      exit={{ opacity: 0 }}
      transition={{ type: "tween", duration }}
    >
      {children}
    </motion.div>
  );
}
