"use client";

import { useEffect, useState } from "react";
import { ContentCard } from "@/components/shared/content-card";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { cn } from "@/lib/utils";
import { CreatePostDialog } from "@/components/shared/create-post-dialog";
import { getAllPosts } from "@/lib/services/firestore";
import type { Post } from "@/lib/types";

const FEED_TABS = [
  { id: "all", label: "All" },
  { id: "my-feed", label: "My Feed" },
  { id: "community", label: "Community" },
  { id: "whats-new", label: "What's New" },
];

function ActivityContent() {
  const [activeTab, setActiveTab] = useState("all");
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await getAllPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error loading posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  return (
    <div className="max-w-xl mx-auto px-4 py-4">
      {/* Create Post Button */}
      <div className="mb-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-700">
          <CreatePostDialog />
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
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No posts yet. Be the first to share something!
          </div>
        ) : (
          posts.map((post) => (
            <ContentCard
              key={post.id}
              id={post.id}
              username={post.authorName}
              userAvatar={post.authorPhotoURL}
              imageUrl={post.imageURL || ""}
              content={post.content}
              likes={post.likes.length}
              commentCount={post.comments.length}
              timestamp={post.createdAt.toLocaleString()}
            />
          ))
        )}
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
