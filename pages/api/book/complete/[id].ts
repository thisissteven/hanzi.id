// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { requestHandler } from "@/utils/request-handler";
import { prisma } from "@/utils/prisma";

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
          content: true,
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

export type GetBookByIdResponse = Awaited<ReturnType<typeof getBookById>>;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await requestHandler(req, res, {
    allowedRoles: {
      GET: ["PUBLIC"],
    },

    GET: async () => {
      const id = req.query.id as string;

      const book = await getBookById(id);

      res.status(200).json(book);
    },
  });
}
