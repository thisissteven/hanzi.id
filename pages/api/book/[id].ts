// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { prisma, requestHandler } from "@/utils";
import { Prisma } from "@prisma/client";

async function getBookById(id: string) {
  return prisma.book.findUnique({
    where: {
      id,
    },
    include: {
      chapters: {
        select: {
          id: true,
          title: true,
          shortContent: true,
          totalSentences: true,
          estimatedReadingTime: true,
          wordCount: true,
        },
        orderBy: {
          order: "asc",
        },
      },
      image: true,
    },
  });
}

export type GetBookByIdResponse = Prisma.PromiseReturnType<typeof getBookById>;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await requestHandler(req, res, {
    allowedRoles: {
      GET: ["PUBLIC"],
      // DELETE: ["PUBLIC"],
    },

    GET: async () => {
      const id = req.query.id as string;

      const book = await getBookById(id);

      res.status(200).json(book);
    },

    // DELETE: async () => {
    //   const id = req.query.id as string;

    //   await prisma.book.delete({
    //     where: {
    //       id,
    //     },
    //   });

    //   res.status(200).json({ message: "Book deleted" });
    // },
  });
}
