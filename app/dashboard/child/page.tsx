"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/auth-context";
import * as FirestoreService from "@/lib/services/firestore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import Link from "next/link";
import { UserProfile } from "@/lib/types";

export default function ChildDashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push("/auth/signin");
      return;
    }

    const fetchProfile = async () => {
      try {
        const userProfile = await FirestoreService.getUserProfile(user.uid);
        if (!userProfile || userProfile.accountType !== "child") {
          throw new Error("Invalid account type");
        }
        setProfile(userProfile);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center text-red-600">
          {error || "Profile not found"}
        </div>
      </div>
    );
  }

  // Sample data for charts - replace with real data
  const weeklyProgress = [
    { name: "Mon", points: 20 },
    { name: "Tue", points: 35 },
    { name: "Wed", points: 45 },
    { name: "Thu", points: 30 },
    { name: "Fri", points: 50 },
    { name: "Sat", points: 40 },
    { name: "Sun", points: 25 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {profile.displayName}!
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Keep learning and earning points!
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Total Points
            </h3>
            <p className="text-3xl font-bold text-primary">{profile.points}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Courses Completed
            </h3>
            <p className="text-3xl font-bold text-primary">
              {profile.completedCourses.length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Challenges Completed
            </h3>
            <p className="text-3xl font-bold text-primary">
              {profile.completedChallenges.length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Badges Earned
            </h3>
            <p className="text-3xl font-bold text-primary">
              {profile.badges.length}
            </p>
          </div>
        </div>

        {/* Progress Chart */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Weekly Progress
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="points"
                    stroke="#4F46E5"
                    name="Points"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Available Activities */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Available Activities
            </h3>
            <div className="space-y-4">
              <Link
                href="/courses"
                className="block p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Start a New Course
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Learn new skills and earn points
                </p>
              </Link>
              <Link
                href="/challenges"
                className="block p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Take a Challenge
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Test your skills and win badges
                </p>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Achievements
            </h3>
            <div className="space-y-4">
              {/* Replace with actual achievements data */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary text-xl">🏆</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Course Completed
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Finished Python Basics
                  </p>
                </div>
                <div className="ml-auto">
                  <span className="text-primary">+50 points</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
