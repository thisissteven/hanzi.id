import type { NextApiRequest, NextApiResponse } from "next";

import { CurrentUser, getStatsFromText, prisma, requestHandler } from "@/utils";
import { Prisma } from "@prisma/client";

export function getCursor(previousCursor?: string | null) {
  const cursor = previousCursor
    ? {
        id: previousCursor,
      }
    : undefined;

  return cursor;
}

const TAKE = 30;

export async function getPaginatedBooks({
  previousCursor,
  params,
}: {
  previousCursor: string;
  params?: Prisma.BookFindManyArgs;
}) {
  const skip = previousCursor ? 1 : 0;
  const cursor = getCursor(previousCursor);

  const threads = await prisma.book.findMany({
    ...params,
    skip,
    cursor,
    take: TAKE,
    orderBy: {
      updatedAt: "desc",
    },
  });

  const lastThread = threads.length === TAKE ? threads[TAKE - 1] : null;
  const lastCursor = lastThread ? lastThread.id : null;

  return {
    data: threads,
    cursor: lastCursor,
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await requestHandler(req, res, {
    allowedRoles: {
      GET: ["PUBLIC", "USER"],
      POST: ["USER"],
    },
    GET: async () => {
      const previousCursor = req.query.cursor as string;

      const books = await getPaginatedBooks({
        previousCursor,
      });

      res.status(200).json(books);
    },
    POST: async (currentUser) => {
      const { title, description, chapters, image } = req.body;

      const user = await prisma.book.create({
        data: {
          userId: currentUser.id,
          title,
          description,
          image: {
            create: {
              source: image.source,
              mediumUrl: image.mediumUrl,
              smallUrl: image.smallUrl,
              width: image.width,
              height: image.height,
            },
          },
          chapters: {
            createMany: {
              data: chapters?.map((chapter: any) => {
                const stats = getStatsFromText(chapter.content);
                return {
                  title: chapter.title,
                  content: chapter.content,
                  wordCount: stats.words,
                  estimatedReadingTime: stats.minutes,
                };
              }),
            },
          },
        },
      });

      res.status(200).json(user);
    },
  });
}
