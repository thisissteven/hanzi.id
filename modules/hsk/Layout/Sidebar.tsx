import clsx from "clsx";
import { motion } from "framer-motion";
import Link from "next/link";

import { HSKLevelItems } from "./HSKLevelItems";
import { usePathname } from "next/navigation";
import * as React from "react";
import { ChangeLocaleButton, Drawer } from "@/components";
import { useRouter } from "next/router";
import { useLocale } from "@/locales/use-locale";

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
  const { t } = useLocale();

  return (
    <div className="max-md:hidden border-r border-r-secondary/10">
      <aside className="px-4 pb-4 pt-20 z-10 sticky top-0 h-[calc(100dvh-3.5rem)] overflow-y-auto min-w-64">
        <ul className="space-y-1">
          <HSKLevelItems />
        </ul>
      </aside>
      <div className="flex items-end gap-2 ml-6">
        <ChangeLocaleButton />
        <a
          href="https://pandarin.net/latihan-ujian-hsk/"
          target="_blank"
          className="inline-block relative z-10 hover:underline underline-offset-4 pl-4 pr-5 py-2 border border-secondary/10 bg-softblack w-fit rounded-md"
        >
          {t.practice} &#8594;
        </a>
      </div>
    </div>
  );
}

export function MobileSidebar() {
  const pathname = usePathname();
  const showSidebar = pathname !== "/";
  const { t } = useLocale();

  const level = pathname.split("/")[2];

  if (!showSidebar) return null;

  return (
    <div className="md:hidden">
      <Drawer>
        <Drawer.Trigger asChild>
          <button className="w-14 h-14 active:max-sm:translate-y-1 border-b border-secondary/10 bg-softblack backdrop-blur-sm text-smokewhite max-sm:active:bg-softblack/40 group font-medium duration-200 sm:border-black sm:h-full sm:w-16 sm:h-15 sm:bg-black sm:-mr-2 sm:p-1">
            <div className="group-active:sm:translate-y-1 sm:bg-softblack sm:h-full sm:flex sm:flex-col sm:items-center sm:justify-center sm:border-b sm:border-b-secondary/10 duration-200">
              <div className="text-[10px] -mb-1">HSK</div>
              <div className="text-base font-medium">{levelToHanzi(level)}</div>
            </div>
          </button>
        </Drawer.Trigger>

        <Drawer.Content className="w-full max-h-dvh pb-0">
          <aside className="relative max-h-[calc(100dvh-2rem)] pt-2 overflow-y-auto scrollbar-none">
            <ul className="space-y-2 pb-2">
              <li className="flex justify-center gap-2 py-1">
                <ChangeLocaleButton />
                <a
                  href="https://pandarin.net/latihan-ujian-hsk/"
                  target="_blank"
                  className="inline-block relative z-10 hover:underline underline-offset-4 pl-6 pr-7 py-2 border border-secondary/10 bg-softblack w-fit rounded-md"
                >
                  {t.practice} &#8594;
                </a>
              </li>
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
        "flex rounded-md md:rounded items-center gap-4 relative font-medium text-lg list-none duration-200",
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
