import { motion } from "framer-motion";

export function FadeInOut({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{
        scale: 0.9,
        opacity: 0,
      }}
      animate={{
        scale: 1,
        opacity: 1,
      }}
      exit={{
        scale: 0.9,
        opacity: 0,
      }}
      transition={{
        duration: 0.15,
      }}
      className="flex items-center justify-center w-full h-full"
    >
      {children}
    </motion.div>
  );
}
