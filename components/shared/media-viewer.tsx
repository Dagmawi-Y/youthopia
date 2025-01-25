import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";

interface MediaViewerProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrl: string;
  mediaType: "image" | "video";
  alt?: string;
}

export function MediaViewer({
  isOpen,
  onClose,
  mediaUrl,
  mediaType,
  alt,
}: MediaViewerProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-transparent border-0">
        <div
          className="relative w-full h-full flex items-center justify-center"
          onClick={(e) => {
            // Close when clicking outside the media
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {mediaType === "image" ? (
            <div className="relative max-w-full max-h-[90vh]">
              <Image
                src={mediaUrl}
                alt={alt || "Media content"}
                width={1920}
                height={1080}
                className="object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          ) : (
            <video
              src={mediaUrl}
              controls
              className="max-w-full max-h-[90vh] rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
