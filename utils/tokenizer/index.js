const path = require("path");
const { loadFile } = require("./main");

const filePathEn = path.join(process.cwd(), "utils", "tokenizer", "en", "cedict_ts.u8");

const tokenizeEn = loadFile(filePathEn);

function segment(text) {
  try {
    const segmented = tokenizeEn(text);
    return segmented;
  } catch {
    return [];
  }
}

module.exports = { segment };
