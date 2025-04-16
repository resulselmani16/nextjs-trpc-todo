import { taskRouter } from "@/server";
import { createNextApiHandler } from "@trpc/server/adapters/next";

export default createNextApiHandler({
  router: taskRouter,
  createContext: () => ({}),
});
