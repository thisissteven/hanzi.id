import { RouteDialog, usePreferences } from "@/components";
import { useRouter } from "next/router";
import { useTypingTestSettings } from "./use-typing-test-settings";
import { cn } from "@/utils";
import { useLocale } from "@/locales/use-locale";

export function TypeSettingsDialog() {
  const router = useRouter();

  const open = Boolean(router.query.settings);

  const {
    settings: { showPinyin, time },
    updateSettings,
  } = useTypingTestSettings();

  const { t } = useLocale();
  const { isSimplified } = usePreferences();

  return (
    <RouteDialog
      className="sm:max-w-sm"
      open={open}
      onClose={() => {
        router.back();
      }}
    >
      <div className="space-y-8">
        <div className="space-y-2">
          <p className="text-center font-medium">拼音</p>
          <SelectButton
            className={showPinyin ? "text-sky-500" : "opacity-50"}
            onClick={() => updateSettings("showPinyin", true)}
          >
            {t.showPinyin}
          </SelectButton>
          <SelectButton
            className={!showPinyin ? "text-sky-500" : "opacity-50"}
            onClick={() => updateSettings("showPinyin", false)}
          >
            {t.hidePinyin}
          </SelectButton>
        </div>

        <div className="space-y-2">
          <p className="text-center font-medium">{isSimplified ? "计时器" : "計時器"}</p>
          {[15, 30, 60, 120].map((value) => {
            return (
              <SelectButton
                key={value}
                className={time === value ? "text-amber-500" : "opacity-50"}
                onClick={() => updateSettings("time", value as any)}
              >
                {value}s
              </SelectButton>
            );
          })}
        </div>
      </div>
    </RouteDialog>
  );
}

export function SelectButton({ children, className, ...rest }: React.ComponentPropsWithoutRef<"button">) {
  return (
    <button
      className={cn(
        "w-full p-2 text-lg font-medium text-smokewhite rounded-md bg-subtle/50 active:bg-hovered duration-200",
        "disabled:opacity-50 disabled:pointer-events-none",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
