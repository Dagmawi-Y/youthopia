"use client";

import { useState } from "react";
import { MOCK_CHALLENGES } from "@/lib/constants";
import { CategoryFilters } from "@/components/shared/category-filters";
import { Sparkles, Users, Palette, Code, Brain, Mic2, Gamepad2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

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

function ChallengeCard({ challenge }: { challenge: typeof MOCK_CHALLENGES[0] }) {
  return (
    <div className="group relative bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="relative aspect-[4/3]">
        <Image
          src={challenge.imageUrl}
          alt={challenge.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-lg font-semibold text-white">{challenge.title}</h3>
          <p className="mt-1 text-sm text-white/80">{challenge.description}</p>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">
              {challenge.participants} participants
            </span>
          </div>
          <span className="text-sm font-medium text-[#7BD3EA]">
            {challenge.daysLeft} days left
          </span>
        </div>
        <Button
          className="mt-4 w-full bg-[#7BD3EA] hover:bg-[#A1EEBD] text-black rounded-full"
        >
          Join Challenge
        </Button>
      </div>
    </div>
  );
}

export default function ChallengesPage() {
  const [selectedCategory, setSelectedCategory] = useState("featured");
  const [challenges] = useState(MOCK_CHALLENGES);

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
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {challenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))}
      </div>
    </div>
  );
}