import type { NextApiRequest, NextApiResponse } from "next";

import { getStatsFromText, prisma, requestHandler } from "@/utils";
import { Prisma } from "@prisma/client";
import { getParagraphs } from "@/utils/use-speech/paragraph-utils";
import { enToId, zhCNTozhTW } from "@/utils/translate";

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

  const books = await prisma.book.findMany({
    ...params,
    skip,
    cursor,
    take: TAKE,
    include: {
      image: true,
      chapters: {
        select: {
          _count: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const lastThread = books.length === TAKE ? books[TAKE - 1] : null;
  const lastCursor = lastThread ? lastThread.id : null;

  return {
    data: books,
    cursor: lastCursor,
  };
}

async function getAllBooks() {
  return await prisma.book.findMany({
    include: {
      image: true,
      chapters: {
        select: {
          _count: true,
        },
      },
    },
  });
}

// export type GetAllBooksResponse = Prisma.PromiseReturnType<typeof getPaginatedBooks>;

export type GetAllBooksResponse = Prisma.PromiseReturnType<typeof getAllBooks>;

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

      const [descriptionId, titleTraditional] = await Promise.all([enToId(description), zhCNTozhTW(title)]);

      const user = await prisma.book.create({
        data: {
          userId: currentUser.id,
          title,
          titleTraditional,
          description,
          descriptionId,
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
              data: chapters?.map((chapter: any, index: number) => {
                const paragraphs = getParagraphs(chapter.content);
                const stats = getStatsFromText(chapter.content);
                return {
                  order: index + 1,
                  title: chapter.title,
                  content: chapter.content,
                  wordCount: stats.words,
                  estimatedReadingTime: stats.minutes,
                  totalSentences: paragraphs.flat().length,
                  shortContent: paragraphs.flat().slice(0, 5).join(" "),
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
