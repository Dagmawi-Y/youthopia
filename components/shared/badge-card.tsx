"use client";

import { Badge } from "@/lib/types";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BadgeCardProps {
  badge: Badge;
  isLocked?: boolean;
  progress?: number;
  className?: string;
}

export function BadgeCard({
  badge,
  isLocked = false,
  progress,
  className,
}: BadgeCardProps) {
  return (
    <Card className={cn("p-4 relative overflow-hidden group", className)}>
      {/* Badge Image */}
      <div className="relative w-24 h-24 mx-auto mb-3">
        <Image
          src={badge.imageURL}
          alt={badge.name}
          width={100}
          height={100}
          className={cn(
            "transition-all duration-300",
            isLocked && "filter grayscale opacity-50"
          )}
        />
      </div>

      {/* Badge Info */}
      <div className="text-center">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
          {badge.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {badge.description}
        </p>
      </div>

      {/* Progress Bar */}
      {typeof progress === "number" && (
        <div className="mt-3">
          <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${Math.min(100, Math.max(0, progress))}%`,
                backgroundColor: badge.color,
              }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
            {Math.round(progress)}% Complete
          </p>
        </div>
      )}

      {/* Points Required */}
      {isLocked && (
        <div className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
          {badge.criteria.threshold} points required
        </div>
      )}

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </Card>
  );
}
