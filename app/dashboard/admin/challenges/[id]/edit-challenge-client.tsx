"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as FirestoreService from "@/lib/services/firestore";
import { Challenge } from "@/lib/types";
import { AdminRoute } from "../../../../../components/auth/admin-route";
import Image from "next/image";
import { Timestamp } from "firebase/firestore";

function LoadingState() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>
  );
}

export function EditChallengeClient({ challengeId }: { challengeId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [challengeData, setChallengeData] = useState<Challenge | null>(null);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const challenge = await FirestoreService.getChallenge(challengeId);
        if (!challenge) {
          setError("Challenge not found");
          return;
        }
        setChallengeData(challenge);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch challenge"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [challengeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!challengeData) return;

    setSaving(true);
    setError(null);

    try {
      await FirestoreService.updateChallenge(challengeId, challengeData);
      router.push("/dashboard/admin/challenges");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update challenge"
      );
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  if (!challengeData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Challenge not found</div>
      </div>
    );
  }

  return (
    <AdminRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit Challenge: {challengeData.title}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Title
                  </label>
                  <input
                    type="text"
                    value={challengeData.title}
                    onChange={(e) =>
                      setChallengeData({
                        ...challengeData,
                        title: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    value={challengeData.description}
                    onChange={(e) =>
                      setChallengeData({
                        ...challengeData,
                        description: e.target.value,
                      })
                    }
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={challengeData.imageURL || ""}
                    onChange={(e) =>
                      setChallengeData({
                        ...challengeData,
                        imageURL: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>
              </div>

              {/* Challenge Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Difficulty
                  </label>
                  <select
                    value={challengeData.difficulty}
                    onChange={(e) =>
                      setChallengeData({
                        ...challengeData,
                        difficulty: e.target.value as Challenge["difficulty"],
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    required
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Points
                  </label>
                  <input
                    type="number"
                    value={challengeData.points}
                    onChange={(e) =>
                      setChallengeData({
                        ...challengeData,
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
                    Deadline
                  </label>
                  <input
                    type="datetime-local"
                    value={
                      challengeData.deadline
                        ? challengeData.deadline
                            .toDate()
                            .toISOString()
                            .slice(0, 16)
                        : ""
                    }
                    onChange={(e) =>
                      setChallengeData({
                        ...challengeData,
                        deadline: Timestamp.fromDate(new Date(e.target.value)),
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm mt-2">Error: {error}</div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push("/dashboard/admin/challenges")}
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
    </AdminRoute>
  );
}
