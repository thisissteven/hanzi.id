import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { load } from "cheerio";

const getUri = (subcategory: string) => `https://langeek.co/en-ZH/vocab/subcategory/${subcategory}/learn/review`;

const getProps = (scriptText: string) => {
  const parsedScriptText = JSON.parse(scriptText);
  const props = parsedScriptText.props.pageProps.initialState.static.subcategory;

  const title = props.title;
  const description = props.description;
  const cards = props.cards.map((card: any) => {
    return {
      id: card.id,
      translation: {
        en: {
          short: card.mainTranslation.title,
          long: card.mainTranslation.translation,
          partOfSpeech: card.mainTranslation.partOfSpeech.partOfSpeechType,
        },
        id: {
          short: card.mainTranslation.title,
          long: card.mainTranslation.translation,
          partOfSpeech: card.mainTranslation.partOfSpeech.partOfSpeechType,
        },
      },
      image: card.mainTranslation.wordPhoto?.photo ?? null,
      simplified: card.mainTranslation.localizedProperties?.translation ?? null,
      traditional: card.mainTranslation.localizedProperties?.traditionalTranslation ?? null,
    };
  });

  return { title, description, cards };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "public, s-maxage=31536000, stale-while-revalidate=59");
  const subcategory = req.query.subcategory as string;

  try {
    const { data } = await axios.get(getUri(subcategory));

    const $ = load(data);

    const scriptText = $("#__NEXT_DATA__").text();
    const props = getProps(scriptText);

    res.status(200).json({ ...props });
  } catch (err) {
    res.status(400).json(err);
  }
}
