const path = require("path");
const { loadFile } = require("./main");

const filePathId = path.join(process.cwd(), "utils", "tokenizer", "id", "cedict_ts.u8");

const tokenizeId = loadFile(filePathId);

function segmentId(text) {
  const segmented = tokenizeId(text);
  return segmented;
}

module.exports = { segmentId };
