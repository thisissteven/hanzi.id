import type { InferGetStaticPropsType, GetStaticPaths, GetStaticPropsContext } from "next";
import { promises as fs } from "fs";
import { CHARACTERS_PER_PAGE, ChineseCharacter, HSK_LEVELS, Level } from "@/data";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import * as React from "react";
import Head from "next/head";
import { useCompletedCharacters, useCompletedCharactersActions } from "@/store";
import { CharacterCard, Pagination, CharacterRow } from "@/components";
import { MobileSidebar, HanziModal } from "@/modules/hsk";
import { useWindowSize } from "@/hooks";

async function getCharactersOnLevel(level: string | number) {
  const file = await fs.readFile(process.cwd() + getFilePath(level), "utf8");
  const characters: Array<ChineseCharacter> = JSON.parse(file);
  return characters;
}

export const getStaticPaths = (async () => {
  return {
    paths: HSK_LEVELS.map((level) => ({
      params: {
        level: level.toString(),
      },
    })),
    fallback: false,
  };
}) satisfies GetStaticPaths;

const getFilePath = (level: string | number) => `/data/hsk-level-${level}.json`;

export const getStaticProps = async ({ params }: GetStaticPropsContext) => {
  const level = params?.level as string;

  const allCharacters = await getCharactersOnLevel(level);
  const allPreviousLevelCharacters = await getCharactersOnLevel(parseInt(level) - 1 ? parseInt(level) - 1 : 1);

  const totalPages = Math.ceil(allCharacters.length / CHARACTERS_PER_PAGE);
  const previousLevelTotalPages = Math.ceil(allPreviousLevelCharacters.length / CHARACTERS_PER_PAGE);
  const currentLevel = parseInt(level) as Level;

  return {
    props: {
      allCharacters,
      totalPages,
      previousLevelTotalPages,
      currentLevel,
      hasPreviousLevel: currentLevel > 1,
      hasNextLevel: currentLevel < 9,
    },
  };
};

function usePagination({
  allCharacters,
  totalPages,
  currentLevel,
  previousLevelTotalPages,
  hasPreviousLevel,
  hasNextLevel,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const searchParams = useSearchParams();

  const currentPage = searchParams.get("page") ?? "1";

  const characters = React.useMemo(() => {
    return allCharacters.slice(
      (parseInt(currentPage) - 1) * CHARACTERS_PER_PAGE,
      parseInt(currentPage) * CHARACTERS_PER_PAGE
    );
  }, [allCharacters, currentPage]);

  const canNextLevel = Boolean(currentPage && parseInt(currentPage) === totalPages && hasNextLevel);
  const canPreviousLevel = Boolean(currentPage && parseInt(currentPage) === 1 && hasPreviousLevel);

  const previousHref = canPreviousLevel
    ? `/hsk/${currentLevel - 1}?page=${previousLevelTotalPages}`
    : `/hsk/${currentLevel}?page=${parseInt(currentPage) - 1}`;

  const nextHref = canNextLevel ? `/hsk/${currentLevel + 1}` : `/hsk/${currentLevel}?page=${parseInt(currentPage) + 1}`;

  return {
    characters,
    currentPage: parseInt(currentPage),
    currentLevel,
    canNextLevel,
    canPreviousLevel,
    previousHref,
    nextHref,
  };
}

export default function Page(props: InferGetStaticPropsType<typeof getStaticProps>) {
  const [flippedCard, setFlippedCard] = React.useState<string | null>(null);

  const ref = React.useRef<HTMLDivElement>(null);

  const { characters, currentPage, currentLevel, canNextLevel, canPreviousLevel, previousHref, nextHref } =
    usePagination(props);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [currentPage, currentLevel]);

  const title = `HSK ${props.currentLevel} Page ${currentPage}`;

  const {
    addCompletedCharacters,
    removeCompletedCharacters,
    handleValueMismatch,
    hydrateSettings,
    hydrateCompletedCharacters,
  } = useCompletedCharactersActions();

  const completedCharacters = useCompletedCharacters();
  const currentCompletedCharacters = completedCharacters[props.currentLevel];

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      handleValueMismatch();
      hydrateCompletedCharacters();
      hydrateSettings();
    }
  }, [handleValueMismatch, hydrateCompletedCharacters, hydrateSettings]);

  const { width } = useWindowSize();

  const router = useRouter();

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <HanziModal />

      <div className="relative h-dvh pt-12 w-full">
        <div ref={ref} className="w-full h-full overflow-y-auto scrollbar max-sm:pb-12">
          <div className="px-4 sm:pr-8 py-8 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full gap-4">
            {characters.map((character) => {
              const isCompleted = currentCompletedCharacters.includes(character.id);

              if (width > 640) {
                return (
                  <CharacterCard
                    hanziHref={`/hsk/${props.currentLevel}/?hanzi=${character.hanzi}&page=${currentPage}`}
                    isFlipped={flippedCard === character.id}
                    isCompleted={currentCompletedCharacters.includes(character.id)}
                    onCompleteToggle={() => {
                      if (isCompleted) {
                        removeCompletedCharacters(props.currentLevel, character.id);
                      } else {
                        addCompletedCharacters(props.currentLevel, character.id);
                      }
                    }}
                    onFlip={() => {
                      if (flippedCard === character.id) {
                        setFlippedCard(null);
                        return;
                      }
                      setFlippedCard(character.id);
                    }}
                    key={character.id}
                    {...character}
                  />
                );
              }

              return (
                <CharacterRow
                  onClick={() =>
                    router.push(`/hsk/${props.currentLevel}/?hanzi=${character.hanzi}&page=${currentPage}`, undefined, {
                      shallow: true,
                    })
                  }
                  isCompleted={currentCompletedCharacters.includes(character.id)}
                  onCompleteToggle={() => {
                    if (isCompleted) {
                      removeCompletedCharacters(props.currentLevel, character.id);
                    } else {
                      addCompletedCharacters(props.currentLevel, character.id);
                    }
                  }}
                  key={character.id}
                  {...character}
                />
              );
            })}
          </div>
        </div>
        <div className="fixed w-full left-0 max-w-[1440px] mx-auto px-2 md:right-4 md:px-4 bottom-2 flex justify-end mt-8 gap-2">
          <MobileSidebar />

          <Pagination
            currentPage={currentPage}
            totalPages={props.totalPages}
            canNextLevel={canNextLevel}
            canPreviousLevel={canPreviousLevel}
            previousHref={previousHref}
            nextHref={nextHref}
          />
        </div>
      </div>
    </>
  );
}