"use client";

import Image from "next/image";
import { useState } from "react";
import { Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import type { PopularVideo } from "../data";

type InsightsVideoCardProps = {
  video: PopularVideo;
  compact?: boolean;
};

export function InsightsVideoCard({
  video,
  compact = false,
}: InsightsVideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <Card
      className={`group overflow-hidden rounded-2xl p-0 shadow-sm transition-all hover:shadow-md ${
        compact ? "min-w-[320px] w-[320px] shrink-0" : ""
      }`}
    >
      <div
        className={`relative overflow-hidden bg-foreground ${
          compact ? "aspect-[4/3]" : "aspect-video"
        }`}
      >
        {!isPlaying ? (
          <>
            <Image
              src={video.thumbnail}
              alt={video.title}
              fill
              className="object-cover"
              sizes={compact ? "320px" : "50vw"}
            />
            <div className="absolute inset-0 bg-foreground/20 transition-colors group-hover:bg-foreground/30" />
            <Button
              type="button"
              variant="secondary"
              size="icon-lg"
              className="absolute top-1/2 left-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-full"
              onClick={() => setIsPlaying(true)}
              aria-label={`Play ${video.title}`}
            >
              <Play className="ml-0.5 size-5" fill="currentColor" />
            </Button>
            <span className="absolute right-2 bottom-2 rounded bg-foreground/70 px-2 py-0.5 text-xs font-medium text-background">
              {video.duration}
            </span>
          </>
        ) : (
          <iframe
            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 size-full"
          />
        )}
      </div>
      <CardContent className={compact ? "p-6" : "p-5"}>
        <h3
          className={`font-semibold leading-snug ${
            compact ? "line-clamp-2 text-lg" : "text-base"
          }`}
        >
          {video.title}
        </h3>
        {video.therapist && (
          <p
            className={`text-muted-foreground ${
              compact ? "mt-3 text-sm" : "mt-1 text-xs"
            }`}
          >
            {video.therapist}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
