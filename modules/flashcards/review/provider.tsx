import React from "react";
import { CardStatus } from "./content";

const ReviewContext = React.createContext(
  {} as {
    currentIndex: number;
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
    reviewResult: CardStatus[];
    setReviewResult: React.Dispatch<React.SetStateAction<CardStatus[]>>;
    flipped: number | null;
    setFlipped: React.Dispatch<React.SetStateAction<number | null>>;
  }
);

export const useReview = () => {
  return React.useContext(ReviewContext);
};

export function ReviewProvider({ children, length }: { children: React.ReactNode; length: number }) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const [reviewResult, setReviewResult] = React.useState<Array<CardStatus>>(Array.from({ length }, () => "untouched"));

  const [flipped, setFlipped] = React.useState<number | null>(null);

  return (
    <ReviewContext.Provider
      value={{
        currentIndex,
        setCurrentIndex,
        reviewResult,
        setReviewResult,
        flipped,
        setFlipped,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
}
