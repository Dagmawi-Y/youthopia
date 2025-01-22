"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as FirestoreService from "@/lib/services/firestore";
import { UserProfile, Badge } from "@/lib/types";
import { AdminRoute } from "../../../../../components/auth/admin-route";
import Link from "next/link";

export default function EditUser({ params }: { params: { id: string } }) {
  return (
    <AdminRoute>
      <EditUserContent userId={params.id} />
    </AdminRoute>
  );
}

function EditUserContent({ userId }: { userId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [availableBadges, setAvailableBadges] = useState<Badge[]>([]);
  const [selectedBadge, setSelectedBadge] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [users, badges] = await Promise.all([
          FirestoreService.getAllUsers(),
          FirestoreService.getAllBadges(),
        ]);
        const user = users.find((u: UserProfile) => u.uid === userId);
        if (!user) {
          setError("User not found");
          return;
        }
        setUserData(user);
        setAvailableBadges(badges);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;

    setSaving(true);
    setError(null);

    try {
      await FirestoreService.updateUserProfile(userId, userData);
      router.push("/dashboard/admin/users");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
      setSaving(false);
    }
  };

  const handleRemoveChild = async (childId: string) => {
    if (
      !userData ||
      !window.confirm("Are you sure you want to remove this child account?")
    ) {
      return;
    }

    try {
      await FirestoreService.removeChildFromParent(userData.uid, childId);
      setUserData({
        ...userData,
        childAccounts:
          userData.childAccounts?.filter((id) => id !== childId) || [],
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to remove child account"
      );
    }
  };

  const handleAwardBadge = async () => {
    if (!userData || !selectedBadge) return;

    try {
      await FirestoreService.awardBadge(userData.uid, selectedBadge);
      setUserData({
        ...userData,
        badges: [...(userData.badges || []), selectedBadge],
      });
      setSelectedBadge("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to award badge");
    }
  };

  const handleRemoveBadge = async (badgeId: string) => {
    if (!userData) return;

    try {
      await FirestoreService.removeBadge(userData.uid, badgeId);
      setUserData({
        ...userData,
        badges: userData.badges.filter((id) => id !== badgeId),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove badge");
    }
  };

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

  if (!userData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">User not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Edit User: {userData.displayName}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Basic Information Form - Column 1 */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={userData.displayName}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          displayName: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </label>
                    <input
                      type="email"
                      value={userData.email}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-gray-50"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Role
                    </label>
                    <select
                      value={userData.role || "user"}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          role: e.target.value as UserProfile["role"],
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      required
                    >
                      <option value="user">User</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Account Type
                    </label>
                    <select
                      value={userData.accountType}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          accountType: e.target.value as "parent" | "child",
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      required
                    >
                      <option value="parent">Parent</option>
                      <option value="child">Child</option>
                    </select>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Points
                    </label>
                    <input
                      type="number"
                      value={userData.points}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          points: parseInt(e.target.value),
                        })
                      }
                      min="0"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Bio
                    </label>
                    <textarea
                      value={userData.bio || ""}
                      onChange={(e) =>
                        setUserData({ ...userData, bio: e.target.value })
                      }
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                  </div>

                  {userData.accountType === "parent" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Child Accounts
                      </label>
                      <div className="space-y-2">
                        {userData.childAccounts?.map((childId) => (
                          <div
                            key={childId}
                            className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
                          >
                            <span className="text-sm text-gray-900 dark:text-white">
                              {childId}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveChild(childId)}
                              className="text-red-600 hover:text-red-900 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        {(!userData.childAccounts ||
                          userData.childAccounts.length === 0) && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            No child accounts linked
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm mt-2">Error: {error}</div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push("/dashboard/admin/users")}
                className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* Activity & Badges - Column 2 */}
        <div className="space-y-6">
          {/* Badge Management */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Badge Management
            </h2>

            {/* Award Badge */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Award New Badge
              </label>
              <div className="flex space-x-2">
                <select
                  value={selectedBadge}
                  onChange={(e) => setSelectedBadge(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                >
                  <option value="">Select a badge</option>
                  {availableBadges
                    .filter((badge) => !userData?.badges.includes(badge.id))
                    .map((badge) => (
                      <option key={badge.id} value={badge.id}>
                        {badge.name}
                      </option>
                    ))}
                </select>
                <button
                  type="button"
                  onClick={handleAwardBadge}
                  disabled={!selectedBadge}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50"
                >
                  Award
                </button>
              </div>
            </div>

            {/* Current Badges */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Badges
              </h3>
              <div className="space-y-2">
                {userData?.badges.map((badgeId) => {
                  const badge = availableBadges.find((b) => b.id === badgeId);
                  return (
                    <div
                      key={badgeId}
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
                    >
                      <div className="flex items-center space-x-2">
                        <img
                          src={badge?.imageURL}
                          alt={badge?.name}
                          className="w-6 h-6"
                        />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {badge?.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveBadge(badgeId)}
                        className="text-red-600 hover:text-red-900 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
                {(!userData?.badges || userData.badges.length === 0) && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No badges earned yet
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Activity History */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Activity History
            </h2>

            {/* Completed Courses */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Completed Courses
              </h3>
              <div className="space-y-2">
                {userData?.completedCourses.map((courseId) => (
                  <div
                    key={courseId}
                    className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm"
                  >
                    <Link
                      href={`/dashboard/admin/courses/${courseId}`}
                      className="text-primary hover:text-primary/80"
                    >
                      {courseId}
                    </Link>
                  </div>
                ))}
                {(!userData?.completedCourses ||
                  userData.completedCourses.length === 0) && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No courses completed yet
                  </p>
                )}
              </div>
            </div>

            {/* Completed Challenges */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Completed Challenges
              </h3>
              <div className="space-y-2">
                {userData?.completedChallenges.map((challengeId) => (
                  <div
                    key={challengeId}
                    className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm"
                  >
                    <Link
                      href={`/dashboard/admin/challenges/${challengeId}`}
                      className="text-primary hover:text-primary/80"
                    >
                      {challengeId}
                    </Link>
                  </div>
                ))}
                {(!userData?.completedChallenges ||
                  userData.completedChallenges.length === 0) && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No challenges completed yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
