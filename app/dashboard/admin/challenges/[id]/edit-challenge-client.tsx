"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as FirestoreService from "@/lib/services/firestore";
import { Challenge } from "@/lib/types";
import { AdminRoute } from "../../../../../components/auth/admin-route";
import { Timestamp } from "firebase/firestore";

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

  if (!challengeData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Challenge not found</div>
      </div>
    );
  }

  return (
    <AdminRoute>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Edit Challenge: {challengeData.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Update the challenge details below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Basic Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Basic Information
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Challenge Title
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
                    className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-[#7BD3EA] focus:ring-2 focus:ring-[#7BD3EA] transition-colors"
                    placeholder="Enter challenge title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Challenge Description
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
                    className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-[#7BD3EA] focus:ring-2 focus:ring-[#7BD3EA] transition-colors"
                    placeholder="Describe the challenge objectives and requirements"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Challenge Image URL
                  </label>
                  <input
                    type="url"
                    value={challengeData.imageURL}
                    onChange={(e) =>
                      setChallengeData({
                        ...challengeData,
                        imageURL: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-[#7BD3EA] focus:ring-2 focus:ring-[#7BD3EA] transition-colors"
                    placeholder="Enter image URL (optional)"
                  />
                  {challengeData.imageURL && (
                    <div className="mt-4 rounded-lg overflow-hidden w-48 h-32 bg-gray-100 dark:bg-gray-700">
                      <img
                        src={challengeData.imageURL}
                        alt="Challenge preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                        onLoad={(e) => {
                          (e.target as HTMLImageElement).style.display =
                            "block";
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Challenge Details */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Challenge Details
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    value={challengeData.difficulty}
                    onChange={(e) =>
                      setChallengeData({
                        ...challengeData,
                        difficulty: e.target.value as Challenge["difficulty"],
                      })
                    }
                    className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-[#7BD3EA] focus:ring-2 focus:ring-[#7BD3EA] transition-colors"
                    required
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Points Reward
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
                    className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-[#7BD3EA] focus:ring-2 focus:ring-[#7BD3EA] transition-colors"
                    placeholder="Enter points value"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Submission Deadline
                  </label>
                  <input
                    type="datetime-local"
                    value={
                      challengeData.deadline instanceof Timestamp
                        ? challengeData.deadline
                            .toDate()
                            .toISOString()
                            .slice(0, 16)
                        : ""
                    }
                    onChange={(e) =>
                      setChallengeData({
                        ...challengeData,
                        deadline: e.target.value
                          ? Timestamp.fromDate(new Date(e.target.value))
                          : undefined,
                      })
                    }
                    className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-[#7BD3EA] focus:ring-2 focus:ring-[#7BD3EA] transition-colors"
                    placeholder="Select deadline (optional)"
                  />
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg text-sm mt-4">
              Error: {error}
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push("/dashboard/admin/challenges")}
              className="px-6 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-lg bg-[#7BD3EA] hover:bg-[#7BD3EA]/90 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </AdminRoute>
  );
}
