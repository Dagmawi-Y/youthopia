"use client";

import { useState } from "react";
import { MOCK_POSTS } from "@/lib/constants";
import { ContentCard } from "@/components/shared/content-card";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { cn } from "@/lib/utils";

const FEED_TABS = [
  { id: "all", label: "All" },
  { id: "my-feed", label: "My Feed" },
  { id: "community", label: "Community" },
  { id: "whats-new", label: "What's New" },
];

function ActivityContent() {
  const [activeTab, setActiveTab] = useState("all");
  const [posts] = useState(MOCK_POSTS);

  return (
    <div className="max-w-xl mx-auto px-4 py-4">
      {/* Create Post Button */}
      <div className="mb-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-700">
          <Button className="w-full bg-[#7BD3EA] hover:bg-[#A1EEBD] text-black dark:text-white rounded-full flex items-center justify-center space-x-2 h-9">
            <Camera className="h-4 w-4" />
            <span className="text-sm">Create a post</span>
          </Button>
        </div>
      </div>

      {/* Feed Tabs */}
      <div className="mb-4 flex space-x-1 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
        {FEED_TABS.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            size="sm"
            className={cn(
              "flex-1 text-sm",
              activeTab === tab.id
                ? "text-[#7BD3EA] bg-[#7BD3EA]/10"
                : "text-gray-600 dark:text-gray-300 hover:text-[#A1EEBD] hover:bg-[#A1EEBD]/10"
            )}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Content Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <ContentCard
            key={post.id}
            id={post.id}
            username={post.username}
            imageUrl={post.imageUrl}
            content={post.caption}
            likes={post.likes}
            commentCount={post.comments}
            timestamp="1d ago"
          />
        ))}
      </div>
    </div>
  );
}

export default function ActivityPage() {
  return (
    <ProtectedRoute>
      <ActivityContent />
    </ProtectedRoute>
  );
}
