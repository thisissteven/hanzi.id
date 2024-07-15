import { franc } from "franc";

const comma = "，";
const period = "。";
const ellipsis = "…";
const question = "？";
const exclamation = "！";
const semicolon = "；";
const colon = "：";
const dash = "—";
const hyphen = "-";
const newline = "\n";

const commaRegexp = /,|，/;
const periodRegexp = /\.|。/;
const ellipsisRegexp = /…/;
const questionRegexp = /\?|？/;
const exclamationRegexp = /!|！/;
const semicolonRegexp = /;|；/;
const colonRegexp = /:|：/;
const dashRegexp = /—/;
const hyphenRegexp = /-/;
const newlineRegexp = /\n/;

export function capitalizeFirstLetter(word: string) {
  if (!word) return word;
  return word.charAt(0).toUpperCase() + word.slice(1);
}

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

export function getParagraphs(text: string, startQuote = "“", endQuote = "”") {
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

  paragraphs = splitByQuotation(paragraphs, startQuote, endQuote);

  paragraphs = splitByPunctuation(paragraphs, questionMark, startQuote, endQuote);

  paragraphs = splitByPunctuation(paragraphs, period, startQuote, endQuote);

  paragraphs = splitByPunctuation(paragraphs, exclamationMark, startQuote, endQuote);

  return paragraphs;
}

function removePunctuation(input: string) {
  // Replace multiple spaces with a single space
  input = input.replace(/\s+/g, " ");

  // Trim any leading or trailing spaces
  input = input.trim();
  return input.replace(allPunctuation, "");
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

function splitByQuotation(paragraphs: string[][], startQuote: string, endQuote: string) {
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

function splitByPunctuation(paragraphs: string[][], punctuation: string, startQuote: string, endQuote: string) {
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
