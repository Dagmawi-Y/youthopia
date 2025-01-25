"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { MediaViewer } from "./media-viewer";
import { ShareDialog } from "./share-dialog";
import { useAuth } from "@/lib/context/auth-context";
import { likePost, unlikePost } from "@/lib/services/firestore";

interface ContentCardProps {
  id: string | number;
  username: string;
  userAvatar?: string;
  imageUrl: string;
  content?: string;
  likes: string[];
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
  likes = [],
  commentCount = 0,
  timestamp,
  className,
}: ContentCardProps) {
  const [isMediaViewerOpen, setIsMediaViewerOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const { user } = useAuth();

  const isLiked = user
    ? Array.isArray(likes)
      ? likes.includes(user.uid)
      : false
    : false;
  const mediaType = imageUrl?.toLowerCase().match(/\.(mp4|webm|ogg)$/)
    ? "video"
    : "image";

  const handleLikeClick = async () => {
    if (!user) return;

    setIsLiking(true);
    try {
      if (isLiked) {
        await unlikePost(id.toString(), user.uid);
      } else {
        await likePost(id.toString(), user.uid);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <>
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
              <AvatarImage src={userAvatar} alt={username} />
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

        {/* Content Media */}
        {imageUrl && (
          <div
            className="relative max-h-[500px] w-full cursor-pointer"
            onClick={() => setIsMediaViewerOpen(true)}
          >
            {mediaType === "video" ? (
              <video
                src={imageUrl}
                className="w-full h-full object-contain"
                controls
              />
            ) : (
              <Image
                src={imageUrl}
                alt={content || "Content image"}
                width={800}
                height={800}
                className="object-contain w-full h-full"
              />
            )}
          </div>
        )}

        {/* Actions */}
        <div className="p-2">
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "text-gray-600 dark:text-gray-300 hover:text-[#7BD3EA]",
                isLiked && "text-red-500 hover:text-red-600"
              )}
              onClick={handleLikeClick}
              disabled={isLiking || !user}
            >
              <Heart
                className={cn("h-4 w-4 mr-1", isLiked && "fill-current")}
              />
              <span className="text-xs">
                {likes.length > 0 ? likes.length : ""}
              </span>
            </Button>
            <Link href={`/post/${id}`}>
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
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 dark:text-gray-300 hover:text-[#7BD3EA]"
              onClick={() => setIsShareDialogOpen(true)}
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

      {/* Media Viewer Dialog */}
      <MediaViewer
        isOpen={isMediaViewerOpen}
        onClose={() => setIsMediaViewerOpen(false)}
        mediaUrl={imageUrl}
        mediaType={mediaType}
        alt={content}
      />

      {/* Share Dialog */}
      <ShareDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        postId={id}
      />
    </>
  );
}
