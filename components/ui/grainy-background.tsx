"use client";

import { cn } from "@/lib/utils";

interface GrainyBackgroundProps {
  className?: string;
}

export function GrainyBackground({ className }: GrainyBackgroundProps) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-30 transform-gpu",
        className
      )}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 2000 2000' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        opacity: "0.35",
        mixBlendMode: "overlay",
        transform: "translate3d(0, 0, 0)",
      }}
    />
  );
}
