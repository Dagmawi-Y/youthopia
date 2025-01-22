"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as FirestoreService from "@/lib/services/firestore";
import { Challenge } from "@/lib/types";
import { AdminRoute } from "../../../../../components/auth/admin-route";
import { Timestamp } from "firebase/firestore";

export default function CreateChallenge() {
  return (
    <AdminRoute>
      <CreateChallengeContent />
    </AdminRoute>
  );
}

function CreateChallengeContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [challengeData, setChallengeData] = useState<
    Omit<
      Challenge,
      "id" | "createdAt" | "updatedAt" | "participants" | "winners"
    >
  >({
    title: "",
    description: "",
    imageURL: "",
    difficulty: "beginner",
    points: 0,
    deadline: undefined,
    submissions: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await FirestoreService.createChallenge(challengeData);
      router.push("/dashboard/admin/challenges");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create challenge"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Create New Challenge
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Fill in the details below to create a new challenge.
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
            disabled={loading}
            className="px-6 py-3 rounded-lg bg-[#7BD3EA] hover:bg-[#7BD3EA]/90 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Challenge"}
          </button>
        </div>
      </form>
    </div>
  );
}
