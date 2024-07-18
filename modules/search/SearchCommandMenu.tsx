import { Command } from "cmdk";
import React from "react";
import useSWRImmutable from "swr/immutable";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

import { useDebounce } from "@/hooks";

import {
  CommandMenuChips,
  CommandMenuFooter,
  CommandMenuGroupCard,
  CommandMenuGroupSearch,
  CommandMenuHeader,
  CommandMenuSearch,
} from "./CommandMenu";

import { useLocale } from "@/locales/use-locale";
import { useRouter } from "next/router";
import { cn } from "@/utils";
import { toast } from "sonner";
import { TranslateApiResponse } from "@/pages/api/translate";
import { AudioProvider } from "../layout";
import { HandwritingComponent } from "../tools";

export function SearchCommandMenu() {
  const router = useRouter();
  const search = router.query.search;

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        router.push(
          {
            query: {
              ...router.query,
              search: true,
            },
          },
          undefined,
          {
            shallow: true,
          }
        );
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [router]);

  return (
    <Dialog
      className="relative z-[998]"
      open={Boolean(search)}
      onClose={() => {
        router.back();
      }}
    >
      <DialogBackdrop
        transition
        className="fixed inset-y-0 left-0 w-screen z-[998] bg-black/20 backdrop-blur-sm transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-y-0 left-0 z-[998] w-screen p-2 sm:p-4 overflow-y-auto">
        <div className="flex justify-center text-center sm:items-center">
          <DialogPanel
            transition
            className={cn(
              "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:-translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 w-full sm:max-w-xl data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95",
              "bg-softblack text-smokewhite border border-secondary/10"
            )}
          >
            <CommandMenuContent />
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

function useRecentlySearched() {
  const [recentlySearched, setRecentlySearched] = React.useState<string[]>([]);

  React.useEffect(() => {
    const recentlySearched = localStorage.getItem("recentlySearched");
    if (recentlySearched) {
      setRecentlySearched(JSON.parse(recentlySearched));
    }
  }, []);

  const updateRecentlySearched = (searched: string) => {
    let updated = Array.from(recentlySearched);
    if (recentlySearched.includes(searched)) {
      updated = [searched, ...recentlySearched.filter((item) => item !== searched)].slice(0, 20);
    } else {
      updated = [searched, ...recentlySearched].slice(0, 20);
    }
    setRecentlySearched(updated);
    localStorage.setItem("recentlySearched", JSON.stringify(updated));
  };

  const clearRecentlySearched = () => {
    setRecentlySearched([]);
    localStorage.removeItem("recentlySearched");
  };

  return { recentlySearched, updateRecentlySearched, clearRecentlySearched };
}

const regex = /^(?!^[A-Za-z]+$).*$/;

function CommandMenuContent() {
  const listRef = React.useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = React.useState(false);

  const { recentlySearched, updateRecentlySearched, clearRecentlySearched } = useRecentlySearched();

  const [value, setValue] = React.useState("");
  const [active, setActive] = React.useState([0, 1]);
  const [isWriting, setIsWriting] = React.useState(false);

  const keyword = useDebounce(value, 300).trim();

  const { locale } = useLocale();

  const timeoutRef = React.useRef<NodeJS.Timeout>();

  const { data: searchResult, isLoading } = useSWRImmutable<TranslateApiResponse>(
    keyword ? `translate/${locale}?text=${keyword}` : null,
    async (url: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      const isMatch = regex.test(keyword);

      if (!isMatch) {
        timeoutRef.current = setTimeout(() => {
          toast.custom(
            (_) => (
              <div className="font-sans mx-auto select-none w-fit pointer-events-none rounded-full bg-[#232323] whitespace-nowrap py-3 px-6 flex items-center gap-3">
                <div className="shrink-0 mt-0.5 w-2 h-2 rounded-full bg-rose-500 indicator"></div>
                <span className="shrink-0">{t.searchErrorToast}</span>
              </div>
            ),
            {
              id: "search-error",
              duration: 3000,
              position: "bottom-center",
            }
          );
        }, 1000);
        return;
      }

      updateRecentlySearched(keyword);

      const response = await fetch(`/api/${url}`);
      const data = await response.json();
      return data;
    },
    {
      keepPreviousData: true,
    }
  );

  const isSearchEmpty = value.length === 0;

  const { t } = useLocale();

  return (
    <>
      <Command filter={() => 1} label={t.searchPlaceholder} className="relative bg-softblack h-[85vh] min-h-[400px]">
        <CommandMenuHeader scrolled={scrolled}>
          <CommandMenuSearch
            isLoading={isLoading}
            placeholder={t.searchPlaceholder}
            value={value}
            onValueChange={setValue}
            isWriting={isWriting}
            setIsWriting={setIsWriting}
          />
          <CommandMenuChips
            active={active}
            toggleActive={(value) => {
              setActive((prev) => {
                const updated = Array.from(prev);
                if (updated.includes(value)) {
                  return updated.filter((item) => item !== value);
                } else {
                  return [...updated, value];
                }
              });
            }}
          />
        </CommandMenuHeader>

        <Command.List
          ref={listRef}
          onScroll={() => {
            if (!listRef.current) return;
            listRef.current?.scrollTop > 0 ? setScrolled(true) : setScrolled(false);
          }}
          className="overflow-y-auto h-[calc(100%-82px)] scrollbar-none p-2 scroll-pb-[86px] scroll-pt-[62px] pb-[calc(38px+0.5rem)]"
        >
          <AudioProvider>
            {isWriting ? (
              <HandwritingComponent
                addSpace={() => setValue(value + " ")}
                backspace={() => setValue(value.slice(0, -1))}
                onSelected={(text) => {
                  setValue(value + text);
                }}
              />
            ) : (
              <React.Fragment>
                {recentlySearched && isSearchEmpty && (
                  <CommandMenuGroupSearch
                    clearHistory={clearRecentlySearched}
                    onSelect={setValue}
                    heading={t.recentlySearched}
                    data={recentlySearched}
                  />
                )}
                <div className={cn("duration-200", isLoading ? "opacity-50" : "opacity-100")}>
                  {searchResult && value && (
                    <CommandMenuGroupCard active={active} data={searchResult} sentence={value} />
                  )}
                </div>
              </React.Fragment>
            )}
          </AudioProvider>
        </Command.List>
      </Command>
      <CommandMenuFooter />
    </>
  );
}
