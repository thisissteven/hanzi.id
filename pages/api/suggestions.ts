import type { NextApiRequest, NextApiResponse } from "next";

import { prisma, requestHandler } from "@/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await requestHandler(req, res, {
    allowedRoles: {
      POST: ["PUBLIC"],
    },
    POST: async () => {
      const { text, category } = req.body;

      await new Promise((resolve) => setTimeout(resolve, 1000));

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
