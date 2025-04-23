import { NextApiRequest, NextApiResponse } from "next";
import { isUserAdmin } from "@/lib/firebase/admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.query;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const isAdmin = await isUserAdmin(email);
    return res.status(200).json({ isAdmin });
  } catch (error) {
    console.error("Error checking admin status:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
