import clsx from "clsx";
import { motion } from "framer-motion";
import Link from "next/link";

import { HSKLevelItems } from "./HSKLevelItems";
import { usePathname } from "next/navigation";
import * as React from "react";
import { Drawer } from "@/components";

const levelToHanzi = (level: string) => {
  switch (level) {
    case "1":
      return "一";
    case "2":
      return "二";
    case "3":
      return "三";
    case "4":
      return "四";
    case "5":
      return "五";
    case "6":
      return "六";
    case "7":
      return "七";
    case "8":
      return "八";
    case "9":
      return "九";
    default:
      return "";
  }
};

export function DesktopSidebar() {
  return (
    <aside className="pl-4 pt-20 max-md:hidden sticky top-0 h-fit min-w-64">
      <ul className="space-y-1">
        <HSKLevelItems />
      </ul>
    </aside>
  );
}

export function MobileSidebar() {
  const pathname = usePathname();
  const showSidebar = pathname !== "/";

  const level = pathname.split("/")[2];

  if (!showSidebar) return null;

  return (
    <div className="md:hidden">
      <Drawer>
        <Drawer.Trigger asChild>
          <button className="w-14 h-14 active:translate-y-1 active:shadow-none shadow-b-small shadow-blue-200/70 border-2 border-blue-200/70 rounded-lg bg-black backdrop-blur-sm text-blue-200 active:bg-black/40 font-medium">
            <div className="text-[10px] -mb-1">HSK</div>
            <div className="text-base font-chinese">{levelToHanzi(level)}</div>
          </button>
        </Drawer.Trigger>

        <Drawer.Content className="w-full">
          <aside className="relative h-fit">
            <ul className="space-y-2">
              <HSKLevelItems isDrawer />
            </ul>
          </aside>
        </Drawer.Content>
      </Drawer>
    </div>
  );
}

export function SidebarItem({
  href,
  children,
  isActive,
  rightItem,
  isDrawer = false,
}: {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
  rightItem?: React.ReactNode;
  isDrawer?: boolean;
}) {
  return (
    <li
      className={clsx(
        "flex rounded-md md:rounded items-center gap-4 relative font-medium text-lg list-none",
        !isActive && "active:bg-softblack"
      )}
    >
      <ActiveIndicator isActive={isActive} />
      {isDrawer ? (
        <Drawer.Close asChild>
          <Link
            className={clsx(
              "inline-block w-full transition pl-4 py-4",
              isActive ? "translate-x-0" : "md:-translate-x-2",
              !isActive && "opacity-50",
              !rightItem && "pr-4"
            )}
            href={href}
          >
            {children}
          </Link>
        </Drawer.Close>
      ) : (
        <Link
          className={clsx(
            "inline-block w-full transition pl-4 py-4",
            isActive ? "translate-x-0" : "md:-translate-x-2",
            !isActive && "opacity-50",
            !rightItem && "pr-4"
          )}
          href={href}
        >
          {children}
        </Link>
      )}
      {rightItem && <div className={clsx("transition pr-4", !isActive && "opacity-50")}>{rightItem}</div>}
    </li>
  );
}

const ActiveIndicator = React.memo(
  function ActiveIndicator({ isActive }: { isActive: boolean }) {
    if (!isActive) return null;

    return <motion.div layoutId="active" className="absolute -z-10 inset-0 rounded-md bg-zinc"></motion.div>;
  },
  (prev, curr) => prev.isActive === curr.isActive
);