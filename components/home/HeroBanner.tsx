"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import type { MovieItem } from "@/types/ophim";
import { OPHIM_CONFIG } from "@/constants/ophim";
import { Skeleton } from "@/components/ui";
import { HeroBannerSlide } from "./HeroBannerSlide";
import { MovieCardImage } from "@/components/movie/MovieCardImage";
import { useMovieDetail } from "@/hooks/useOphimQueries";

interface HeroBannerProps {
  movies: MovieItem[];
  cdnUrl?: string;
}

export function HeroBanner({
  movies,
  cdnUrl = OPHIM_CONFIG.CDN_IMAGE_URL,
}: HeroBannerProps) {
  const [current, setCurrent] = useState(0);
  const featured = movies.slice(0, 5);
  const currentSlug = featured[current]?.slug ?? "";

  // Fetch detail for description + IMDb (cached per slug by React Query)
  const { data: detailData } = useMovieDetail(currentSlug);
  const detail = detailData?.item;

  useEffect(() => {
    if (featured.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % featured.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featured.length]);

  if (featured.length === 0) return <HeroBannerSkeleton />;

  const movie = featured[current];
  const description = detail?.content
    ? detail.content.replace(/<[^>]*>/g, "").trim()
    : null;

  return (
    <div className="relative mb-8 h-[85vh] min-h-140 w-full overflow-hidden">
      {/* Background slides */}
      {featured.map((m, i) => (
        <HeroBannerSlide
          key={m._id}
          movie={m}
          isActive={i === current}
          cdnUrl={cdnUrl}
        />
      ))}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
      {/* Top gradient for header readability */}
      <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-black/50 to-transparent" />

      {/* Bottom content area */}
      <div className="absolute inset-x-0 bottom-0 px-4 pb-14 md:px-6 md:pb-16">
        <div className="flex items-end justify-between gap-8">
          {/* LEFT: Movie info */}
          <div className="max-w-lg">
            {/* Title */}
            <h1 className="mb-1 text-3xl font-bold leading-tight text-white drop-shadow-lg md:text-4xl">
              {movie.name}
            </h1>

            {/* Original name */}
            {movie.origin_name && (
              <p className="mb-3 text-sm italic text-[#f5a623]">
                {movie.origin_name}
              </p>
            )}

            {/* Info badges row */}
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              {/* IMDb badge */}
              {detail?.imdb?.vote_average ? (
                <span className="inline-flex items-center gap-1 rounded border border-white/20 bg-[#1c1c1c] px-2 py-0.5 text-xs font-bold">
                  <span className="text-[#f5c518]">IMDb</span>
                  <span className="text-white">
                    {detail.imdb.vote_average.toFixed(1)}
                  </span>
                </span>
              ) : null}
              {movie.quality && (
                <span className="rounded bg-[#e50914] px-2 py-0.5 text-xs font-bold uppercase text-white">
                  {movie.quality}
                </span>
              )}
              {movie.year && (
                <span className="rounded border border-white/30 bg-white/10 px-2 py-0.5 text-xs font-medium text-white">
                  {movie.year}
                </span>
              )}
              {movie.type && (
                <span className="rounded border border-white/30 bg-white/10 px-2 py-0.5 text-xs font-medium text-white">
                  {movie.type === "series" ? "Phim Bộ" : "Phim Lẻ"}
                </span>
              )}
              {movie.episode_current && (
                <span className="rounded border border-white/30 bg-white/10 px-2 py-0.5 text-xs font-medium text-white">
                  {movie.episode_current}
                </span>
              )}
            </div>

            {/* Categories */}
            {movie.category?.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1.5">
                {movie.category.slice(0, 4).map((cat) => (
                  <span
                    key={cat.slug ?? cat._id ?? cat.name}
                    className="rounded-full border border-white/25 bg-white/5 px-3 py-0.5 text-xs text-white/80"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            {description && (
              <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-white/60">
                {description}
              </p>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <Link
                href={`/phim/${movie.slug}`}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f5a623] shadow-lg shadow-[#f5a623]/30 transition-all hover:scale-105 hover:bg-[#e09616]"
                aria-label="Xem ngay"
              >
                <svg
                  className="ml-0.5 h-5 w-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </Link>

              <button
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                aria-label="Yêu thích"
              >
                <svg
                  className="h-4.5 w-4.5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>

              <Link
                href={`/phim/${movie.slug}`}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                aria-label="Chi tiết"
              >
                <svg
                  className="h-4.5 w-4.5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* RIGHT: Horizontal landscape thumbnail strip at bottom-right */}
          <div className="mb-1 hidden shrink-0 items-end gap-2 lg:flex">
            {featured.map((m, i) => (
              <button
                key={m._id}
                onClick={() => setCurrent(i)}
                title={m.name}
                className={`relative overflow-hidden rounded-md transition-all duration-300 ${
                  i === current
                    ? "ring-2 ring-[#f5a623] opacity-100"
                    : "opacity-50 hover:opacity-90"
                }`}
              >
                <div className="relative h-14 w-24 overflow-hidden bg-[#22253a]">
                  <MovieCardImage movie={m} cdnUrl={cdnUrl} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Slide dots */}
      {featured.length > 1 && (
        <div className="absolute bottom-5 left-6 flex gap-1.5 md:left-12">
          {featured.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? "w-6 bg-[#f5a623]" : "w-1.5 bg-white/40"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function HeroBannerSkeleton() {
  return (
    <div className="relative mb-8 h-[85vh] min-h-140 w-full overflow-hidden bg-[#22253a]">
      <div className="absolute inset-x-0 bottom-0 px-6 pb-16 md:px-12">
        <div className="max-w-lg space-y-3">
          <Skeleton className="h-10 w-80" />
          <Skeleton className="h-4 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-5 w-14" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="h-4 w-96" />
          <Skeleton className="h-4 w-72" />
          <div className="flex gap-3 pt-1">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
