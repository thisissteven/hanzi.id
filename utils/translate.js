import { translate } from "google-translate-api-browser";

export async function translateToEn(sentence) {
  try {
    const response = await translate(sentence, { from: "zh-CN", to: "en" });
    return response.text;
  } catch {
    return "";
  }
}

const regex = /(\p{L}|\p{N}) - ?(\p{L}|\p{N})/gu;

export async function translateToId(sentence) {
  try {
    const response = await translate(sentence, { from: "zh-CN", to: "id" });
    return response.text.replace(regex, "$1-$2");
  } catch {
    return "";
  }
}
