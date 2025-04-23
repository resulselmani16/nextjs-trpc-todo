import { AppRouter } from "@/server/routers/_app";
import { httpLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";

export const trpc = createTRPCNext<AppRouter>({
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
