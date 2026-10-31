const fs = require("fs");
const path = require("path");

const file = fs.readFileSync(path.join(__dirname, "list.txt"), "utf-8");

function fileToEntries(file) {
  const lines = file.trim().split("\n");
  const entries = lines.slice(1).map((line) => {
    const values = line.split('"');
    if (values.length === 1) {
      const [id, hanzi, pinyin, translations, level] = values[0].split(";");
      const hskLevel = level.replace(/^;/, "").trim();
      return { id, hanzi, pinyin, translations: [translations], hskLevel };
    }

    const [id, hanzi, pinyin] = values[0].split(";");
    const [translations, level] = values.slice(1);
    const hskLevel = level.replace(/^;/, "").trim();
    return {
      id,
      hanzi,
      pinyin,
      translations: translations.split(";").map((translation) => translation.trimStart()),
      hskLevel,
    };
  });
  return entries;
}

const entries = fileToEntries(file);

function groupByHskLevel(entries) {
  return entries.reduce((acc, entry) => {
    const level = entry.hskLevel;
    if (!acc[level]) {
      acc[level] = [];
    }
    delete entry.hskLevel;
    acc[level].push(entry);
    return acc;
  }, {});
}

const groupedEntries = groupByHskLevel(entries);

for (const [level, entries] of Object.entries(groupedEntries)) {
  const filename = `hsk-level-${level}.json`;
  fs.writeFileSync(path.join(__dirname, filename), JSON.stringify(entries, null, 2));
}

const idHanziMap = entries.reduce((acc, entry) => {
  acc[entry.hanzi] = entry.id;
  acc[entry.id] = entry.hanzi;
  return acc;
}, {});

fs.writeFileSync(path.join(__dirname, "id-hanzi-map.json"), JSON.stringify(idHanziMap, null, 2));

Object.values(groupedEntries).map((entry, index) => {
  console.log(`${index + 1}:${entry.length},`);
});
