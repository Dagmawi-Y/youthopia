"use client";

import { useState, useEffect } from "react";
import { CategoryFilters } from "@/components/shared/category-filters";
import {
  Sparkles,
  Users,
  Palette,
  Code,
  Brain,
  Mic2,
  Gamepad2,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import * as FirestoreService from "@/lib/services/firestore";
import type { Challenge } from "@/lib/types";
import { getDaysLeft } from "@/lib/types";

const CATEGORIES = [
  { id: "featured", label: "Featured", icon: Sparkles },
  { id: "all", label: "All", icon: Users },
  { id: "community", label: "Community", icon: Users },
  { id: "art", label: "Art & Craft", icon: Palette },
  { id: "stem", label: "STEM", icon: Code },
  { id: "life-skills", label: "Life Skills", icon: Brain },
  { id: "performing-arts", label: "Performing Arts", icon: Mic2 },
  { id: "gaming", label: "Gaming", icon: Gamepad2 },
];

function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const daysLeft = getDaysLeft(challenge.deadline);

  return (
    <div className="group relative bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="relative aspect-[4/3]">
        <Image
          src={challenge.imageURL || "/placeholder-challenge.jpg"}
          alt={challenge.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-lg font-semibold text-white">
            {challenge.title}
          </h3>
          <p className="mt-1 text-sm text-white/80">{challenge.description}</p>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">
              {challenge.participants?.length || 0} participants
            </span>
          </div>
          <span className="text-sm font-medium text-[#7BD3EA]">
            {daysLeft} days left
          </span>
        </div>
        <Button className="mt-4 w-full bg-[#7BD3EA] hover:bg-[#A1EEBD] text-black rounded-full">
          Join Challenge
        </Button>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <Sparkles className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">No Challenges Yet</h3>
      <p className="mt-1 text-sm text-gray-500">
        Check back soon for new challenges!
      </p>
    </div>
  );
}

export default function ChallengesPage() {
  const [selectedCategory, setSelectedCategory] = useState("featured");
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const data = await FirestoreService.getAllChallenges();
        setChallenges(data);
      } catch (err) {
        console.error("Error fetching challenges:", err);
        setError("Failed to load challenges");
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search Challenges or Skills"
            className="w-full px-4 py-3 rounded-full bg-white border-none focus:ring-2 focus:ring-[#7BD3EA] text-sm shadow-sm"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-[#7BD3EA]">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Category Filters */}
      <div className="mb-8">
        <CategoryFilters
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {/* Challenge Grid */}
      {challenges.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {challenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
