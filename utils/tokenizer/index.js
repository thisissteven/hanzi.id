const path = require("path");
const { loadFile } = require("./main");

const filePath = path.join(process.cwd(), "utils", "tokenizer", "cedict_ts.u8");
const tokenize = loadFile(filePath);

function segment(text) {
  const segmented = tokenize(text);
  return segmented;
}

module.exports = { segment };
