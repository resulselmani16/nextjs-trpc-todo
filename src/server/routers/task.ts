import { z } from "zod";
import { prisma } from "../db";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import type { TRPCContext } from "../trpc";
import { TRPCError } from "@trpc/server";

export const taskRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }: { ctx: TRPCContext }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to perform this action",
      });
    }

    if (ctx.user.role === "ADMIN") {
      // Admin: fetch all tasks
      return prisma.task.findMany({
        include: {
          assignedTo: true,
        },
      });
    }

    // Non-admin: fetch only tasks assigned to this user
    return prisma.task.findMany({
      where: {
        userId: ctx.user.id,
      },
      include: {
        assignedTo: true,
      },
    });
  }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }: { ctx: TRPCContext; input: string }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to perform this action",
        });
      }

      const tasks = await prisma.task.findMany({
        where: { userId: input },
        include: {
          assignedTo: true,
        },
      });

      if (ctx.user.role !== "ADMIN" && tasks[0]?.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to access this task",
        });
      }

      return tasks;
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        status: z.enum(["PROGRESS", "COMPLETED", "ASSIGNED"]).optional(),
        userId: z.string(),
      })
    )
    .mutation(
      async ({
        ctx,
        input,
      }: {
        ctx: TRPCContext;
        input: {
          title: string;
          description?: string;
          status?: "PROGRESS" | "COMPLETED" | "ASSIGNED";
          userId: string;
        };
      }) => {
        if (!ctx.user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to perform this action",
          });
        }

        if (ctx.user.role !== "ADMIN") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only admins can create tasks",
          });
        }

        return prisma.task.create({
          data: {
            title: input.title,
            description: input.description,
            status: input.status || "ASSIGNED",
            userId: input.userId,
          },
          include: {
            assignedTo: true,
          },
        });
      }
    ),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(["PROGRESS", "COMPLETED", "ASSIGNED"]).optional(),
        userId: z.string().optional(),
      })
    )
    .mutation(
      async ({
        ctx,
        input,
      }: {
        ctx: TRPCContext;
        input: {
          id: string;
          title?: string;
          description?: string;
          status?: "PROGRESS" | "COMPLETED" | "ASSIGNED";
          userId?: string;
        };
      }) => {
        const { id, ...data } = input;

        const task = await prisma.task.findUnique({
          where: { id },
        });

        if (!task) {
          throw new Error("Task not found");
        }

        if (ctx.user?.role !== "ADMIN") {
          if (task.userId !== ctx.user?.id) {
            throw new Error("You don't have permission to update this task");
          }

          if (Object.keys(data).length > 1 || !data.status) {
            throw new Error("You can only update the task status");
          }
        }

        return prisma.task.update({
          where: { id },
          data,
          include: {
            assignedTo: true,
          },
        });
      }
    ),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(
      async ({ ctx, input }: { ctx: TRPCContext; input: { id: string } }) => {
        if (ctx.user?.role !== "ADMIN") {
          throw new Error("Only admins can delete tasks");
        }

        const task = await prisma.task.findUnique({
          where: { id: input.id },
        });

        if (!task) {
          throw new Error("Task not found");
        }

        return prisma.task.delete({
          where: { id: input.id },
        });
      }
    ),
});
