"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { ContentCard } from "@/components/shared/content-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getPost, getUserProfile } from "@/lib/services/firestore";
import type { Post, Comment } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

function CommentList({ comments }: { comments: Comment[] }) {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-start space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={comment.authorPhotoURL}
                alt={comment.authorName}
              />
              <AvatarFallback>
                {comment.authorName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                  {comment.authorName}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                {comment.content}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function LikesList({
  likes,
  usernames,
}: {
  likes: string[];
  usernames: Record<string, string>;
}) {
  return (
    <div className="space-y-2">
      {likes.map((userId) => (
        <div key={userId} className="text-sm text-gray-600 dark:text-gray-300">
          {usernames[userId] || "Loading..."}
        </div>
      ))}
    </div>
  );
}

export default function PostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"comments" | "likes">("comments");
  const [usernames, setUsernames] = useState<Record<string, string>>({});
  const router = useRouter();
  const postId = params.id;

  useEffect(() => {
    const loadPost = async () => {
      try {
        const fetchedPost = await getPost(postId);
        if (!fetchedPost) {
          router.push("/activity");
          return;
        }
        setPost(fetchedPost);

        // Fetch usernames for likes
        const usernamesMap: Record<string, string> = {};
        for (const userId of fetchedPost.likes) {
          try {
            const userProfile = await getUserProfile(userId);
            if (userProfile) {
              usernamesMap[userId] =
                userProfile.displayName ||
                userProfile.username ||
                "Unknown User";
            }
          } catch (error) {
            console.error(`Error fetching user profile for ${userId}:`, error);
          }
        }
        setUsernames(usernamesMap);
      } catch (error) {
        console.error("Error loading post:", error);
        router.push("/activity");
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [postId, router]);

  return (
    <ProtectedRoute>
      <div className="max-w-xl mx-auto px-4 py-4">
        {isLoading ? (
          <div className="text-center py-8">Loading post...</div>
        ) : post ? (
          <div className="space-y-4">
            <ContentCard
              id={post.id}
              username={post.authorName}
              userAvatar={post.authorPhotoURL}
              mediaUrl={post.mediaURL}
              mediaType={post.mediaType || "image"}
              content={post.content}
              likes={post.likes || []}
              commentCount={post.comments.length}
              timestamp={post.createdAt.toLocaleString()}
            />

            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex space-x-4 mb-4">
                <button
                  className={`text-sm font-medium ${
                    activeTab === "comments"
                      ? "text-[#7BD3EA]"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                  onClick={() => setActiveTab("comments")}
                >
                  Comments ({post.comments.length})
                </button>
                <button
                  className={`text-sm font-medium ${
                    activeTab === "likes"
                      ? "text-[#7BD3EA]"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                  onClick={() => setActiveTab("likes")}
                >
                  Likes ({post.likes.length})
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === "comments" ? (
                <CommentList comments={post.comments} />
              ) : (
                <LikesList likes={post.likes} usernames={usernames} />
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">Post not found</div>
        )}
      </div>
    </ProtectedRoute>
  );
}
