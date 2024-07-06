import { CHARACTERS_PER_LEVEL_OLD, HSK_LEVELS_OLD, LevelOld } from "@/data";
import { useCompletedCharactersOld } from "@/store";
import { SidebarItem } from "./Sidebar";
import clsx from "clsx";
import { ProgressBar } from "@/components";
import { useParams } from "next/navigation";
import { ResetButtonOld } from "@/components/hsk/ResetButton/old";

export function HSKLevelItems({ isDrawer = false }: { isDrawer?: boolean }) {
  const completedCharacters = useCompletedCharactersOld();

  const params = useParams();
  const currentLevel = params?.level as unknown as LevelOld;

  return HSK_LEVELS_OLD.map((level) => {
    const progress = completedCharacters[level].length / CHARACTERS_PER_LEVEL_OLD[level];
    const completedCount = completedCharacters[level].length;

    return (
      <HSKLevelItem
        key={level}
        isDrawer={isDrawer}
        completedCount={completedCount}
        progress={progress}
        isActive={currentLevel == level}
        level={level}
      />
    );
  });
}

function HSKLevelItem({
  level,
  completedCount,
  progress,
  isActive,
  isDrawer = false,
}: {
  level: LevelOld;
  completedCount: number;
  progress: number;
  isActive: boolean;
  isDrawer?: boolean;
}) {
  const totalCharacters = CHARACTERS_PER_LEVEL_OLD[level];

  return (
    <SidebarItem
      isDrawer={isDrawer}
      rightItem={<ResetButtonOld disabled={progress === 0} level={level} />}
      key={level}
      isActive={isActive}
      href={`/old-hsk/${level}?page=1`}
    >
      <div className={clsx("flex items-center justify-between", progress === 1 && "text-sky-400")}>
        <span className={clsx("text-sm", progress === 1 && "text-yellow-500")}>HSK {level}</span>
        <span className="text-xs">
          <span className={clsx(progress === 0 && "text-sky-400", progress > 0 && progress < 1 && "text-sky-400")}>
            {completedCount}
          </span>{" "}
          / {totalCharacters}
        </span>
      </div>
      <div className="mt-0.5">
        <ProgressBar value={progress} />
      </div>
    </SidebarItem>
  );
}
