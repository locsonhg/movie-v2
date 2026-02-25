"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import type { MovieItem } from "@/types/ophim";
import { OPHIM_CONFIG } from "@/constants/ophim";
import { MovieCardImage } from "./MovieCardImage";
import { useMovieList } from "@/hooks/useOphimQueries";

// ── Rank number ───────────────────────────────────────────────────────────────

function RankNumber({ rank }: { rank: number }) {
  const isTop3 = rank <= 3;
  const style: React.CSSProperties = isTop3
    ? {
        background: "linear-gradient(175deg, #fde68a 0%, #d97706 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        fontStyle: "italic",
      }
    : {
        background: "linear-gradient(175deg, #d1d5db 0%, #6b7280 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        fontStyle: "italic",
      };

  return (
    <span
      className="shrink-0 select-none font-black leading-none"
      style={{ fontSize: "clamp(56px, 6vw, 80px)", lineHeight: 1, ...style }}
    >
      {rank}
    </span>
  );
}

// ── Badges ────────────────────────────────────────────────────────────────────

function Badges({ movie }: { movie: MovieItem }) {
  const badges: { label: string; bg: string }[] = [];
  if (movie.quality) badges.push({ label: movie.quality, bg: "#d97706" });
  if (movie.lang) {
    const raw = movie.lang;
    const label = raw.includes("Thuyết")
      ? "Thuyết minh"
      : raw.includes("Lồng")
      ? "Lồng tiếng"
      : raw.includes("Vietsub") || raw.includes("Sub")
      ? "Vietsub"
      : raw;
    badges.push({ label, bg: "#16a34a" });
  }
  if (movie.episode_current)
    badges.push({ label: movie.episode_current, bg: "#2563eb" });
  if (!badges.length) return null;
  return (
    <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
      {badges.map((b) => (
        <span
          key={b.label}
          className="rounded px-1.5 py-0.5 text-[10px] font-bold text-white"
          style={{ backgroundColor: b.bg + "e0" }}
        >
          {b.label}
        </span>
      ))}
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────

function Top10Card({
  movie,
  rank,
  cdnUrl,
}: {
  movie: MovieItem;
  rank: number;
  cdnUrl: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="shrink-0"
      style={{ width: 210 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/phim/${movie.slug}`} className="block">
        {/* Poster */}
        <div
          className="relative w-full overflow-hidden rounded-xl bg-[#22253a]"
          style={{
            aspectRatio: "2/3",
            boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
            transform: hovered ? "scale(1.04)" : "scale(1)",
            transition: "transform 0.25s ease",
          }}
        >
          <MovieCardImage movie={movie} cdnUrl={cdnUrl} />
          <Badges movie={movie} />
          <div
            className="absolute inset-0 rounded-xl"
            style={{
              background: hovered ? "rgba(0,0,0,0.2)" : "transparent",
              transition: "background 0.2s",
            }}
          />
          {hovered && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg">
                <svg
                  className="ml-0.5 h-5 w-5 text-black"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Rank + info */}
        <div className="mt-2 flex items-end gap-1.5" style={{ width: 210 }}>
          <RankNumber rank={rank} />
          <div className="min-w-0 flex-1 pb-1">
            <p
              className="line-clamp-2 text-[13px] font-bold leading-snug"
              style={{
                color: hovered ? "#f5a623" : "white",
                transition: "color 0.2s",
              }}
            >
              {movie.name}
            </p>
            {movie.origin_name && (
              <p className="mt-0.5 truncate text-[11px] text-[#6b7280]">
                {movie.origin_name}
              </p>
            )}
            <div className="mt-0.5 flex flex-wrap items-center gap-x-1 text-[11px] text-[#9ca3af]">
              {movie.year && <span>{movie.year}</span>}
              {movie.year && movie.episode_current && (
                <span className="text-[#4b5563]">·</span>
              )}
              {movie.episode_current && (
                <span className="truncate">{movie.episode_current}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function Top10CardSkeleton({ rank }: { rank: number }) {
  return (
    <div className="shrink-0" style={{ width: 210 }}>
      <div
        className="w-full animate-pulse rounded-xl bg-[#22253a]"
        style={{ aspectRatio: "2/3" }}
      />
      <div className="mt-2 flex items-end gap-1.5">
        <RankNumber rank={rank} />
        <div className="flex-1 space-y-1.5 pb-1">
          <div className="h-3 w-full animate-pulse rounded bg-[#22253a]" />
          <div className="h-3 w-3/4 animate-pulse rounded bg-[#22253a]" />
          <div className="h-2.5 w-1/2 animate-pulse rounded bg-[#22253a]" />
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

interface Top10SliderProps {
  title?: string;
  slug?: string;
  cdnUrl?: string;
}

export function Top10Slider({
  title = "Top 10 phim bộ hôm nay",
  slug = "phim-bo",
  cdnUrl = OPHIM_CONFIG.CDN_IMAGE_URL,
}: Top10SliderProps) {
  const { data, isLoading } = useMovieList(slug, { limit: 10, page: 1 });
  const movies = (data?.items ?? []).slice(0, 10);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScroll();
    el.addEventListener("scroll", updateScroll, { passive: true });
    const ro = new ResizeObserver(updateScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScroll);
      ro.disconnect();
    };
  }, [movies.length]);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -660 : 660,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white md:text-xl">{title}</h2>
        <Link
          href={`/danh-sach/${slug}`}
          className="text-sm text-[#f5a623] hover:underline"
        >
          Xem tất cả →
        </Link>
      </div>

      {/* Slider */}
      <div className="relative">
        {/* Left arrow */}
        <button
          onClick={() => scroll("left")}
          aria-label="Cuộn trái"
          className={`absolute -left-4 top-[38%] z-50 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#22253a]/90 text-white shadow-xl ring-1 ring-white/10 transition-all hover:bg-[#2d3147] hover:scale-110 ${
            canScrollLeft ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Scrollable track */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-3"
          style={{ scrollbarWidth: "none" }}
        >
          {isLoading
            ? Array.from({ length: 10 }, (_, i) => (
                <Top10CardSkeleton key={i} rank={i + 1} />
              ))
            : movies.map((movie, idx) => (
                <Top10Card
                  key={movie._id}
                  movie={movie}
                  rank={idx + 1}
                  cdnUrl={cdnUrl}
                />
              ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll("right")}
          aria-label="Cuộn phải"
          className={`absolute -right-4 top-[38%] z-50 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#22253a]/90 text-white shadow-xl ring-1 ring-white/10 transition-all hover:bg-[#2d3147] hover:scale-110 ${
            canScrollRight ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
