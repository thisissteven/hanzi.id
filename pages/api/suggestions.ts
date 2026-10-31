import type { NextApiRequest, NextApiResponse } from "next";

import { requestHandler } from "@/utils/request-handler";
import { prisma } from "@/utils/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await requestHandler(req, res, {
    allowedRoles: {
      POST: ["PUBLIC"],
    },
    POST: async () => {
      const { text, category } = req.body;

      const suggestion = await prisma.suggestions.create({
        data: {
          text,
          category,
        },
      });

      res.status(200).json(suggestion);
    },
  });
}
