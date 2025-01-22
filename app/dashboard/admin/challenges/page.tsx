"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import * as FirestoreService from "@/lib/services/firestore";
import { Challenge } from "@/lib/types";
import { AdminRoute } from "../../../../components/auth/admin-route";

export default function ChallengesManagement() {
  return (
    <AdminRoute>
      <ChallengesManagementContent />
    </AdminRoute>
  );
}

function ChallengesManagementContent() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const challengesData = await FirestoreService.getAllChallenges();
        setChallenges(challengesData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch challenges"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  const handleDeleteChallenge = async (challengeId: string) => {
    if (!window.confirm("Are you sure you want to delete this challenge?")) {
      return;
    }

    try {
      await FirestoreService.deleteChallenge(challengeId);
      setChallenges(
        challenges.filter((challenge) => challenge.id !== challengeId)
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete challenge"
      );
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Challenge Management
        </h1>
        <Link
          href="/dashboard/admin/challenges/create"
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors"
        >
          Create New Challenge
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Difficulty
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Points
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Participants
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Winners
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Deadline
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {challenges.map((challenge) => (
              <tr key={challenge.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {challenge.imageURL && (
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={challenge.imageURL}
                          alt={challenge.title}
                        />
                      </div>
                    )}
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {challenge.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {challenge.description.substring(0, 50)}...
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      challenge.difficulty === "beginner"
                        ? "bg-green-100 text-green-800"
                        : challenge.difficulty === "intermediate"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {challenge.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {challenge.points}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {challenge.participants.length}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {challenge.winners.length}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {challenge.deadline
                    ? challenge.deadline.toDate().toLocaleDateString()
                    : "No deadline"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    href={`/dashboard/admin/challenges/${challenge.id}`}
                    className="text-primary hover:text-primary/80 mr-4"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteChallenge(challenge.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
