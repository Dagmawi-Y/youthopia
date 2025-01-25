"use client";

import { useState, useEffect } from "react";
import { CategoryFilters } from "@/components/shared/category-filters";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import * as FirestoreService from "@/lib/services/firestore";
import type { Challenge } from "@/lib/types";
import { getDaysLeft } from "@/lib/types";

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
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No challenges found
      </h3>
      <p className="text-gray-500">Try adjusting your filters</p>
    </div>
  );
}

export default function ChallengesPage() {
  const [selectedCategory, setSelectedCategory] = useState("featured");
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topics, setTopics] = useState<
    Array<{
      id: string;
      name: string;
      description: string;
      createdAt: Date;
      updatedAt: Date;
    }>
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedChallenges, fetchedTopics] = await Promise.all([
          FirestoreService.getAllChallenges(),
          FirestoreService.getAllTopics(),
        ]);
        setChallenges(fetchedChallenges);
        setTopics(
          fetchedTopics as Array<{
            id: string;
            name: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
          }>
        );
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load challenges");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredChallenges = challenges.filter((challenge) => {
    if (selectedCategory === "featured") return true;
    return challenge.topics?.includes(selectedCategory);
  });

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

  const categories = [
    { id: "featured", label: "Featured", icon: Sparkles },
    ...topics.map((topic) => ({
      id: topic.name,
      label: topic.name,
      description: topic.description,
    })),
  ];

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
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {/* Challenge Grid */}
      {filteredChallenges.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredChallenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
