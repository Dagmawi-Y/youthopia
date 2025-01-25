import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
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
      <DialogContent className="max-w-4xl w-full p-0 overflow-hidden">
        <DialogTitle className="sr-only">
          {alt || "Media content viewer"}
        </DialogTitle>
        <div className="relative w-full h-full max-h-[90vh] flex items-center justify-center bg-black">
          {mediaType === "video" ? (
            <video
              src={mediaUrl}
              className="w-full h-full object-contain"
              controls
              autoPlay
              playsInline
              preload="metadata"
            />
          ) : (
            <div className="relative w-full aspect-[16/9] min-h-[300px]">
              <Image
                src={mediaUrl}
                alt={alt || "Media content"}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                quality={100}
                priority
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
