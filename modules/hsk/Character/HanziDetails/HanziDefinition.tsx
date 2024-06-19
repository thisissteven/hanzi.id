export function HanziDefinition({
  entry,
}: {
  entry: {
    pinyin: string;
    definitions: string[];
  };
}) {
  return (
    <ul className="relative ml-8">
      {entry.definitions.map((definition, index) => {
        return (
          <li key={index} className="list-disc">
            {definition}
          </li>
        );
      })}
    </ul>
  );
}
