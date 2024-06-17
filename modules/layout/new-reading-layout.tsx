import { AnimatePresence } from "framer-motion";
import { Layout } from "./layout";

export function NewReadingLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout>
      <div className="min-h-dvh">
        <main className="max-w-[960px] mx-auto md:px-8 pb-8">
          <div className="max-md:sticky top-0 h-[11.25rem] flex flex-col justify-end bg-black z-10 max-md:px-4 pb-4 border-b-[1.5px] border-b-subtle">
            <h1 className="text-2xl md:text-3xl font-bold">New Reading</h1>
          </div>

          <AnimatePresence mode="wait">{children}</AnimatePresence>
        </main>
      </div>
    </Layout>
  );
}
