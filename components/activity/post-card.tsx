"use client";

import { Post } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle } from "lucide-react";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="overflow-hidden">
      <img
        src={post.imageUrl}
        alt={post.caption}
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg">{post.username}</h3>
        </div>
        <p className="text-gray-600 mb-4">{post.caption}</p>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="space-x-2">
            <Heart className="h-4 w-4" />
            <span>{post.likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="space-x-2">
            <MessageCircle className="h-4 w-4" />
            <span>{post.comments}</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}