import type { NextApiRequest, NextApiResponse } from "next";

import { CurrentUser, getStatsFromText, prisma, requestHandler } from "@/utils";
import { Prisma } from "@prisma/client";

type Category = "recent" | "popular" | "saved";

export function getWhereParams(currentUser: CurrentUser, category: Category): Prisma.BookFindManyArgs | undefined {
  switch (category) {
    case "recent":
    case undefined:
      return {
        where: {
          OR: [],
        },
      };
    case "popular":
      return {
        where: {
          OR: [],
        },
      };
    case "saved":
      return {
        where: {
          OR: [],
        },
      };
    default:
      return undefined;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await requestHandler(req, res, {
    allowedRoles: {
      GET: ["PUBLIC", "USER"],
      POST: ["USER"],
    },
    GET: async (currentUser) => {
      const previousCursor = req.query.cursor as string;
      const category = req.query.category as Category;

      const books = [] as any;

      //   const books = await getPaginatedThreads({
      //     currentUser,
      //     category,
      //     previousCursor,
      //     params: {
      //       ...getWhereParams(currentUser, category),
      //     },
      //   });

      res.status(200).json(books);
    },
    POST: async (currentUser) => {
      const { title, description, chapters } = req.body;

      const user = await prisma.book.create({
        data: {
          userId: currentUser.id,
          title,
          description,
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
