import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import fs from "fs";

const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15",
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data } = await axios.get(`https://youtube.com/watch?v=fHHJnQjNNI0`, {
      withCredentials: false,
      headers: {
        "User-Agent": userAgents[Math.floor(Math.random() * userAgents.length)],
      },
    });

    fs.writeFileSync("data.html", data);

    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({
      error: "not-found",
    });
  }
}
