"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/auth-context";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/auth/signin?from=${window.location.pathname}`);
    }
  }, [router, user, loading]);

  if (loading || !user) {
    return null;
  }

  return <>{children}</>;
} 