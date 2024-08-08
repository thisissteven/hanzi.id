import { NextApiRequest, NextApiResponse } from "next";
import { SegmentedResult, segmentFnId } from "../../segment/id";

const getSubtitles = async ({ videoID, lang = "en" }: { videoID: string; lang?: string }) => {
  const response = await fetch(`https://youtube.com/watch?v=${videoID}`);

  const data = await response.text();

  // Check if the video page contains captions
  if (!data.includes("captionTracks")) {
    console.warn(`No captions found for video: ${videoID}`);
    return [];
  }

  //   Extract caption tracks JSON string from video page data
  const regex = /"captionTracks":(\[.*?\])/;
  const regexResult = regex.exec(data);

  if (!regexResult) {
    console.warn(`Failed to extract captionTracks from video: ${videoID}`);
    return [];
  }

  const [_, captionTracksJson] = regexResult;
  const captionTracks = JSON.parse(captionTracksJson);

  // Helper function to find caption URL
  const findCaptionUrl = (x: any) => captionTracks.find((y: any) => y.vssId.indexOf(x) === 0)?.baseUrl;

  // Determine the URL for subtitles
  let firstChoice = findCaptionUrl("." + lang);
  let url = firstChoice
    ? `${firstChoice}&fmt=json3`
    : (findCaptionUrl(".") || findCaptionUrl("a." + lang) || captionTracks[0].baseUrl) + `&fmt=json3&tlang=${lang}`;

  // Fetch and parse the subtitles
  const subsResponse = await fetch(url);
  const subtitles = await subsResponse.json();

  // Map events to include text content
  const events = subtitles.events.map((event: any) => ({
    ...event,
    text:
      event.segs
        ?.map((seg: any) => seg.utf8)
        ?.join(" ")
        ?.replace(/\n/g, " ")
        ?.replace(/♪|'|"|\.{2,}|\<[\s\S]*?\>|\{[\s\S]*?\}|\[[\s\S]*?\]/g, "")
        ?.trim() || "",
  }));

  const mapped = events.map((event: any) => ({
    start: event.tStartMs / 1000,
    duration: event.dDurationMs / 1000,
    text: event.text,
  }));

  return mapped;
};

export type Subtitles = Array<{
  start: number;
  duration: number;
  text: string;
}>;

export type SubtitleResponse = {
  subtitles: Subtitles;
  sections: SegmentedResult[][];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const videoID = req.query.videoID as string;
    const lang = req.query.lang as string;
    const subtitles = (await getSubtitles({ videoID, lang })) as Subtitles;

    const isZh = lang.includes("zh");

    const sections = isZh ? subtitles.map((sub) => segmentFnId(sub.text)) : [];

    if (subtitles.length === 0) {
      throw new Error();
    }

    res.status(200).json({ subtitles, sections });
  } catch (err) {
    res.status(400).json({
      error: "not-found",
      details: err,
    });
  }
}
