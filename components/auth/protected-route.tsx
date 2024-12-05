"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/auth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push(`/auth/signin?from=${window.location.pathname}`);
    }
  }, [router]);

  if (!auth.isAuthenticated()) {
    return null;
  }

  return <>{children}</>;
} 