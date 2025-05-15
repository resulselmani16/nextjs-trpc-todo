import { initTRPC, TRPCError } from "@trpc/server";
import { prisma } from "./db";
import { auth } from "@/lib/firebase-admin";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";

const t = initTRPC.context<CreateNextContextOptions>().create();

const isAuthed = t.middleware(async ({ next, ctx }) => {
  const token = ctx.req?.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to perform this action",
    });
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decodedToken.uid },
    });

    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not found",
      });
    }

    return next({
      ctx: {
        user,
        prisma,
      },
    });
  } catch (error) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid token",
    });
  }
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
export const createTRPCRouter = t.router;

export type TRPCContext = {
  user?: {
    id: string;
    email: string;
    name: string | null;
    role: "ADMIN" | "USER";
  };
  prisma: typeof prisma;
};
