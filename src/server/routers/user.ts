import prisma from "../../../prisma.config";
import { protectedProcedure, router } from "../trpc";
import { z } from "zod";
import { Role } from "@prisma/client";

export const userRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    // Only admins can see all users
    if (ctx.user?.role !== "ADMIN") {
      throw new Error("Only admins can view all users");
    }
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
  }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      // Users can only see their own profile, admins can see any profile
      if (ctx.user?.role !== "ADMIN" && ctx.user?.id !== input) {
        throw new Error("You don't have permission to view this user");
      }
      return prisma.user.findUnique({ where: { id: input } });
    }),

  create: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        email: z.string().email(),
        name: z.string(),
        role: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return prisma.user.create({
        data: {
          id: input.id,
          email: input.email,
          name: input.name,
          role: input.role as Role,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        email: z.string().email(),
        name: z.string(),
        role: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Only admins can update users
      if (ctx.user?.role !== "ADMIN") {
        throw new Error("Only admins can update users");
      }
      return prisma.user.update({
        where: { id: input.id },
        data: {
          email: input.email,
          name: input.name,
          role: input.role as Role,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      // Only admins can delete users
      if (ctx.user?.role !== "ADMIN") {
        throw new Error("Only admins can delete users");
      }
      return prisma.user.delete({ where: { id: input } });
    }),
});
