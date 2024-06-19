import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { load } from "cheerio";
import request from "request";

const YABLA_URI = "https://chinese.yabla.com/chinese-english-pinyin-dictionary.php";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "max-age=0, s-maxage=31536000");
  const hanzi = req.query.hanzi as string;
  const pinyin = req.query.pinyin as string;

  try {
    const { data } = await axios.get(`${YABLA_URI}?define=${encodeURI(hanzi)}`);

    const $ = load(data);

    const liElements = $("li.entry");

    let mp3Url = null;

    liElements.each((_, li) => {
      const hanziElements = $(li).find("span.word > a:not(.trad a)");
      const currentHanzi = hanziElements
        .map((_, elem) => $(elem).text())
        .get()
        .join("");

      const currentPinyin = $(li).find("div.definition > span.pinyin").text();

      if (currentHanzi === hanzi && currentPinyin === pinyin) {
        mp3Url = $(li).find(".word_audio").attr("data-audio_url");
        return false;
      }
    });

    if (!mp3Url) {
      throw new Error(`Audio file for ${hanzi} not found.`);
    }

    req.pipe(request(mp3Url)).pipe(res);
  } catch (err) {
    res.status(400).json(err);
  }
}
