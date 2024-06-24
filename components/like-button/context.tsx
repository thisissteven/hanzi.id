import React from "react";

type LikeButtonContextT = {
  liked: boolean;
  setLiked: React.Dispatch<React.SetStateAction<boolean>>;
};

const LikeButtonContext = React.createContext({} as LikeButtonContextT);

export const useLikeButton = () => React.useContext(LikeButtonContext);

export function LikeButtonProvider({ children }: { children: React.ReactNode }) {
  const [liked, setLiked] = React.useState(false);

  return (
    <LikeButtonContext.Provider
      value={{
        liked,
        setLiked,
      }}
    >
      {children}
    </LikeButtonContext.Provider>
  );
}
