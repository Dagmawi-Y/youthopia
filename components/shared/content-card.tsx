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
  content?: string;
  likes?: number;
  commentCount?: number;
  timestamp?: string;
  className?: string;
}

export function ContentCard({
  id,
  username,
  userAvatar,
  imageUrl,
  content,
  likes = 0,
  commentCount = 0,
  timestamp,
  className,
}: ContentCardProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700",
        className
      )}
    >
      {/* User Info */}
      <div className="p-3 flex items-center justify-between">
        <Link
          href={`/profile/${username}`}
          className="flex items-center space-x-2"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={userAvatar} />
            <AvatarFallback>
              {username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
              {username}
            </span>
            {timestamp && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {timestamp}
              </span>
            )}
          </div>
        </Link>
      </div>

      {/* Content */}
      {content && (
        <p className="px-3 pb-2 text-sm dark:text-gray-300">{content}</p>
      )}

      {/* Content Image */}
      {imageUrl && (
        <div className="relative max-h-[500px] w-full">
          <Image
            src={imageUrl}
            alt={content || "Content image"}
            width={800}
            height={800}
            className="object-contain w-full h-full"
          />
        </div>
      )}

      {/* Actions */}
      <div className="p-2">
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 dark:text-gray-300 hover:text-[#7BD3EA]"
          >
            <Heart className="h-4 w-4 mr-1" />
            <span className="text-xs">{likes > 0 ? likes : ""}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 dark:text-gray-300 hover:text-[#7BD3EA]"
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            <span className="text-xs">
              {commentCount > 0 ? commentCount : ""}
            </span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 dark:text-gray-300 hover:text-[#7BD3EA]"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Comments Link */}
        {commentCount > 0 && (
          <Link
            href={`/post/${id}`}
            className="block px-2 mt-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            View all {commentCount} comments
          </Link>
        )}
      </div>
    </div>
  );
}
