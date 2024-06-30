// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { translateToEn, translateToId } from "@/utils/translate";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { sentence, targetLang } = req.query;

  const data = targetLang === "en" ? await translateToEn(sentence) : await translateToId(sentence);

  res.status(200).json(data);
}
