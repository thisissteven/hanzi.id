import React from "react";
import useCookie from "react-use-cookie";

const PreferencesContext = React.createContext(
  {} as {
    isSimplified: boolean;
    toggleSimplified: () => void;
  }
);

export function usePreferences() {
  return React.useContext(PreferencesContext);
}

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [isSimplified, setIsSimplified] = useCookie("is-simplified", "1");

  return (
    <PreferencesContext.Provider
      value={{
        isSimplified: isSimplified === "1",
        toggleSimplified: () => {
          if (isSimplified === "1") {
            setIsSimplified("0", {
              SameSite: "Strict",
              days: 365,
            });
          } else {
            setIsSimplified("1", {
              SameSite: "Strict",
              days: 365,
            });
          }
        },
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function ChangeSimplifiedTraditional() {
  const { isSimplified, toggleSimplified } = usePreferences();

  return (
    <button
      onClick={toggleSimplified}
      className="relative grid whitespace-nowrap place-items-center z-50 px-4 py-1.5 rounded-md text-sm bg-softblack border border-secondary/10 sm:flex-1"
    >
      {isSimplified ? "简体字" : "繁体字"}
    </button>
  );
}
