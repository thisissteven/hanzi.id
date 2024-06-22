// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { prisma, requestHandler } from "@/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username } = req.body;

  await requestHandler(req, res, {
    allowedRoles: {
      PUT: ["USER"],
    },
    PUT: async (currentUser) => {
      const user = await prisma.user.update({
        where: {
          id: currentUser.id,
        },
        data: {
          username,
        },
      });

      res.status(200).json(user);
    },
  });
}
