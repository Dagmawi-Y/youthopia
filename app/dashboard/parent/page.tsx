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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Link from "next/link";
import { UserProfile } from "@/lib/types";
import { ParentRoute } from "@/components/auth/parent-route";

export default function ParentDashboard() {
  return (
    <ParentRoute>
      <ParentDashboardContent />
    </ParentRoute>
  );
}

function ParentDashboardContent() {
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

  const COLORS = [
    "#4F46E5",
    "#10B981",
    "#F59E0B",
    "#EC4899",
    "#8B5CF6",
    "#F97316",
  ];

  const learningData = children.map((child) => {
    const totalChallenges = child.completedChallenges.length;
    const successfulChallenges = child.completedChallenges.length;

    return {
      name: child.displayName,
      streak: 0,
      successRate:
        totalChallenges > 0
          ? Math.round((successfulChallenges / totalChallenges) * 100)
          : 0,
      badgeCount: child.badges.length,
      topicsCompleted: child.completedCourses.reduce((acc, courseId) => {
        const topic = "General";
        acc[topic] = (acc[topic] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  });

  // Transform topics data for visualization
  const topicsData = Object.entries(
    learningData.reduce((acc, child) => {
      Object.entries(child.topicsCompleted).forEach(([topic, count]) => {
        acc[topic] = (acc[topic] || 0) + count;
      });
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const recentAchievements = [
    {
      childName: "John",
      achievement: "Completed Python Basics",
      points: 50,
      date: "2024-03-15",
    },
    {
      childName: "Emma",
      achievement: "Solved Math Challenge",
      points: 30,
      date: "2024-03-14",
    },
    {
      childName: "John",
      achievement: "Earned Coding Badge",
      points: 20,
      date: "2024-03-13",
    },
  ];

  const timeDistribution = [
    { name: "Morning", value: 35 },
    { name: "Afternoon", value: 40 },
    { name: "Evening", value: 25 },
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 mb-8">
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Average Points
            </h3>
            <p className="text-3xl font-bold text-primary">
              {children.length > 0
                ? Math.round(
                    children.reduce((acc, child) => acc + child.points, 0) /
                      children.length
                  )
                : 0}
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

        {/* Learning Progress Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Learning Progress Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Topics Distribution */}
            <div>
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                Topics Distribution
              </h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topicsData}
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
                      {topicsData.map((entry, index) => (
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

            {/* Challenge Success Rates */}
            <div>
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                Challenge Success Rates
              </h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={learningData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar
                      dataKey="successRate"
                      fill="#10B981"
                      name="Success Rate (%)"
                      label={{ position: "top" }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Learning Streaks */}
            <div>
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                Learning Streaks (Days)
              </h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={learningData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="streak"
                      fill="#4F46E5"
                      name="Current Streak"
                      label={{ position: "top" }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Badge Progress */}
            <div>
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                Badge Progress
              </h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={learningData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="badgeCount"
                      fill="#F59E0B"
                      name="Badges Earned"
                      label={{ position: "top" }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Achievements
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Child
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Achievement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Points
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentAchievements.map((achievement, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                      {achievement.childName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                      {achievement.achievement}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                      +{achievement.points}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                      {new Date(achievement.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
