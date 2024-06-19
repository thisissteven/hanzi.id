import type { NextApiRequest, NextApiResponse } from "next";
import CC_CEDICT from "@/data/cedict_1_0_ts_utf-8_mdbg.json";

const KEYS = {
  SIMPLIFIED: 0,
  TRADITIONAL: 1,
  PINYIN: 2,
  ENTRIES: 3,
  DEFINITIONS: 4,
  RANK: 5,
  HSK: 6,
};

function lookup(hanzi: string) {
  const entry = CC_CEDICT[hanzi as keyof typeof CC_CEDICT] as any;
  if (!entry) return null;
  return {
    simplified: entry[KEYS.SIMPLIFIED],
    rank: entry[KEYS.RANK],
    hsk: entry[KEYS.HSK],
    entries: entry[KEYS.ENTRIES].map((en: any) => {
      return {
        traditional: en[KEYS.TRADITIONAL],
        pinyin: en[KEYS.PINYIN],
        definitions: en[KEYS.DEFINITIONS],
      };
    }),
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "max-age=0, s-maxage=31536000");

  const hanzi = req.query.hanzi as string;

  const response = await fetch(`https://www.chinesepod.com/api/v1/dictionary/get-details?word=${encodeURI(hanzi)}`);
  const data = await response.json();

  const details = {
    definition: lookup(hanzi),
    related: data.related,
    idioms: data.idioms,
    lessons: data.lessons,
  };

  return res.status(200).json(details);
}
