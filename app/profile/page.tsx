"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/auth-context";
import { getUserProfile } from "@/lib/services/firestore";

export default function ProfileRedirect() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const redirect = async () => {
      if (!user) {
        router.push("/auth/signin");
        return;
      }

      try {
        const profile = await getUserProfile(user.uid);
        if (profile?.username) {
          router.push(`/profile/${profile.username}`);
        } else {
          // If no username is set, you might want to redirect to a setup page
          router.push("/auth/setup");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        router.push("/auth/signin");
      }
    };

    redirect();
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">Redirecting...</div>
    </div>
  );
}
