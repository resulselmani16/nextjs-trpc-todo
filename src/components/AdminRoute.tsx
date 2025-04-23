import { ReactNode } from "react";
import { useUserRole } from "@/hooks/useUserRole";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AdminRouteProps {
  children: ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { isAdmin, loading } = useUserRole();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push("/");
    }
  }, [isAdmin, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
}
