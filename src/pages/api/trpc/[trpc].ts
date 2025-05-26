import { appRouter } from "@/server/routers/_app";
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { prisma } from "@/server/db";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { auth } from "@/lib/firebase-admin";
import { TRPCError } from "@trpc/server";

export default createNextApiHandler({
  router: appRouter,
  createContext: async ({ req, res }: CreateNextContextOptions) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return {
        req,
        res,
        prisma,
      };
    }

    try {
      const decodedToken = await auth.verifyIdToken(token);
      const user = await prisma.user.findUnique({
        where: { id: decodedToken.uid },
      });

      if (!user) {
        const firebaseUser = await auth.getUser(decodedToken.uid);
        const newUser = await prisma.user.create({
          data: {
            id: firebaseUser.uid,
            email: firebaseUser.email!,
            name: firebaseUser.displayName || null,
            role: "USER",
          },
        });
        return {
          req,
          res,
          prisma,
          user: newUser,
        };
      }

      return {
        req,
        res,
        prisma,
        user,
      };
    } catch (error) {
      return {
        req,
        res,
        prisma,
      };
    }
  },
});
