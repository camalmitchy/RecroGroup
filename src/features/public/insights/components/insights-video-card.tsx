"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Play } from "lucide-react";

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
    <div
      className={`group card-lift overflow-hidden rounded-2xl border border-border bg-card ${
        compact ? "w-[320px] min-w-[320px] shrink-0" : ""
      }`}
    >
      <div
        className={`relative overflow-hidden bg-black ${
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
            <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/30" />
            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              aria-label={`Play ${video.title}`}
              className="absolute inset-0 grid place-items-center"
            >
              <span className="grid h-14 w-14 place-items-center rounded-full bg-white/95 text-primary-deep shadow-lg backdrop-blur transition-transform group-hover:scale-110">
                <Play size={20} className="ml-0.5" fill="currentColor" />
              </span>
            </button>
            <div className="absolute right-2 bottom-2 rounded bg-black/70 px-2 py-0.5 text-xs font-medium text-white">
              {video.duration}
            </div>
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
      <div className={compact ? "flex flex-col p-6" : "p-5"}>
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
      </div>
    </div>
  );
}
