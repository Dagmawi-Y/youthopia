"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/auth-context";
import * as FirestoreService from "@/lib/services/firestore";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        router.push("/auth/signin");
        return;
      }

      try {
        const profile = await FirestoreService.getUserProfile(user.uid);
        if (!profile || profile.role !== "admin") {
          console.log("Not an admin, redirecting. Profile:", profile);
          if (profile?.accountType === "parent") {
            router.push("/dashboard/parent");
          } else if (profile?.accountType === "child") {
            router.push("/dashboard/child");
          } else {
            router.push("/");
          }
          return;
        }
        setLoading(false);
      } catch (error) {
        console.error("Error checking admin status:", error);
        router.push("/");
        return;
      }
    };

    checkAdmin();
  }, [user, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-lg">Verifying admin access...</div>
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
