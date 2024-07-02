const path = require("path");
const { loadFile } = require("./main");

const filePathId = path.join(process.cwd(), "utils", "tokenizer", "id", "cedict_ts.u8");

const tokenizeId = loadFile(filePathId);

function segmentId(text) {
  try {
    const segmented = tokenizeId(text);
    return segmented;
  } catch {
    return [];
  }
}

module.exports = { segmentId };
