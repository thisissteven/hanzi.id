import { translate } from "google-translate-api-browser";

export async function translateToEn(sentence) {
  console.log(sentence);
  const response = await translate(sentence, { from: "zh-CN", to: "en", rpcids: "MkEWBc" });
  return response.text;
}

export async function translateToId(sentence) {
  console.log(sentence);
  const response = await translate(sentence, { from: "zh-CN", to: "id", rpcids: "MkEWBc" });
  return response.text;
}
