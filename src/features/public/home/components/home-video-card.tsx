"use client";

import Image from "next/image";
import { useState } from "react";
import { Maximize2, Play } from "lucide-react";

import { Button } from "@/components/ui/button";

type HomeVideo = {
  title: string;
  desc: string;
  duration: string;
  videoId: string;
  thumbnail: string;
};

export function HomeVideoCard({ video }: { video: HomeVideo }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="group block">
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-foreground/40 ring-1 ring-border/20">
        {!isPlaying ? (
          <>
            <Image
              src={video.thumbnail}
              alt={video.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-foreground/30 transition-colors group-hover:bg-foreground/40" />
            <Button
              type="button"
              variant="secondary"
              size="icon-lg"
              className="absolute top-1/2 left-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary hover:bg-primary/90 text-white"
              onClick={() => setIsPlaying(true)}
              aria-label={`Play ${video.title}`}
            >
              <Play className="ml-0.5 size-5" fill="currentColor" />
            </Button>
            <span className="absolute right-3 bottom-3 rounded bg-foreground/70 px-2 py-1 font-mono text-[11px] text-background">
              {video.duration}
            </span>
          </>
        ) : (
          <>
            <iframe
              src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 size-full"
            />
            <Button
              type="button"
              variant="secondary"
              size="icon-sm"
              className="absolute top-3 right-3 z-10 bg-foreground/60 text-background hover:bg-foreground/80"
              onClick={() =>
                window.open(
                  `https://www.youtube.com/watch?v=${video.videoId}`,
                  "_blank",
                )
              }
              aria-label="Open fullscreen"
            >
              <Maximize2 className="size-4" />
            </Button>
          </>
        )}
      </div>
      <h3 className="mt-5 font-serif text-xl text-background">{video.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-background/70">
        {video.desc}
      </p>
    </div>
  );
}
