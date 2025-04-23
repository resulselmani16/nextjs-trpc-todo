import { router } from "../trpc";
import { userRouter } from "./user";
import { taskRouter } from "../index";

export const appRouter = router({
  user: userRouter,
  task: taskRouter,
});

export type AppRouter = typeof appRouter;
