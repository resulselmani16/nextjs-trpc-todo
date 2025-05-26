import { taskRouter } from "./task";
import { userRouter } from "./user";
import { createTRPCRouter } from "../trpc";

export const appRouter = createTRPCRouter({
  task: taskRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
