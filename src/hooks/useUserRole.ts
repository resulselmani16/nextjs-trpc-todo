import { useState, useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";

export type UserRole = "admin" | "user";

export function useUserRole() {
  const { user } = useAuthContext();
  const [role, setRole] = useState<UserRole>("user");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUserRole() {
      if (!user?.email) {
        setRole("user");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/auth/isAdmin?email=${encodeURIComponent(user.email)}`
        );
        const data = await response.json();

        if (response.ok) {
          setRole(data.isAdmin ? "admin" : "user");
        } else {
          console.error("Error checking admin status:", data.error);
          setRole("user");
        }
      } catch (error) {
        console.error("Error checking user role:", error);
        setRole("user");
      } finally {
        setLoading(false);
      }
    }

    checkUserRole();
  }, [user]);

  return {
    role,
    loading,
    isAdmin: role === "admin",
  };
}
