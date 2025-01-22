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
import Link from "next/link";
import { UserProfile, Course, Challenge } from "@/lib/types";
import { AdminRoute } from "../../../components/auth/admin-route";

export default function AdminDashboard() {
  return (
    <AdminRoute>
      <AdminDashboardContent />
    </AdminRoute>
  );
}

function AdminDashboardContent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalChallenges: 0,
    totalPosts: 0,
    userTypes: { parent: 0, child: 0 },
  });
  const [recentCourses, setRecentCourses] = useState<Course[]>([]);
  const [recentChallenges, setChallenges] = useState<Challenge[]>([]);

  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push("/auth/signin");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        // Fetch platform statistics
        const users = await FirestoreService.getAllUsers();
        const courses = await FirestoreService.getAllCourses();
        const challenges = await FirestoreService.getAllChallenges();
        const posts = await FirestoreService.getAllPosts();

        setStats({
          totalUsers: users.length,
          totalCourses: courses.length,
          totalChallenges: challenges.length,
          totalPosts: posts.length,
          userTypes: users.reduce(
            (acc, user) => {
              if (
                user.accountType === "parent" ||
                user.accountType === "child"
              ) {
                acc[user.accountType]++;
              }
              return acc;
            },
            { parent: 0, child: 0 }
          ),
        });

        // Get recent courses and challenges
        setRecentCourses(courses.slice(0, 5));
        setChallenges(challenges.slice(0, 5));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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

  const userDistributionData = [
    { name: "Parents", value: stats.userTypes.parent },
    { name: "Children", value: stats.userTypes.child },
  ];

  const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EC4899"];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage and monitor platform activity
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Total Users
            </h3>
            <p className="text-3xl font-bold text-primary">
              {stats.totalUsers}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Total Courses
            </h3>
            <p className="text-3xl font-bold text-primary">
              {stats.totalCourses}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Total Challenges
            </h3>
            <p className="text-3xl font-bold text-primary">
              {stats.totalChallenges}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Total Posts
            </h3>
            <p className="text-3xl font-bold text-primary">
              {stats.totalPosts}
            </p>
          </div>
        </div>

        {/* Charts and Management */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
          {/* User Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              User Distribution
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userDistributionData}
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
                    {userDistributionData.map((entry, index) => (
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

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-4">
              <Link
                href="/dashboard/admin/courses/create"
                className="block p-4 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
              >
                <h4 className="font-medium text-primary">Create New Course</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Add a new learning course to the platform
                </p>
              </Link>
              <Link
                href="/dashboard/admin/challenges/create"
                className="block p-4 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
              >
                <h4 className="font-medium text-primary">
                  Create New Challenge
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Create a new challenge for students
                </p>
              </Link>
              <Link
                href="/dashboard/admin/users"
                className="block p-4 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
              >
                <h4 className="font-medium text-primary">Manage Users</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  View and manage user accounts
                </p>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Courses */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Courses
                </h3>
                <Link
                  href="/dashboard/admin/courses"
                  className="text-primary hover:text-primary/80"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {recentCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {course.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {course.level} • {course.points} points
                      </p>
                    </div>
                    <Link
                      href={`/dashboard/admin/courses/${course.id}`}
                      className="text-primary hover:text-primary/80"
                    >
                      Edit
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Challenges */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Challenges
                </h3>
                <Link
                  href="/dashboard/admin/challenges"
                  className="text-primary hover:text-primary/80"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {recentChallenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {challenge.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {challenge.difficulty} • {challenge.points} points
                      </p>
                    </div>
                    <Link
                      href={`/dashboard/admin/challenges/${challenge.id}`}
                      className="text-primary hover:text-primary/80"
                    >
                      Edit
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
