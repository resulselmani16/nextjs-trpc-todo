import { appRouter } from "@/server/routers/_app";
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { prisma } from "@/server/db";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { auth } from "@/lib/firebase-admin";
import { TRPCError } from "@trpc/server";

export default createNextApiHandler({
  router: appRouter,
  createContext: async ({ req, res }: CreateNextContextOptions) => {
    const authHeader = req.headers.authorization;
    console.log("Auth header:", authHeader ? "Exists" : "Not found");

    const token = authHeader?.split(" ")[1];
    console.log("Token extracted:", token ? "Exists" : "Not found");

    if (!token) {
      console.log("No token provided, returning basic context");
      return { req, res, prisma };
    }

    try {
      console.log("Starting token verification...");
      const decodedToken = await auth.verifyIdToken(token);
      console.log("Token verified successfully, UID:", decodedToken.uid);

      // Try to find the user
      let user = await prisma.user.findUnique({
        where: { id: decodedToken.uid },
      });
      console.log("User found in database:", user ? "Yes" : "No");

      // If user doesn't exist, create them
      if (!user) {
        console.log("Creating new user...");
        const firebaseUser = await auth.getUser(decodedToken.uid);
        console.log("Firebase user details:", {
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        });

        user = await prisma.user.create({
          data: {
            id: decodedToken.uid,
            email: firebaseUser.email || "",
            name: firebaseUser.displayName || firebaseUser.email || "",
            role: "USER",
          },
        });
        console.log("New user created:", user);
      }

      return {
        req,
        res,
        user,
        prisma,
      };
    } catch (error) {
      console.error("Error in token verification:", error);
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid token",
      });
    }
  },
});
