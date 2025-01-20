"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/auth-context";
import * as FirestoreService from "@/lib/services/firestore";

export function ParentRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);

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
            router.replace("/dashboard/child");
            return;
          }
          setIsVerifying(false);
        } catch (error) {
          console.error("Error checking user type:", error);
          router.replace("/dashboard/child");
        }
      }
    };

    checkAccess();
  }, [router, user, loading]);

  if (loading || !user || isVerifying) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
