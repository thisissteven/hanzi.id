import { translate } from "google-translate-api-browser";

export async function translateToEn(sentence) {
  const response = await translate(sentence, { from: "zh-CN", to: "en" });
  return response.text;
}

const regex = /(\p{L}|\p{N}) - ?(\p{L}|\p{N})/gu;

export async function translateToId(sentence) {
  const response = await translate(sentence, { from: "zh-CN", to: "id" });
  return response.text.replace(regex, "$1-$2");
}
