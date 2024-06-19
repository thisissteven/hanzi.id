import { DesktopSidebar } from "./Sidebar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-black text-smokewhite">
      <div className="mx-auto max-w-[1440px] flex gap-4">
        <DesktopSidebar />
        {children}
      </div>
    </div>
  );
}
