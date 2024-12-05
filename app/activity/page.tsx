"use client";

import { useState } from "react";
import { MOCK_POSTS } from "@/lib/constants";
import { ContentCard } from "@/components/shared/content-card";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/protected-route";

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
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Create Post Button */}
      <div className="mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-[#A1EEBD]/20">
          <Button
            className="w-full bg-[#7BD3EA] hover:bg-[#A1EEBD] text-black dark:text-white rounded-full flex items-center justify-center space-x-2"
          >
            <Camera className="h-5 w-5" />
            <span>Post</span>
          </Button>
        </div>
      </div>

      {/* Feed Tabs */}
      <div className="mb-8 flex space-x-1">
        {FEED_TABS.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            className={
              activeTab === tab.id
                ? "text-[#7BD3EA] bg-[#7BD3EA]/10"
                : "text-gray-600 dark:text-gray-300 hover:text-[#A1EEBD] hover:bg-[#A1EEBD]/10"
            }
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Content Feed */}
      <div className="space-y-8">
        {posts.map((post) => (
          <ContentCard
            key={post.id}
            id={post.id}
            username={post.username}
            imageUrl={post.imageUrl}
            caption={post.caption}
            likes={post.likes}
            comments={post.comments}
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