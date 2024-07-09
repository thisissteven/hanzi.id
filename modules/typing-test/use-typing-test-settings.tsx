import { TestType } from "./utils";
import React from "react";

type Time = 15 | 30 | 60 | 120;

type Settings = {
  testType: TestType;
  time: Time;
  showPinyin: boolean;
};

type SettingsKey = keyof Settings;
type SettingsValue = Settings[SettingsKey];

type TypingTestSettingsContextValue = {
  settings: Settings;
  updateSettings: (key: SettingsKey, value: SettingsValue) => void;
};

const TypingTestSettingsContext = React.createContext({} as TypingTestSettingsContextValue);

export function useTypingTestSettings() {
  return React.useContext(TypingTestSettingsContext);
}

const defaultSettings: Settings = {
  testType: "basic",
  time: 60,
  showPinyin: true,
};

const settings_key = "typing-test-settings";

export function TypingTestSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = React.useState<Settings>(defaultSettings);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const typingTestSettings = localStorage.getItem(settings_key);
      if (typingTestSettings) {
        const parsed = JSON.parse(typingTestSettings);
        setSettings({
          testType: parsed.testType,
          time: parseInt(parsed.time) as Time,
          showPinyin: parsed.showPinyin,
        });
      } else {
        localStorage.setItem(settings_key, JSON.stringify(defaultSettings));
      }
    }
  }, []);

  const updateSettings = React.useCallback((key: SettingsKey, value: SettingsValue) => {
    setSettings((prev) => {
      const newSettings = { ...prev, [key]: value };
      localStorage.setItem(settings_key, JSON.stringify(newSettings));
      return newSettings;
    });
  }, []);

  return (
    <TypingTestSettingsContext.Provider
      value={{
        settings,
        updateSettings,
      }}
    >
      {children}
    </TypingTestSettingsContext.Provider>
  );
}
