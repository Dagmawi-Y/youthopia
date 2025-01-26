"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/lib/context/auth-context";
import { getUserProfileByUsername } from "@/lib/services/firestore";
import { UserProfile } from "@/lib/types";

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

export default function UserProfilePage({ params }: PageProps) {
  const { username } = use(params);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userProfile = await getUserProfileByUsername(username);
        if (!userProfile) {
          setError("User not found");
          return;
        }
        setProfile(userProfile);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          {error || "User not found"}
        </div>
      </div>
    );
  }

  const isOwnProfile = user?.uid === profile.uid;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="relative w-24 h-24">
                  <Image
                    src={profile.photoURL || "/default-avatar.png"}
                    alt={profile.displayName}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {profile.displayName}
                  </h1>
                  {isOwnProfile && (
                    <p className="text-gray-600 dark:text-gray-400">
                      {profile.email}
                    </p>
                  )}
                </div>
              </div>
              {isOwnProfile && (
                <button
                  onClick={() => router.push("/profile")}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Bio
                </h2>
                <p className="mt-1 text-gray-600 dark:text-gray-400">
                  {profile.bio || "No bio yet"}
                </p>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Stats
                </h2>
                <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div className="px-4 py-5 bg-gray-50 dark:bg-gray-900 shadow rounded-lg overflow-hidden sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Points Earned
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                      {profile.points}
                    </dd>
                  </div>
                  <div className="px-4 py-5 bg-gray-50 dark:bg-gray-900 shadow rounded-lg overflow-hidden sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Courses Completed
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                      {profile.completedCourses.length}
                    </dd>
                  </div>
                  <div className="px-4 py-5 bg-gray-50 dark:bg-gray-900 shadow rounded-lg overflow-hidden sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Challenges Won
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                      {profile.completedChallenges.length}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Badges
                </h2>
                <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {profile.badges.map((badge) => (
                    <div
                      key={badge}
                      className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
                    >
                      <div className="w-16 h-16 relative">
                        <Image
                          src={`/badges/${badge}.png`}
                          alt={badge}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
