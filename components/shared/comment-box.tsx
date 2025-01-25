import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Smile, Loader2 } from "lucide-react";
import { EmojiPicker } from "./emoji-picker";
import { useAuth } from "@/lib/context/auth-context";
import { addComment } from "@/lib/services/firestore";

interface CommentBoxProps {
  postId: string | number;
  onCommentAdded?: () => void;
}

export function CommentBox({ postId, onCommentAdded }: CommentBoxProps) {
  const [content, setContent] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleEmojiSelect = (emoji: any) => {
    setContent((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  const handleSubmit = async () => {
    if (!user || !content.trim()) return;

    setIsSubmitting(true);
    try {
      await addComment(postId.toString(), {
        authorId: user.uid,
        authorName: user.displayName || "",
        authorPhotoURL: user.photoURL || "",
        content: content.trim(),
      });

      setContent("");
      onCommentAdded?.();
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4 animate-in slide-in-from-top duration-300">
      <div className="relative">
        <Textarea
          placeholder="Write a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[80px] resize-none pr-10"
          maxLength={1000}
        />
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
        >
          <Smile className="h-5 w-5" />
        </button>
        {showEmojiPicker && (
          <div className="absolute right-0 top-full z-50 mt-2">
            <EmojiPicker onEmojiSelect={handleEmojiSelect} />
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!content.trim() || isSubmitting}
          className="bg-[#7BD3EA] hover:bg-[#A1EEBD] text-black"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Posting...
            </>
          ) : (
            "Post Comment"
          )}
        </Button>
      </div>
    </div>
  );
}
