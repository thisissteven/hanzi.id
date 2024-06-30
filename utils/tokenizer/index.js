const path = require("path");
const { loadFile } = require("./main");

const filePathEn = path.join(process.cwd(), "utils", "tokenizer", "en", "cedict_ts.u8");
const filePathId = path.join(process.cwd(), "utils", "tokenizer", "id", "cedict_ts.u8");

const tokenizeId = loadFile(filePathId);
const tokenizeEn = loadFile(filePathEn);

function segment(text, locale) {
  const segmented = locale === "id" ? tokenizeId(text) : tokenizeEn(text);
  return segmented;
}

module.exports = { segment };
