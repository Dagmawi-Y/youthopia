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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { UserProfile } from "@/lib/types";

export default function ChildDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [child, setChild] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push("/auth/signin");
      return;
    }

    const fetchChildProfile = async () => {
      try {
        const profile = await FirestoreService.getUserProfile(params.id);
        if (!profile || profile.parentId !== user.uid) {
          throw new Error("Child profile not found or access denied");
        }
        setChild(profile);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch child profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchChildProfile();
  }, [user, params.id, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error || !child) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center text-red-600">
          {error || "Child not found"}
        </div>
      </div>
    );
  }

  // Sample data for charts - replace with real data
  const activityBreakdown = [
    { name: "Completed Courses", value: child.completedCourses.length },
    { name: "Completed Challenges", value: child.completedChallenges.length },
    { name: "Badges Earned", value: child.badges.length },
  ];

  const COLORS = ["#4F46E5", "#10B981", "#F59E0B"];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="mb-4 text-primary hover:text-primary/80"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {child.displayName}'s Profile
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            View detailed progress and activities
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Total Points
            </h3>
            <p className="text-3xl font-bold text-primary">{child.points}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Courses Completed
            </h3>
            <p className="text-3xl font-bold text-primary">
              {child.completedCourses.length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Challenges Completed
            </h3>
            <p className="text-3xl font-bold text-primary">
              {child.completedChallenges.length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Badges Earned
            </h3>
            <p className="text-3xl font-bold text-primary">
              {child.badges.length}
            </p>
          </div>
        </div>

        {/* Activity Distribution */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Activity Distribution
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activityBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {activityBreakdown.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {/* Replace with actual recent activity data */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Completed Python Basics
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Course Completion
                  </p>
                </div>
                <span className="text-primary">+50 points</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Solved Coding Challenge
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Challenge Completion
                  </p>
                </div>
                <span className="text-primary">+30 points</span>
              </div>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Account Settings
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Username
                </p>
                <p className="mt-1 text-gray-900 dark:text-white">
                  {child.username}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Display Name
                </p>
                <p className="mt-1 text-gray-900 dark:text-white">
                  {child.displayName}
                </p>
              </div>
              <div>
                <button
                  onClick={() =>
                    router.push(`/profile/edit-child/${child.uid}`)
                  }
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
