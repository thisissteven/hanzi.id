// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { prisma, requestHandler } from "@/utils";
import { Prisma } from "@prisma/client";

function getChapterById(id: string) {
  return prisma.chapter.findUnique({
    where: {
      id,
    },
    include: {
      book: {
        select: {
          id: true,
          title: true,
          isUnique: true,
        },
      },
    },
  });
}

export type GetChapterByIdResponse = Prisma.PromiseReturnType<typeof getChapterById>;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await requestHandler(req, res, {
    allowedRoles: {
      GET: ["PUBLIC"],
      // PUT: ["PUBLIC"],
    },

    GET: async () => {
      const id = req.query.id as string;

      const chapter = await getChapterById(id);

      res.status(200).json(chapter);
    },

    // PUT: async () => {
    //   const id = req.query.id as string;

    //   const book = await prisma.book.findUnique({
    //     where: {
    //       id,
    //     },
    //     include: {
    //       chapters: true,
    //     },
    //   });

    //   if (book) {
    //     await Promise.all(
    //       book.chapters.map(async (chapter) => {
    //         const paragraphs = getParagraphs(chapter.content);
    //         await prisma.chapter.update({
    //           where: {
    //             id: chapter.id,
    //           },
    //           data: {
    //             totalSentences: paragraphs.flat().length,
    //             shortContent: paragraphs.flat().slice(0, 5).join(" "),
    //           },
    //         });
    //       })
    //     );
    //   }

    //   res.status(200).json(book);
    // },
  });
}
