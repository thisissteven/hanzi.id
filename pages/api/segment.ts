// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { segment } from "@/utils/tokenizer";

export const config = {
  maxDuration: 15,
};

export type SegmentApiResponse = {
  result: Array<SegmentedResult[]>;
};

export interface SegmentedResult {
  index: number;
  hsk?: number;
  simplified: string;
  pinyin?: string;
  translations?: string[];
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

const punctuations = /([\u4e00-\u9fa5]+|[^a-zA-Z0-9\u4e00-\u9fa5]+)/g;

export default function handler(req: NextApiRequest, res: NextApiResponse<SegmentApiResponse>) {
  const text = req.query.text as string;

  const splitted = text.match(punctuations) ?? [];

  const segmented = splitted.map((t) => {
    if (t.match(/[\u4e00-\u9fa5]/)) {
      return segment(t);
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
          isPunctuation: true,
        };

      const pinyin = i.matches[0].pinyinPretty;
      const translations = i.matches[0].english.split("/").map((t) => t.trim());

      // for hanzi
      return {
        index: currentIndex,
        // hsk: i.hsk,
        simplified: i.simplified,
        pinyin: pinyin,
        translations: translations,
        isPunctuation: false,
      };
    });
  });

  res.status(200).json({ result });
}
