// const sentence = `
//   A cat is a small carnivorous mammal. It is the only domesticated species in the family Felidae. It is often referred to as the domestic cat to distinguish it from wild members of the family.
// `;

import { franc } from "franc";
import React from "react";

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

// const startQuote = "“";
// const endQuote = "”";

const startQuote = "「";
const endQuote = "」";

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

  // Regular expression to match spaces between Chinese characters
  const regex = /([\u4e00-\u9fa5])\s+([\u4e00-\u9fa5])/g;

  // Replace spaces between Chinese characters with no space
  const newText = input.replace(regex, "$1$2");

  return newText;
}

const allPunctuation = new RegExp(
  `${commaRegexp.source}|${periodRegexp.source}|${ellipsisRegexp.source}|${questionRegexp.source}|${exclamationRegexp.source}|${semicolonRegexp.source}|${colonRegexp.source}|${dashRegexp.source}|${hyphenRegexp.source}`,
  "g"
);

export function getParagraphs(text: string) {
  const sentence = cleanUpText(text).replace(/\s+/g, " ");

  const sections = sentence.split("\n");

  const locale = franc(sections[0] ?? "");

  const period = ["cmn", "und"].includes(locale) ? "。" : ".";
  const periodConversation = ["cmn", "und"].includes(locale) ? `。${endQuote}` : ".";

  const questionMark = ["cmn", "und"].includes(locale) ? "？" : "?";
  const questionMarkConversation = ["cmn", "und"].includes(locale) ? `？${endQuote}` : "?";

  const exclamationMark = ["cmn", "und"].includes(locale) ? "！" : "!";
  const exclamationMarkConversation = ["cmn", "und"].includes(locale) ? `！${endQuote}` : "!";

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

  paragraphs = splitByPunctuationConversation(paragraphs, questionMarkConversation);

  paragraphs = splitByPunctuationConversation(paragraphs, exclamationMarkConversation);

  paragraphs = splitByQuotation(paragraphs);

  paragraphs = splitByPunctuation(paragraphs, questionMark);

  paragraphs = splitByPunctuation(paragraphs, period);

  paragraphs = splitByPunctuation(paragraphs, exclamationMark);

  return paragraphs;
}

export function removePunctuation(input: string) {
  // Replace multiple spaces with a single space
  input = input.replace(/\s+/g, " ");

  // Trim any leading or trailing spaces
  input = input.trim();
  return input.replace(allPunctuation, "");
}

export function useParagraphs(text: string) {
  const paragraphs = React.useMemo(() => {
    return getParagraphs(text);
  }, [text]);

  const sentences = React.useMemo(() => paragraphs.flat(), [paragraphs]);

  return { paragraphs, sentences };
}

function splitByPunctuationConversation(paragraphs: string[][], punctuation: string) {
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

function splitByQuotation(paragraphs: string[][]) {
  return paragraphs.map((paragraph) => {
    return paragraph.flatMap((sentence) => {
      // Check for consecutive quotation marks " “ or ” "
      const parts = [];
      let currentPart = "";
      let insideQuotes = false;

      for (let i = 0; i < sentence.length; i++) {
        if (sentence[i] === startQuote) {
          if (insideQuotes) {
            // If already inside quotes, push the current part
            parts.push(currentPart.trim());
            currentPart = startQuote; // Start new part with opening quote
          } else {
            // Start a new quoted section
            insideQuotes = true;
            currentPart += startQuote;
          }
        } else if (sentence[i] === endQuote) {
          if (insideQuotes) {
            currentPart += endQuote; // Add closing quote to current part
            // Check next character for consecutive opening quote
            if (i < sentence.length - 1 && sentence[i + 1] === startQuote) {
              // End the current part and push it
              parts.push(currentPart.trim());
              currentPart = ""; // Reset current part for next quote
              insideQuotes = false; // Exit quoted section
            }
          } else {
            currentPart += endQuote; // Outside quotes, just add to current part
          }
        } else {
          currentPart += sentence[i]; // Add non-quote characters to current part
        }
      }

      // Push the last accumulated part
      if (currentPart.trim() !== "") {
        parts.push(currentPart.trim());
      }

      return parts;
    });
  });
}

function splitByPunctuation(paragraphs: string[][], punctuation: string) {
  return paragraphs.map((paragraph) => {
    return paragraph.flatMap((sentence) => {
      // Check if the sentence is wrapped with “ and ”
      if (sentence.startsWith(startQuote) && sentence.endsWith(endQuote)) {
        return [sentence]; // Return the entire sentence as-is
      }

      // Split the sentence by the punctuation outside of quotations
      let parts = [];
      let insideQuotes = false;
      let currentPart = "";

      for (let i = 0; i < sentence.length; i++) {
        if (sentence[i] === startQuote) {
          insideQuotes = true;
          currentPart += sentence[i];
        } else if (sentence[i] === endQuote) {
          insideQuotes = false;
          currentPart += sentence[i];
        } else if (insideQuotes) {
          currentPart += sentence[i];
        } else if (punctuation.includes(sentence[i])) {
          if (currentPart.trim() !== "") {
            parts.push(currentPart.trim() + punctuation); // Add punctuation
            currentPart = "";
          }
        } else {
          currentPart += sentence[i];
        }
      }

      // Push the last part
      if (currentPart.trim() !== "") {
        parts.push(currentPart.trim());
      }

      return parts;
    });
  });
}

function adjustParagraph(paragraphs: string[][]) {
  return (paragraphs = paragraphs
    .map((paragraph) => {
      let adjustedParagraph = [];

      for (let i = 0; i < paragraph.length; i++) {
        let current = paragraph[i];

        if (current === endQuote && i > 0) {
          adjustedParagraph[adjustedParagraph.length - 1] += current;
        } else if (current.endsWith(endQuote)) {
          adjustedParagraph[adjustedParagraph.length - 1] += current;
        } else {
          adjustedParagraph.push(current);
        }
      }

      return adjustedParagraph;
    })
    .filter((paragraph) => paragraph.length > 0));
}
