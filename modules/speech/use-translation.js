import useSWRImmutable from "swr/immutable";

export function useTranslation(sentence, targetLang) {
  const swrData = useSWRImmutable(
    `translate/${sentence}?targetLang=${targetLang}`,
    async (url) => {
      const response = await fetch(`/api/${url}`);
      const data = await response.json();
      return data;
    },
    {
      keepPreviousData: true,
    }
  );

  return swrData;
}
