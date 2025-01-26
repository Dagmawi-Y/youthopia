"use client";

import { useEffect, useState, useRef } from "react";
import { ContentCard } from "@/components/shared/content-card";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { cn } from "@/lib/utils";
import { CreatePostDialog } from "@/components/shared/create-post-dialog";
import { getAllPosts } from "@/lib/services/firestore";
import type { Post } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/context/auth-context";
import { ImageIcon, Video } from "lucide-react";

const FEED_TABS = [
  { id: "all", label: "All" },
  { id: "my-feed", label: "My Feed" },
];

function ActivityContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      {/* Create Post Section */}
      <div className="mb-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={user?.photoURL || ""}
                alt={user?.displayName || "User"}
              />
              <AvatarFallback>
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                </svg>
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => setIsCreatePostOpen(true)}
              className="flex-1 text-left px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-gray-500 dark:text-gray-400 text-sm"
            >
              What's on your mind?
            </button>
          </div>
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                setIsCreatePostOpen(true);
                setTimeout(() => fileInputRef.current?.click(), 100);
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setIsCreatePostOpen(true);
                setTimeout(() => fileInputRef.current?.click(), 100);
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300"
            >
              <Video className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <CreatePostDialog
        open={isCreatePostOpen}
        onOpenChange={setIsCreatePostOpen}
        fileInputRef={fileInputRef}
      />

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
              mediaUrl={post.mediaURL || ""}
              mediaType={post.mediaType}
              content={post.content}
              likes={post.likes || []}
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
