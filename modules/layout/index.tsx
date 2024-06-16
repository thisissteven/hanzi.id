import { motion } from "framer-motion";

export function Layout({ children, duration = 0.25 }: { children: React.ReactNode; duration?: number }) {
  return (
    <motion.div
      className="flex-grow antialiased"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "tween", duration }}
    >
      {children}
    </motion.div>
  );
}
