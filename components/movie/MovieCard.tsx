"use client";

import Link from "next/link";
import type { MovieItem } from "@/types/ophim";
import { OPHIM_CONFIG } from "@/constants/ophim";
import { MovieCardImage } from "./MovieCardImage";

interface MovieCardProps {
  movie: MovieItem;
  cdnUrl?: string;
}

export function MovieCard({
  movie,
  cdnUrl = OPHIM_CONFIG.CDN_IMAGE_URL,
}: MovieCardProps) {
  return (
    <Link
      href={`/phim/${movie.slug}`}
      className="group relative block overflow-hidden rounded-md bg-[#22253a] transition-transform duration-200 hover:scale-105 hover:z-10"
    >
      {/* Poster */}
      <div className="relative aspect-2/3 w-full overflow-hidden">
        <MovieCardImage movie={movie} cdnUrl={cdnUrl} />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 transition-all duration-200 group-hover:bg-black/40" />

        {/* Badges */}
        <div className="absolute left-1.5 top-1.5 flex flex-col gap-1">
          {movie.quality && (
            <span className="rounded bg-[#e50914] px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
              {movie.quality}
            </span>
          )}
          {movie.lang && (
            <span className="rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
              {movie.lang}
            </span>
          )}
        </div>

        {/* Episode badge */}
        {movie.episode_current && (
          <div className="absolute bottom-1.5 right-1.5">
            <span className="rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-white">
              {movie.episode_current}
            </span>
          </div>
        )}

        {/* Play icon on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <svg
              className="h-5 w-5 translate-x-0.5 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-2">
        <h3 className="line-clamp-1 text-sm font-medium text-white">
          {movie.name}
        </h3>
        <p className="mt-0.5 line-clamp-1 text-xs text-[#a3a3a3]">
          {movie.origin_name}
        </p>
        <div className="mt-1 flex items-center gap-2 text-[11px] text-[#6b7280]">
          {movie.year && <span>{movie.year}</span>}
          {movie.type && (
            <span className="capitalize">
              {movie.type === "series" ? "Phim bộ" : "Phim lẻ"}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
