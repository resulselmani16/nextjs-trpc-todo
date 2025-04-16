import { z } from "zod";
import prisma from "../../prisma";
import { router } from "@/server/trpc";
import { publicProcedure } from "@/server/trpc";

export const taskRouter = router({
  getAll: publicProcedure.query(async () => {
    return await prisma.task.findMany();
  }),
  getById: publicProcedure.input(z.string()).query(async ({ input }) => {
    return await prisma.task.findUnique({ where: { id: input } });
  }),
  create: publicProcedure
    .input(
      z.object({
        title: z.string().nonempty(),
        description: z.string().nonempty(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.task.create({ data: input });
    }),
  update: publicProcedure
    .input(z.object({ id: z.string().nonempty(), completed: z.boolean() }))
    .mutation(async ({ input }) => {
      return await prisma.task.update({
        where: { id: input.id },
        data: { completed: input.completed },
      });
    }),
  delete: publicProcedure.input(z.string()).mutation(async ({ input }) => {
    return await prisma.task.delete({ where: { id: input } });
  }),
});

export type TaskRouter = typeof taskRouter;
