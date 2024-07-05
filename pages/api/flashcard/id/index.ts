// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { segmentId } from "@/utils/tokenizer/segment-id";
import { FlashcardedResult, TokenizerResult } from "../en";

export const config = {
  maxDuration: 15,
};

export const runtime = process.env.NODE_ENV === "production" ? "edge" : "nodejs";

export default function handler(req: NextApiRequest, res: NextApiResponse<FlashcardedResult[]>) {
  const text = req.query.text as string;

  const flashcarded = text.split("-").map((t) => segmentId(t));

  const result = flashcarded.map((item: TokenizerResult) => {
    return item.map((i) => {
      const entries = i.matches.map((match) => ({
        pinyin: match.pinyinPretty,
        english: match.english.split("/").map((t) => t.trim()),
      }));

      const characters = i.text.split("").map((t) => segmentId(t));

      const disected = characters.map((item: TokenizerResult) => {
        return item.map((i) => {
          const entries = i.matches.map((match) => ({
            pinyin: match.pinyinPretty,
            english: match.english.split("/").map((t) => t.trim()),
          }));

          return {
            simplified: i.simplified,
            traditional: i.traditional,
            entries,
          };
        })[0];
      });

      return {
        simplified: i.simplified,
        traditional: i.traditional,
        entries,
        disected,
      };
    })[0];
  });

  res.status(200).json(result);
}
