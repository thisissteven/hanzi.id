import { translate } from "google-translate-api-browser";

export async function translateToEn(sentence) {
  try {
    const response = await translate(sentence, { from: "zh-CN", to: "en" });
    return response.text.replace(regex, "$1-$2");
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

export async function zhCNTozhTW(sentence) {
  try {
    const response = await translate(sentence, { from: "zh-CN", to: "zh-TW" });
    return response.text;
  } catch {
    return "";
  }
}

export async function enToId(sentence) {
  try {
    const response = await translate(sentence, { from: "en", to: "id" });
    return response.text.replace(regex, "$1-$2");
  } catch {
    return "";
  }
}
