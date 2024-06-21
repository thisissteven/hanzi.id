// const sentence = `
//   A cat is a small carnivorous mammal. It is the only domesticated species in the family Felidae. It is often referred to as the domestic cat to distinguish it from wild members of the family.
// `;

import { franc } from "franc";
import React from "react";

const sentence = cleanUpText(`“哦？那……谢谢。”我环视教室内一圈，关上门。`).replace(/\s+/g, " ");

export const comma = "，";
export const period = "。";
export const ellipsis = "…";
export const question = "？";
export const exclamation = "！";
export const semicolon = "；";
export const colon = "：";
export const dash = "—";
export const hyphen = "-";
export const newline = "\n";

export const commaRegexp = /,|，/;
export const periodRegexp = /\.|。/;
export const ellipsisRegexp = /…/;
export const questionRegexp = /\?|？/;
export const exclamationRegexp = /!|！/;
export const semicolonRegexp = /;|；/;
export const colonRegexp = /:|：/;
export const dashRegexp = /—/;
export const hyphenRegexp = /-/;
export const newlineRegexp = /\n/;

function cleanUpText(input: string) {
  // Replace sequences of newline and indentations with a single space
  input = input.replace(/[\u3000\n]+\u3000*/g, " ");

  // Replace newlines not followed by a Chinese punctuation mark or space with a space
  input = input.replace(/([^。！？])\n([^。！？])/g, "$1$2");

  return input;
}

function removeNewlinesWithinSentences(input: string) {
  // Use a regular expression to match and replace newlines within Chinese sentences.
  // This regex looks for a newline that is not preceded or followed by a Chinese punctuation mark.
  return input.replace(/([^。！？])\n([^。！？])/g, "$1$2");
}

function trimNewLines(text: string) {
  // Split the text into lines
  let lines = text.split("\n");

  // Array to hold the corrected lines
  let correctedLines = [];

  // Regular expression to check for punctuation at the end of a line
  let punctuationRegex = /[。！？．，：；]$/;

  // Iterate through the lines
  for (let i = 0; i < lines.length; i++) {
    // Trim leading and trailing whitespace from the current line
    let currentLine = lines[i].trim();

    // While the current line does not end with punctuation and is not the last line
    while (i < lines.length - 1 && !punctuationRegex.test(currentLine)) {
      // Concatenate the current line with the next line
      i++;
      currentLine += " " + lines[i].trim();
    }

    // Append the corrected line to the array
    correctedLines.push(currentLine);
  }

  // Join the corrected lines back into a single string
  return correctedLines.join("\n");
}

const allPunctuation = new RegExp(
  `${commaRegexp.source}|${periodRegexp.source}|${ellipsisRegexp.source}|${questionRegexp.source}|${exclamationRegexp.source}|${semicolonRegexp.source}|${colonRegexp.source}|${dashRegexp.source}|${hyphenRegexp.source}`,
  "g"
);

export function removePunctuation(input: string) {
  // Replace multiple spaces with a single space
  input = input.replace(/\s+/g, " ");

  // Trim any leading or trailing spaces
  input = input.trim();
  return input.replace(allPunctuation, "");
}

export function useParagraphs() {
  const paragraphs = React.useMemo(() => {
    const sections = sentence.split("\n");

    const localeMapping = {
      eng: "en_US", // English
      cmn: "zh_CN", // Simplified Chinese (Mandarin)
    } as const;
    const locale = franc(sections[0] ?? "") as keyof typeof localeMapping;

    const period = locale === "cmn" ? "。" : ".";
    const periodConversation = locale === "cmn" ? "。”" : ".";

    const questionMark = locale === "cmn" ? "？" : "?";

    const exclamationMark = locale === "cmn" ? "！" : "!";

    let paragraphs = sections
      .map((paragraph) => paragraph.split(periodConversation))
      .map((paragraph) => {
        return paragraph.map((sentence, index) => {
          if (index === paragraph.length - 1) {
            return sentence;
          }
          return (sentence + periodConversation).trim();
        });
      });

    paragraphs = splitByPunctuation(paragraphs, period);
    paragraphs = splitByPunctuation(paragraphs, questionMark);
    paragraphs = splitByPunctuation(paragraphs, exclamationMark);

    paragraphs = adjustParagraph(paragraphs);

    return paragraphs;
  }, []);

  const sentences = React.useMemo(() => paragraphs.flat(), [paragraphs]);

  return { paragraphs, sentences };
}

function splitByPunctuation(paragraphs: string[][], punctuation: string) {
  return paragraphs.map((paragraph) => {
    return paragraph
      .map((sentence) => {
        return sentence.split(punctuation);
      })
      .map((paragraph) =>
        paragraph.map((sentence, index) => {
          if (index === paragraph.length - 1) {
            return sentence;
          }
          return (sentence + punctuation).trim();
        })
      )
      .flat()
      .filter((paragraph) => paragraph !== "");
  });
}

function adjustParagraph(paragraphs: string[][]) {
  return (paragraphs = paragraphs
    .map((paragraph) => {
      let adjustedParagraph = [];

      for (let i = 0; i < paragraph.length; i++) {
        let current = paragraph[i];

        if (current === "”" && i > 0) {
          adjustedParagraph[adjustedParagraph.length - 1] += current;
        } else if (current.endsWith("”")) {
          adjustedParagraph[adjustedParagraph.length - 1] += current;
        } else {
          adjustedParagraph.push(current);
        }
      }

      return adjustedParagraph;
    })
    .filter((paragraph) => paragraph.length > 0));
}
