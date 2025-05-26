import { router } from "../trpc";
import { userRouter } from "./user";
import { taskRouter } from "./task";

export const appRouter = router({
  user: userRouter,
  task: taskRouter,
});

export type AppRouter = typeof appRouter;
