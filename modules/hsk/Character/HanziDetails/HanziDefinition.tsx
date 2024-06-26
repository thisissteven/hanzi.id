export function HanziDefinition({
  entry,
}: {
  entry: {
    pinyin: string;
    definitions: string[];
  };
}) {
  return (
    <ul className="relative ml-8 pr-2 grid sm:grid-cols-2">
      {entry.definitions.map((definition, index) => {
        return (
          <li key={index} className="list-disc">
            <div className="pr-4">{definition}</div>
          </li>
        );
      })}
    </ul>
  );
}
