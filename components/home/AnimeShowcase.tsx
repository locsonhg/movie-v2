"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { OPHIM_CONFIG } from "@/constants/ophim";
import {
  useMovieList,
  useMovieDetail,
  useMovieImages,
} from "@/hooks/useOphimQueries";
import { buildTmdbImageUrl, normalizeImageUrl } from "@/utils/image";
import { MovieCardImage } from "@/components/movie/MovieCardImage";
import type { MovieItem } from "@/types/ophim";

// ── Play icon ──────────────────────────────────────────────────────────────────

function PlayIcon() {
  return (
    <svg className="ml-0.5 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

// ── Backdrop image ─────────────────────────────────────────────────────────────

function FeaturedBackdrop({
  movie,
  cdnUrl,
}: {
  movie: MovieItem;
  cdnUrl: string;
}) {
  const { data: imagesData } = useMovieImages(movie.slug);
  const backdrop = imagesData?.images?.find((img) => img.type === "backdrop");
  const src =
    backdrop && imagesData
      ? buildTmdbImageUrl(
          imagesData.image_sizes,
          "backdrop",
          backdrop.file_path,
          "w1280"
        )
      : normalizeImageUrl(movie.poster_url, cdnUrl);

  if (!src) return <div className="h-full w-full bg-[#22253a]" />;
  return (
    <Image
      src={src}
      alt={movie.name}
      fill
      className="object-cover object-center"
      unoptimized
      priority
    />
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

interface AnimeShowcaseProps {
  cdnUrl?: string;
}

export function AnimeShowcase({
  cdnUrl = OPHIM_CONFIG.CDN_IMAGE_URL,
}: AnimeShowcaseProps) {
  const { data, isLoading } = useMovieList("hoat-hinh", { limit: 12, page: 1 });
  const movies = data?.items ?? [];

  const [selectedIdx, setSelectedIdx] = useState(0);
  const featured = movies[selectedIdx];

  const { data: detailData } = useMovieDetail(featured?.slug ?? "");
  const detail = detailData?.item;
  const description = detail?.content
    ? detail.content.replace(/<[^>]*>/g, "").trim()
    : null;
  const imdbScore = detail?.imdb?.vote_average
    ? detail.imdb.vote_average.toFixed(1)
    : detail?.tmdb?.vote_average
    ? detail.tmdb.vote_average.toFixed(1)
    : null;

  if (isLoading) return <AnimeShowcaseSkeleton />;
  if (!featured) return null;

  return (
    <div>
      {/* Section header */}
      <div className="mb-4 flex items-center gap-3">
        <h2 className="text-lg font-bold text-white md:text-xl">
          Kho Tàng Anime Mới Nhất
        </h2>
        <Link
          href="/danh-sach/hoat-hinh"
          className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-white/60 transition-colors hover:border-white/50 hover:text-white"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>

      {/* Main card */}
      <div className="overflow-hidden rounded-2xl bg-[#16213e]">
        {/* ── Desktop (md+): side-by-side ── */}
        <div className="hidden md:flex" style={{ minHeight: 360 }}>
          {/* Info panel */}
          <div className="relative z-10 flex w-[42%] shrink-0 flex-col justify-center px-8 py-8 xl:w-[38%]">
            <h3 className="mb-1 line-clamp-2 text-2xl font-bold leading-tight text-white xl:text-3xl">
              {featured.name}
            </h3>
            {featured.origin_name && (
              <p className="mb-4 text-sm font-medium text-[#f5a623]">
                {featured.origin_name}
              </p>
            )}
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {imdbScore && (
                <span className="flex items-center gap-1 rounded border border-[#f5c518] bg-[#f5c518]/10 px-2 py-0.5 text-xs font-bold text-[#f5c518]">
                  IMDb {imdbScore}
                </span>
              )}
              {detail?.quality && (
                <span className="rounded border border-white/20 bg-white/5 px-2 py-0.5 text-xs font-semibold text-white">
                  {detail.quality}
                </span>
              )}
              {(detail?.year ?? featured.year) && (
                <span className="rounded border border-white/20 bg-white/5 px-2 py-0.5 text-xs font-semibold text-white">
                  {detail?.year ?? featured.year}
                </span>
              )}
              {detail?.time && (
                <span className="rounded border border-white/20 bg-white/5 px-2 py-0.5 text-xs font-semibold text-white">
                  {detail.time}
                </span>
              )}
            </div>
            {detail?.category && detail.category.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-1.5">
                {detail.category.slice(0, 4).map((c) => (
                  <Link
                    key={c.slug}
                    href={`/the-loai/${c.slug}`}
                    className="rounded bg-white/5 px-2.5 py-1 text-xs text-[#d1d5db] transition-colors hover:bg-white/10 hover:text-white"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
            {description && (
              <p className="mb-6 line-clamp-4 text-sm leading-relaxed text-[#9ca3af]">
                {description}
              </p>
            )}
            <div className="flex items-center gap-3">
              <Link
                href={`/phim/${featured.slug}`}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f5a623] text-white shadow-lg shadow-[#f5a623]/30 transition-transform hover:scale-105"
              >
                <PlayIcon />
              </Link>
              <button className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-colors hover:bg-white/10">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
              <button className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-colors hover:bg-white/10">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Backdrop panel */}
          <div className="relative flex-1 overflow-hidden">
            <div className="absolute inset-y-0 left-0 z-10 w-40 bg-linear-to-r from-[#16213e] to-transparent" />
            <div className="absolute inset-0 z-10 bg-linear-to-t from-[#16213e]/50 via-transparent to-transparent" />
            <FeaturedBackdrop movie={featured} cdnUrl={cdnUrl} />
          </div>
        </div>

        {/* ── Mobile: stacked ── */}
        <div className="md:hidden">
          {/* Backdrop */}
          <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
            <FeaturedBackdrop movie={featured} cdnUrl={cdnUrl} />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-[#16213e] to-transparent" />
            <Link
              href={`/phim/${featured.slug}`}
              className="absolute bottom-3 right-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[#f5a623] text-white shadow-lg shadow-[#f5a623]/40 transition-transform active:scale-95"
            >
              <PlayIcon />
            </Link>
          </div>
          {/* Info below */}
          <div className="px-4 pb-3 pt-3">
            <h3 className="mb-0.5 line-clamp-2 text-lg font-bold leading-tight text-white">
              {featured.name}
            </h3>
            {featured.origin_name && (
              <p className="mb-2 text-xs font-medium text-[#f5a623]">
                {featured.origin_name}
              </p>
            )}
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              {imdbScore && (
                <span className="flex items-center gap-1 rounded border border-[#f5c518] bg-[#f5c518]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#f5c518]">
                  IMDb {imdbScore}
                </span>
              )}
              {detail?.quality && (
                <span className="rounded border border-white/20 bg-white/5 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  {detail.quality}
                </span>
              )}
              {(detail?.year ?? featured.year) && (
                <span className="rounded border border-white/20 bg-white/5 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  {detail?.year ?? featured.year}
                </span>
              )}
              {detail?.time && (
                <span className="rounded border border-white/20 bg-white/5 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  {detail.time}
                </span>
              )}
            </div>
            {detail?.category && detail.category.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {detail.category.slice(0, 3).map((c) => (
                  <Link
                    key={c.slug}
                    href={`/the-loai/${c.slug}`}
                    className="rounded bg-white/5 px-2 py-0.5 text-[10px] text-[#d1d5db]"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Thumbnail strip (shared) ── */}
        <div
          className="flex gap-2 overflow-x-auto px-4 pb-4 pt-2 md:gap-3 md:px-6 md:pb-5 md:pt-3"
          style={{ scrollbarWidth: "none" }}
        >
          {movies.map((movie, idx) => (
            <button
              key={movie._id}
              onClick={() => setSelectedIdx(idx)}
              className="group shrink-0 transition-transform hover:scale-105"
              style={{ width: 60 }}
            >
              <div
                className="relative overflow-hidden rounded-lg transition-all"
                style={{
                  aspectRatio: "2/3",
                  outline:
                    idx === selectedIdx
                      ? "2px solid #f5a623"
                      : "2px solid transparent",
                  outlineOffset: 2,
                }}
              >
                <MovieCardImage movie={movie} cdnUrl={cdnUrl} />
                {idx !== selectedIdx && (
                  <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:bg-black/0" />
                )}
              </div>
              <p className="mt-1 line-clamp-2 text-center text-[10px] leading-tight text-[#9ca3af] group-hover:text-white">
                {movie.name}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Skeleton ───────────────────────────────────────────────────────────────────

function AnimeShowcaseSkeleton() {
  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <div className="h-7 w-56 animate-pulse rounded bg-white/10" />
      </div>
      <div className="overflow-hidden rounded-2xl bg-[#16213e]">
        {/* Desktop skeleton */}
        <div className="hidden md:flex" style={{ minHeight: 360 }}>
          <div className="flex w-[42%] shrink-0 flex-col justify-center gap-4 px-8 py-8">
            <div className="h-8 w-4/5 animate-pulse rounded bg-white/10" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-white/10" />
            <div className="flex gap-2">
              {[56, 40, 56, 72].map((w, i) => (
                <div
                  key={i}
                  className="h-6 animate-pulse rounded bg-white/10"
                  style={{ width: w }}
                />
              ))}
            </div>
            <div className="space-y-2">
              {[1, 0.85, 0.7, 0.55].map((w, i) => (
                <div
                  key={i}
                  className="h-3 animate-pulse rounded bg-white/10"
                  style={{ width: `${w * 100}%` }}
                />
              ))}
            </div>
            <div className="flex gap-3">
              <div className="h-11 w-11 animate-pulse rounded-full bg-white/10" />
              <div className="h-11 w-11 animate-pulse rounded-full bg-white/10" />
              <div className="h-11 w-11 animate-pulse rounded-full bg-white/10" />
            </div>
          </div>
          <div className="flex-1 animate-pulse bg-white/5" />
        </div>
        {/* Mobile skeleton */}
        <div className="md:hidden">
          <div
            className="w-full animate-pulse bg-white/10"
            style={{ aspectRatio: "16/9" }}
          />
          <div className="flex flex-col gap-2 px-4 pb-3 pt-3">
            <div className="h-6 w-4/5 animate-pulse rounded bg-white/10" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-white/10" />
            <div className="flex gap-1.5">
              {[50, 36, 50].map((w, i) => (
                <div
                  key={i}
                  className="h-5 animate-pulse rounded bg-white/10"
                  style={{ width: w }}
                />
              ))}
            </div>
          </div>
        </div>
        {/* Thumbnail strip */}
        <div className="flex gap-2 px-4 pb-4 pt-2 md:gap-3 md:px-6 md:pb-5 md:pt-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="shrink-0 animate-pulse rounded-lg bg-white/10"
              style={{ width: 60, aspectRatio: "2/3" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
