"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { ContentCard } from "@/components/shared/content-card";
import { getPost } from "@/lib/services/firestore";
import type { Post } from "@/lib/types";

export default function PostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadPost = async () => {
      try {
        const fetchedPost = await getPost(params.id);
        if (!fetchedPost) {
          router.push("/activity");
          return;
        }
        setPost(fetchedPost);
      } catch (error) {
        console.error("Error loading post:", error);
        router.push("/activity");
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [params.id, router]);

  return (
    <ProtectedRoute>
      <div className="max-w-xl mx-auto px-4 py-4">
        {isLoading ? (
          <div className="text-center py-8">Loading post...</div>
        ) : post ? (
          <ContentCard
            id={post.id}
            username={post.authorName}
            userAvatar={post.authorPhotoURL}
            imageUrl={post.imageURL || ""}
            content={post.content}
            likes={post.likes || []}
            commentCount={post.comments.length}
            timestamp={post.createdAt.toLocaleString()}
          />
        ) : (
          <div className="text-center py-8">Post not found</div>
        )}
      </div>
    </ProtectedRoute>
  );
}
