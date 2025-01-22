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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Create New Challenge
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
                  Image URL (optional)
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
                  Deadline (optional)
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
            disabled={loading}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Challenge"}
          </button>
        </div>
      </form>
    </div>
  );
}
