import { cn } from "@/utils";
import { motion } from "framer-motion";

export function Layout({
  children,
  duration = 0.2,
  className,
}: {
  children: React.ReactNode;
  duration?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={cn("flex-grow antialiased", className)}
      initial={false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "tween", duration }}
    >
      {children}
    </motion.div>
  );
}
