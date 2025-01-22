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
          router.push("/");
          return;
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        router.push("/");
        return;
      }

      setLoading(false);
    };

    checkAdmin();
  }, [user, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
