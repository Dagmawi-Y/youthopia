"use client";

import {
  Badge,
  BADGES,
  getUserBadges,
  getNextBadge,
  getProgressToNextBadge,
} from "@/lib/types";
import { BadgeCard } from "./badge-card";

interface BadgesSectionProps {
  points: number;
}

export function BadgesSection({ points }: BadgesSectionProps) {
  const earnedBadges = getUserBadges(points);
  const nextBadge = getNextBadge(points);
  const progress = getProgressToNextBadge(points);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Badges
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Collect badges by earning points through challenges and courses
        </p>
      </div>

      {/* Current Progress */}
      {nextBadge && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Next Badge: {nextBadge.name}
          </h3>
          <BadgeCard
            badge={nextBadge}
            isLocked
            progress={progress}
            className="border-none shadow-none"
          />
        </div>
      )}

      {/* All Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {BADGES.map((badge) => {
          const isEarned = earnedBadges.some(
            (earned) => earned.id === badge.id
          );
          return (
            <BadgeCard
              key={badge.id}
              badge={badge}
              isLocked={!isEarned}
              className="h-full"
            />
          );
        })}
      </div>
    </div>
  );
}
