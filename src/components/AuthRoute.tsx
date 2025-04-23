import { ReactNode } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface AuthRouteProps {
  children: ReactNode;
}

export function AuthRoute({ children }: AuthRouteProps) {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
