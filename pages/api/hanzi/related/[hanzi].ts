import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "public, s-maxage=31536000, stale-while-revalidate=59");

  const hanzi = req.query.hanzi as string;

  const response = await fetch(`https://www.chinesepod.com/api/v1/dictionary/get-details?word=${encodeURI(hanzi)}`);
  const data = await response.json();

  const details = {
    related: data.related,
    idioms: data.idioms,
    lessons: data.lessons,
  };

  return res.status(200).json(details);
}
