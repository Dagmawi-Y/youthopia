import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Smile, X, Loader2, Image as ImageIcon, Video } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/context/auth-context";
import { createPost } from "@/lib/services/firestore";
import { uploadFile } from "@/lib/appwrite";
import { EmojiPicker } from "./emoji-picker";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MAX_IMAGE_SIZE = 800; // Maximum width/height for the square image

const processImage = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Create a square canvas with the minimum dimension
      const size = Math.min(img.width, img.height, MAX_IMAGE_SIZE);
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      // Calculate cropping position to center the image
      const sx = (img.width - size) / 2;
      const sy = (img.height - size) / 2;

      // Draw the cropped and scaled image
      ctx.drawImage(img, sx, sy, size, size, 0, 0, size, size);

      // Convert canvas to blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Could not create blob"));
            return;
          }
          // Create a new file from the blob
          const processedFile = new File([blob], file.name, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
          resolve(processedFile);
        },
        "image/jpeg",
        0.9
      );
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
};

interface CreatePostDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreatePostDialog({
  open,
  onOpenChange,
}: CreatePostDialogProps) {
  const [content, setContent] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [privacy, setPrivacy] = useState("everyone");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type and size
    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");

    if (!isVideo && !isImage) {
      alert("Please upload an image or video file");
      return;
    }

    if (isVideo && file.size > 30 * 1024 * 1024) {
      // 30MB limit for videos
      alert("Video must be less than 30MB");
      return;
    }

    if (isImage && file.size > 5 * 1024 * 1024) {
      // 5MB limit for images
      alert("Image must be less than 5MB");
      return;
    }

    try {
      if (isImage) {
        const processedFile = await processImage(file);
        setMediaFile(processedFile);
        const objectUrl = URL.createObjectURL(processedFile);
        setMediaPreview(objectUrl);
      } else {
        setMediaFile(file);
        const objectUrl = URL.createObjectURL(file);
        setMediaPreview(objectUrl);
      }
      setMediaType(isVideo ? "video" : "image");
    } catch (error) {
      console.error("Error processing image:", error);
      alert("Failed to process image. Please try again.");
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    setContent((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  const handleSubmit = async () => {
    if (!user || !content.trim()) return;

    setIsLoading(true);
    try {
      let mediaURL = "";
      if (mediaFile) {
        mediaURL = await uploadFile(mediaFile);
      }

      await createPost({
        authorId: user.uid,
        authorName: user.displayName || "",
        authorPhotoURL: user.photoURL || "",
        content: content.trim(),
        mediaURL,
        mediaType,
        title: "",
        tags: [],
      });

      setContent("");
      setMediaPreview(null);
      setMediaFile(null);
      setMediaType("image");
      onOpenChange?.(false);
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Create a post
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {/* User Info */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={user?.photoURL || ""}
                  alt={user?.displayName || ""}
                />
                <AvatarFallback>
                  {user?.displayName?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="font-semibold">{user?.displayName}</div>
            </div>
            <Select defaultValue={privacy} onValueChange={setPrivacy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="everyone">Everyone</SelectItem>
                <SelectItem value="friends">Friends</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Content Input */}
          <div className="relative">
            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[150px] resize-none text-lg p-4"
              maxLength={3000}
            />
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
            >
              <Smile className="h-5 w-5" />
            </button>
            {showEmojiPicker && (
              <div className="absolute right-0 top-10 z-50">
                <EmojiPicker onEmojiSelect={handleEmojiSelect} />
              </div>
            )}
          </div>

          {/* Media Preview */}
          {mediaPreview && (
            <div className="relative mt-4">
              <div className="max-h-[200px] overflow-hidden rounded-lg">
                {mediaType === "video" ? (
                  <video
                    src={mediaPreview}
                    className="w-full object-cover"
                    controls
                  />
                ) : (
                  <img
                    src={mediaPreview}
                    alt="Preview"
                    className="w-full object-cover"
                  />
                )}
              </div>
              <button
                onClick={() => {
                  setMediaPreview(null);
                  setMediaFile(null);
                  setMediaType("image");
                }}
                className="absolute top-2 right-2 bg-gray-900/60 hover:bg-gray-900/80 p-1.5 rounded-full text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-4 flex items-center justify-between border-t pt-4">
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,video/*"
                className="hidden"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="text-gray-600 hover:text-gray-900"
              >
                <ImageIcon className="h-5 w-5 mr-2" />
                <span>Photo</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="text-gray-600 hover:text-gray-900"
              >
                <Video className="h-5 w-5 mr-2" />
                <span>Video</span>
              </Button>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!content.trim() || isLoading}
              className="bg-[#7BD3EA] hover:bg-[#A1EEBD] text-black px-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
