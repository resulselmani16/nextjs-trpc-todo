import prisma from "../../../prisma";
import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import { Role } from "@prisma/client";
export const userRouter = router({
  getAll: publicProcedure.query(async () => {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
  }),
  getById: publicProcedure.input(z.string()).query(async ({ input }) => {
    return prisma.user.findUnique({ where: { id: input } });
  }),
  create: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string(),
        role: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return prisma.user.create({
        data: {
          email: input.email,
          name: input.name,
          role: input.role as Role,
        },
      });
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        email: z.string().email(),
        name: z.string(),
        role: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return prisma.user.update({
        where: { id: input.id },
        data: {
          email: input.email,
          name: input.name,
          role: input.role as Role,
        },
      });
    }),
  delete: publicProcedure.input(z.string()).mutation(async ({ input }) => {
    return prisma.user.delete({ where: { id: input } });
  }),
});
