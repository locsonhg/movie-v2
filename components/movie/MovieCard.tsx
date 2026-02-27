"use client";

import Link from "next/link";
import type { MovieItem } from "@/types/ophim";
import { OPHIM_CONFIG } from "@/constants/ophim";
import { MovieCardImage } from "./MovieCardImage";
import { MovieHoverPopup, useMovieHover } from "./MovieHoverPopup";

interface MovieCardProps {
  movie: MovieItem;
  cdnUrl?: string;
}

export function MovieCard({
  movie,
  cdnUrl = OPHIM_CONFIG.CDN_IMAGE_URL,
}: MovieCardProps) {
  const { showPopup, handleMouseEnter, handleMouseLeave, handlePopupEnter } =
    useMovieHover();

  return (
    <div
      className="relative"
      style={{ zIndex: showPopup ? 50 : undefined }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={`/phim/${movie.slug}`}
        className="group relative block overflow-hidden rounded-md bg-[#22253a] transition-transform duration-200 hover:scale-105 hover:z-10"
      >
        {/* Poster */}
        <div className="relative aspect-2/3 w-full overflow-hidden">
          <MovieCardImage movie={movie} cdnUrl={cdnUrl} />

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 transition-all duration-200 group-hover:bg-black/40" />

          {/* Movie name overlay at bottom */}
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent px-2 pb-2 pt-8">
            {/* Badges */}
            <div className="mb-1.5 flex flex-wrap gap-1">
              {movie.quality && (
                <span
                  className="rounded px-1.5 py-0.5 text-[10px] font-bold text-white"
                  style={{ backgroundColor: "#d97706e0" }}
                >
                  {movie.quality}
                </span>
              )}
              {movie.lang && (
                <span
                  className="rounded px-1.5 py-0.5 text-[10px] font-bold text-white"
                  style={{ backgroundColor: "#16a34ae0" }}
                >
                  {movie.lang.includes("Thuyết")
                    ? "Thuyết minh"
                    : movie.lang.includes("Lồng")
                    ? "Lồng tiếng"
                    : movie.lang.includes("Vietsub") ||
                      movie.lang.includes("Sub")
                    ? "Vietsub"
                    : movie.lang}
                </span>
              )}
              {movie.episode_current && (
                <span
                  className="rounded px-1.5 py-0.5 text-[10px] font-bold text-white"
                  style={{ backgroundColor: "#2563ebe0" }}
                >
                  {movie.episode_current}
                </span>
              )}
            </div>
            <h3 className="line-clamp-1 text-sm font-medium text-white">
              {movie.name}
            </h3>
          </div>

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
      </Link>

      {/* Hover popup — desktop only */}
      {showPopup && (
        <MovieHoverPopup
          movie={movie}
          cdnUrl={cdnUrl}
          onMouseEnter={handlePopupEnter}
          onMouseLeave={handleMouseLeave}
        />
      )}
    </div>
  );
}
