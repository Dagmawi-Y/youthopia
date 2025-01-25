import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, Smile, X, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/context/auth-context";
import { createPost } from "@/lib/services/firestore";
import { uploadFile } from "@/lib/appwrite";
import { EmojiPicker } from "./emoji-picker";

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

export function CreatePostDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
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
      setIsOpen(false);
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-[#7BD3EA] hover:bg-[#A1EEBD] text-black dark:text-white rounded-full flex items-center justify-center space-x-2 h-9">
          <Camera className="h-4 w-4" />
          <span className="text-sm">Create a post</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a Post</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="relative">
            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px] resize-none pr-10"
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

          {mediaPreview && (
            <div className="relative">
              {mediaType === "video" ? (
                <video
                  src={mediaPreview}
                  className="w-full rounded-lg"
                  controls
                />
              ) : (
                <img
                  src={mediaPreview}
                  alt="Preview"
                  className="w-full rounded-lg"
                />
              )}
              <button
                onClick={() => {
                  setMediaPreview(null);
                  setMediaFile(null);
                  setMediaType("image");
                }}
                className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,video/*"
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
          >
            Upload Photo or Video
          </Button>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!content.trim() || isLoading}
          className="w-full bg-[#7BD3EA] hover:bg-[#A1EEBD] text-black"
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
      </DialogContent>
    </Dialog>
  );
}
