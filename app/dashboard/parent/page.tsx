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

export default function ParentDashboard() {
  const [children, setChildren] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push("/auth/signin");
      return;
    }

    const fetchChildren = async () => {
      try {
        const childAccounts = await FirestoreService.getChildAccounts(user.uid);
        setChildren(childAccounts);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch children"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, [user, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  // Sample data for charts - replace with real data from your backend
  const activityData = [
    { name: "Mon", courses: 4, challenges: 2 },
    { name: "Tue", courses: 3, challenges: 1 },
    { name: "Wed", courses: 5, challenges: 3 },
    { name: "Thu", courses: 2, challenges: 4 },
    { name: "Fri", courses: 6, challenges: 2 },
    { name: "Sat", courses: 4, challenges: 1 },
    { name: "Sun", courses: 3, challenges: 2 },
  ];

  const progressData = [
    { name: "Week 1", points: 120 },
    { name: "Week 2", points: 250 },
    { name: "Week 3", points: 380 },
    { name: "Week 4", points: 470 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Parent Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Monitor and manage your children's activities
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Total Children
            </h3>
            <p className="text-3xl font-bold text-primary">{children.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Total Activities
            </h3>
            <p className="text-3xl font-bold text-primary">
              {children.reduce(
                (acc, child) =>
                  acc +
                  child.completedCourses.length +
                  child.completedChallenges.length,
                0
              )}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Total Points
            </h3>
            <p className="text-3xl font-bold text-primary">
              {children.reduce((acc, child) => acc + child.points, 0)}
            </p>
          </div>
        </div>

        {/* Activity Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Weekly Activity
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="courses" fill="#4F46E5" name="Courses" />
                  <Bar dataKey="challenges" fill="#10B981" name="Challenges" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Points Progress
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
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
        </div>

        {/* Children List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Children Accounts
              </h3>
              <Link
                href="/profile/create-child"
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
              >
                Add Child
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Points
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Courses
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Challenges
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {children.map((child) => (
                    <tr key={child.uid}>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                        {child.displayName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                        {child.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                        {child.points}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                        {child.completedCourses.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                        {child.completedChallenges.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/dashboard/parent/child/${child.uid}`}
                          className="text-primary hover:text-primary/80"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
