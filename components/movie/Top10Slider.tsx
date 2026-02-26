"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import type { MovieItem } from "@/types/ophim";
import { OPHIM_CONFIG } from "@/constants/ophim";
import { MovieCardImage } from "./MovieCardImage";
import { useMovieList } from "@/hooks/useOphimQueries";

// ── Rank number ───────────────────────────────────────────────────────────────

function RankBadge({ rank }: { rank: number }) {
  const isTop3 = rank <= 3;
  const colors = isTop3
    ? {
        bg: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
        text: "#fff",
        shadow: "0 4px 20px rgba(245,158,11,0.5)",
        border: "2px solid rgba(255,255,255,0.3)",
      }
    : {
        bg: "linear-gradient(135deg, #374151 0%, #1f2937 100%)",
        text: "#d1d5db",
        shadow: "0 4px 12px rgba(0,0,0,0.4)",
        border: "2px solid rgba(255,255,255,0.1)",
      };

  return (
    <div
      className="absolute bottom-3 left-3 z-20 flex h-12 w-12 items-center justify-center rounded-xl font-black select-none"
      style={{
        background: colors.bg,
        color: colors.text,
        boxShadow: colors.shadow,
        border: colors.border,
        fontSize: rank >= 10 ? "18px" : "22px",
        fontStyle: "italic",
      }}
    >
      {rank}
    </div>
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
    <div className="absolute bottom-2 left-16 z-10 flex flex-wrap gap-1">
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
  const isTop3 = rank <= 3;

  return (
    <div
      className="shrink-0"
      style={{ width: 260, overflow: "visible" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/phim/${movie.slug}`} className="group block">
        {/* Poster wrapper */}
        <div className="relative" style={{ overflow: "visible" }}>
          {/* Poster container */}
          <div
            className="relative w-full overflow-hidden"
            style={{
              aspectRatio: "2/3",
              borderRadius: "16px",
              boxShadow: isTop3
                ? hovered
                  ? "0 12px 40px rgba(245,158,11,0.35), 0 0 0 2px rgba(245,158,11,0.4)"
                  : "0 8px 28px rgba(245,158,11,0.2), 0 0 0 1px rgba(245,158,11,0.15)"
                : hovered
                ? "0 12px 40px rgba(0,0,0,0.7)"
                : "0 8px 24px rgba(0,0,0,0.5)",
              transition: "box-shadow 0.3s ease",
            }}
          >
            <MovieCardImage movie={movie} cdnUrl={cdnUrl} />

            {/* Bottom gradient for badges */}
            <div
              className="absolute inset-x-0 bottom-0 h-24"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
              }}
            />

            {/* Hover overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: hovered ? "rgba(0,0,0,0.15)" : "transparent",
                transition: "background 0.3s",
              }}
            />

            {/* Top 3 crown glow */}
            {isTop3 && (
              <div
                className="absolute inset-x-0 top-0 h-20"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(245,158,11,0.15) 0%, transparent 100%)",
                }}
              />
            )}

            <Badges movie={movie} />

            {/* Play button on hover */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                opacity: hovered ? 1 : 0,
                transition: "opacity 0.3s",
              }}
            >
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full backdrop-blur-sm"
                style={{
                  background: "rgba(245,166,35,0.9)",
                  boxShadow: "0 4px 20px rgba(245,166,35,0.5)",
                }}
              >
                <svg
                  className="ml-0.5 h-6 w-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Rank badge — outside overflow-hidden */}
          <RankBadge rank={rank} />
        </div>

        {/* Movie info — below poster */}
        <div className="mt-3 px-1">
          <p
            className="line-clamp-1 text-[16px] font-bold leading-snug"
            style={{
              color: hovered ? "#f5a623" : "white",
              transition: "color 0.2s",
            }}
          >
            {movie.name}
          </p>
          {movie.origin_name && (
            <p className="mt-1 truncate text-[12px] text-[#6b7280]">
              {movie.origin_name}
            </p>
          )}
          <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 text-[12px] text-[#9ca3af]">
            {movie.year && <span>{movie.year}</span>}
            {movie.year && movie.episode_current && (
              <span className="text-[#4b5563]">·</span>
            )}
            {movie.episode_current && (
              <span className="truncate">{movie.episode_current}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
// ── Skeleton ──────────────────────────────────────────────────────────────────

function Top10CardSkeleton({ rank }: { rank: number }) {
  return (
    <div className="shrink-0" style={{ width: 260 }}>
      <div
        className="relative w-full animate-pulse bg-[#22253a]"
        style={{
          aspectRatio: "2/3",
          borderRadius: "16px",
        }}
      >
        <RankBadge rank={rank} />
      </div>
      <div className="mt-7 space-y-1.5 px-1">
        <div className="h-4 w-3/4 animate-pulse rounded bg-[#22253a]" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-[#22253a]" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-[#22253a]" />
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
      left: dir === "left" ? -820 : 820,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="h-7 w-1.5 rounded-full"
            style={{
              background: "linear-gradient(to bottom, #f59e0b, #ef4444)",
            }}
          />
          <h2 className="text-xl font-bold text-white md:text-2xl">{title}</h2>
        </div>
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
          className="flex gap-4 pb-4 pt-3 pl-1"
          style={{
            scrollbarWidth: "none",
            overflowX: "auto",
            overflowY: "visible",
          }}
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
