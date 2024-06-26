// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { segment } from "@/utils/tokenizer";

export const config = {
  maxDuration: 15,
};

export type FlashcardApiResponse = {
  result: Array<FlashcardedResult[]>;
};

export interface FlashcardedResult {
  simplified: string;
  entries?: Array<{
    pinyin: string;
    english: string[];
  }>;
}

type TokenizerResult = Array<{
  text: string;
  traditional: string;
  simplified: string;
  position: { offset: number; line: number; column: number };
  matches: Array<{
    pinyin: string;
    pinyinPretty: string;
    english: string;
  }>;
}>;

export default function handler(req: NextApiRequest, res: NextApiResponse<FlashcardApiResponse>) {
  const text = req.query.text as string;

  const flashcarded = text.split("-").map((t) => segment(t));

  const result = flashcarded.map((item: TokenizerResult) => {
    return item.map((i) => {
      const entries = i.matches.map((match) => ({
        pinyin: match.pinyinPretty,
        english: match.english.split("/").map((t) => t.trim()),
      }));

      return {
        simplified: i.simplified,
        entries,
      };
    });
  });

  res.status(200).json({ result });
}
