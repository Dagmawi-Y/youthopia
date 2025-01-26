"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Heart, MessageCircle, Share2, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { MediaViewer } from "./media-viewer";
import { ShareDialog } from "./share-dialog";
import { CommentBox } from "./comment-box";
import { useAuth } from "@/lib/context/auth-context";
import { likePost } from "@/lib/services/firestore";

interface ContentCardProps {
  id: string | number;
  username: string;
  userAvatar?: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  content?: string;
  likes: string[];
  commentCount?: number;
  timestamp?: string;
  className?: string;
  challengeId?: string;
}

export function ContentCard({
  id,
  username,
  userAvatar,
  mediaUrl,
  mediaType = "image",
  content,
  likes = [],
  commentCount = 0,
  timestamp,
  className,
  challengeId,
}: ContentCardProps) {
  const [isMediaViewerOpen, setIsMediaViewerOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [localLikes, setLocalLikes] = useState(likes);
  const { user } = useAuth();

  const isLiked = user ? localLikes.includes(user.uid) : false;

  const handleLikeClick = async () => {
    if (!user) return;

    setIsLiking(true);
    try {
      const wasLiked = await likePost(id.toString(), user.uid);
      setLocalLikes((prev) =>
        wasLiked ? [...prev, user.uid] : prev.filter((uid) => uid !== user.uid)
      );
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
        {/* Challenge Banner */}
        {challengeId && (
          <Link href={`/challenges/${challengeId}`}>
            <div className="bg-gradient-to-r from-[#7BD3EA] to-[#A1EEBD] text-black px-4 py-2 rounded-t-lg flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span className="text-sm font-medium">Challenge Submission</span>
            </div>
          </Link>
        )}

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

        {/* Media Content */}
        {mediaUrl && (
          <div className="relative w-full overflow-hidden">
            {mediaType === "video" ? (
              <div className="aspect-video w-full bg-black">
                <video
                  key={mediaUrl}
                  src={mediaUrl}
                  className="w-full "
                  controls
                  playsInline
                  preload="metadata"
                />
              </div>
            ) : (
              <div
                className="relative w-full pt-[56.25%]"
                onClick={() => setIsMediaViewerOpen(true)}
              >
                <img
                  src={mediaUrl}
                  alt={content || "Content image"}
                  className="absolute top-0 left-0 w-full h-full object-cover cursor-pointer"
                />
              </div>
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
                {localLikes.length > 0 ? localLikes.length : ""}
              </span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 dark:text-gray-300 hover:text-[#7BD3EA]"
              onClick={() => setShowCommentBox(!showCommentBox)}
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
              onClick={() => setIsShareDialogOpen(true)}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Stats Links */}
          <div className="flex space-x-4 px-2 mt-1">
            {localLikes.length > 0 && (
              <Link
                href={`/post/${id}`}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {localLikes.length} {localLikes.length === 1 ? "like" : "likes"}
              </Link>
            )}
            {commentCount > 0 && (
              <Link
                href={`/post/${id}`}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {commentCount} {commentCount === 1 ? "comment" : "comments"}
              </Link>
            )}
          </div>

          {/* Comment Box */}
          {showCommentBox && (
            <div className="mt-3">
              <CommentBox
                postId={id}
                onCommentAdded={() => {
                  setShowCommentBox(false);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Media Viewer Dialog */}
      {mediaUrl && mediaType === "image" && (
        <MediaViewer
          isOpen={isMediaViewerOpen}
          onClose={() => setIsMediaViewerOpen(false)}
          mediaUrl={mediaUrl}
          mediaType={mediaType}
          alt={content}
        />
      )}

      {/* Share Dialog */}
      <ShareDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        postId={id}
      />
    </>
  );
}
