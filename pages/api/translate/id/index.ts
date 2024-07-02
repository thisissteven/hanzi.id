// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { segmentId } from "@/utils/tokenizer/segment-id";
import { translateToId } from "@/utils/translate";

export const config = {
  maxDuration: 15,
};

export type TranslateApiResponse = {
  result: Array<SegmentedResult[]>;
  translated: string;
};

export interface SegmentedResult {
  index: number;
  simplified: string;
  traditional: string;
  entries?: Array<{
    pinyin: string;
    english: string[];
  }>;
  isPunctuation: boolean;
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

// const punctuations = /([\u4e00-\u9fa5]+|[^a-zA-Z0-9\u4e00-\u9fa5]+)/g;
const punctuations = /([\u4e00-\u9fa5]+|\d+|[^a-zA-Z0-9\u4e00-\u9fa5]+)/g;

export const runtime = process.env.NODE_ENV === "production" ? "edge" : "nodejs";

export default async function handler(req: NextApiRequest, res: NextApiResponse<TranslateApiResponse | string>) {
  try {
    const text = req.query.text as string;

    const translated = await translateToId(text);

    const splitted = text.match(punctuations) ?? [];

    const segmented = splitted.map((t) => {
      if (t.match(/[\u4e00-\u9fa5]/)) {
        return segmentId(t);
      }

      return [{ simplified: t }];
    });

    let passedIndex = 0;
    const result = segmented.map((item: TokenizerResult) => {
      return item.map((i) => {
        const currentIndex = passedIndex;
        passedIndex += i.simplified.length;

        // for punctuations
        if (Object.keys(i).length === 1)
          return {
            index: currentIndex,
            simplified: i.simplified,
            traditional: i.traditional,
            isPunctuation: true,
          };

        const entries = i.matches.map((match) => ({
          pinyin: match.pinyinPretty,
          english: match.english.split("/").map((t) => t.trim()),
        }));

        // for hanzi
        return {
          index: currentIndex,
          simplified: i.simplified,
          traditional: i.traditional,
          entries,
          isPunctuation: false,
        };
      });
    });

    res.status(200).json({ result, translated });
  } catch {
    res.status(500).json("Internal Server Error");
  }
}
