"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/auth-context";
import * as FirestoreService from "@/lib/services/firestore";

export function ParentRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    const checkAccess = async () => {
      if (!loading) {
        if (!user) {
          router.push("/auth/signin");
          return;
        }

        try {
          const profile = await FirestoreService.getUserProfile(user.uid);
          if (!profile || profile.accountType !== "parent") {
            router.push("/dashboard/child");
          }
        } catch (error) {
          console.error("Error checking user type:", error);
          router.push("/dashboard/child");
        }
      }
    };

    checkAccess();
  }, [router, user, loading]);

  if (loading || !user) {
    return null;
  }

  return <>{children}</>;
}
