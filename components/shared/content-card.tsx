"use client";

import { cn } from "@/lib/utils";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

interface ContentCardProps {
  id: string | number;
  username: string;
  userAvatar?: string;
  imageUrl: string;
  caption?: string;
  likes?: number;
  comments?: number;
  timestamp?: string;
  className?: string;
}

export function ContentCard({
  id,
  username,
  userAvatar,
  imageUrl,
  caption,
  likes = 0,
  comments = 0,
  timestamp,
  className,
}: ContentCardProps) {
  return (
    <div className={cn("bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden", className)}>
      {/* User Info */}
      <div className="p-4 flex items-center justify-between">
        <Link href={`/profile/${username}`} className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userAvatar} />
            <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="font-medium text-sm text-gray-900 dark:text-gray-100">{username}</span>
        </Link>
        {timestamp && (
          <span className="text-xs text-gray-500 dark:text-gray-400">{timestamp}</span>
        )}
      </div>

      {/* Content Image */}
      <div className="relative aspect-square">
        <Image
          src={imageUrl}
          alt={caption || "Content image"}
          fill
          className="object-cover"
        />
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-300 hover:text-[#7BD3EA]">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-300 hover:text-[#7BD3EA]">
            <MessageCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-300 hover:text-[#7BD3EA]">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-2 space-y-2">
          {likes > 0 && (
            <p className="text-sm font-medium dark:text-gray-200">{likes} likes</p>
          )}
          {caption && (
            <p className="text-sm dark:text-gray-300">
              <Link href={`/profile/${username}`} className="font-medium dark:text-gray-200">
                {username}
              </Link>{" "}
              {caption}
            </p>
          )}
          {comments > 0 && (
            <Link
              href={`/post/${id}`}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              View all {comments} comments
            </Link>
          )}
        </div>
      </div>
    </div>
  );
} 