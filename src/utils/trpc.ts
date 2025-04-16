import { TaskRouter } from "@/server";
import { httpLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
export const trpc = createTRPCNext<TaskRouter>({
  config(opts) {
    const isBrowser = typeof window !== "undefined";
    const url = isBrowser
      ? `${window.location.origin}/api/trpc`
      : "http://localhost:3000/api/trpc";

    return {
      links: [
        httpLink({
          url: url,
        }),
      ],
    };
  },
  ssr: false,
});
