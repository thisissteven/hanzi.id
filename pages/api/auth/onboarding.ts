// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { requestHandler } from "@/utils/request-handler";
import { prisma } from "@/utils/prisma";

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
