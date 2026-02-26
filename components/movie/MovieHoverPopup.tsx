"use client";

import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import type { MovieItem } from "@/types/ophim";
import { MovieCardImage } from "./MovieCardImage";
import { useMovieDetail } from "@/hooks/useOphimQueries";
import { OPHIM_CONFIG } from "@/constants/ophim";

// ── Hook: hover with enter/leave delay ───────────────────────────────────────

export function useMovieHover(enterDelay = 500, leaveDelay = 300) {
  const [showPopup, setShowPopup] = useState(false);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelTimers = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    hoverTimerRef.current = setTimeout(() => setShowPopup(true), enterDelay);
  }, [enterDelay]);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    leaveTimerRef.current = setTimeout(() => setShowPopup(false), leaveDelay);
  }, [leaveDelay]);

  const handlePopupEnter = useCallback(() => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => cancelTimers();
  }, [cancelTimers]);

  return {
    showPopup,
    handleMouseEnter,
    handleMouseLeave,
    handlePopupEnter,
  };
}

// ── Popup Component ──────────────────────────────────────────────────────────

interface MovieHoverPopupProps {
  movie: MovieItem;
  cdnUrl?: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function MovieHoverPopup({
  movie,
  cdnUrl = OPHIM_CONFIG.CDN_IMAGE_URL,
  onMouseEnter,
  onMouseLeave,
}: MovieHoverPopupProps) {
  const { data: detailData } = useMovieDetail(movie.slug);
  const detail = detailData?.item;
  const imdbScore = detail?.imdb?.vote_average;
  const tmdbScore = detail?.tmdb?.vote_average;
  const score = imdbScore || tmdbScore;
  const scoreLabel = imdbScore ? "IMDb" : "TMDb";
  const genres = detail?.category ?? movie.category ?? [];
  const rawTime = detail?.time ?? movie.time;
  const validTime = rawTime && !rawTime.includes("?") ? rawTime : null;
  const year = detail?.year ?? movie.year;

  const POPUP_WIDTH = 380;

  // Callback ref — runs synchronously on mount, before paint
  const positionRef = useCallback((popup: HTMLDivElement | null) => {
    if (!popup) return;
    const parent = popup.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const cardCenter = rect.left + rect.width / 2;
    const viewportWidth = window.innerWidth;
    const halfPopup = POPUP_WIDTH / 2;
    const margin = 12;

    if (cardCenter - halfPopup < margin) {
      popup.style.left = "0px";
      popup.style.right = "";
      popup.style.transform = "none";
    } else if (cardCenter + halfPopup > viewportWidth - margin) {
      popup.style.left = "auto";
      popup.style.right = "0px";
      popup.style.transform = "none";
    } else {
      popup.style.left = "50%";
      popup.style.right = "";
      popup.style.transform = "translateX(-50%)";
    }
  }, []);

  return (
    <div
      ref={positionRef}
      className="absolute top-0 z-50 hidden md:block"
      style={{
        width: POPUP_WIDTH,
        animation: "popupFadeIn 0.2s ease-out",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className="overflow-hidden rounded-xl bg-[#303346]"
        style={{
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.08)",
        }}
      >
        {/* Backdrop image */}
        <div className="relative aspect-video w-full overflow-hidden">
          <MovieCardImage movie={movie} cdnUrl={cdnUrl} variant="backdrop" />
          <div
            className="absolute inset-x-0 bottom-0 h-24"
            style={{
              background:
                "linear-gradient(to top, #303346 0%, transparent 100%)",
            }}
          />
        </div>

        {/* Content */}
        <div className="-mt-2 px-5 pb-5 pt-0">
          <h3 className="line-clamp-1 text-lg font-bold text-white">
            {movie.name}
          </h3>
          {movie.origin_name && (
            <p className="mt-0.5 line-clamp-1 text-sm text-[#f5a623]">
              {movie.origin_name}
            </p>
          )}

          {/* Action buttons */}
          <div className="mt-3.5 grid grid-cols-3 gap-2">
            <Link
              href={`/phim/${movie.slug}`}
              className="flex items-center justify-center gap-1.5 rounded-lg bg-[#f5a623] py-2.5 text-sm font-semibold text-white transition hover:bg-[#e6951a]"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Xem ngay
            </Link>
            <button className="flex items-center justify-center gap-1.5 rounded-lg border border-white/20 bg-white/5 py-2.5 text-sm text-white transition hover:border-white/30 hover:bg-white/10">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Thích
            </button>
            <Link
              href={`/phim/${movie.slug}`}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-white/20 bg-white/5 py-2.5 text-sm text-white transition hover:border-white/30 hover:bg-white/10"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
              Chi tiết
            </Link>
          </div>

          {/* Meta badges */}
          <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs">
            {score !== undefined && score > 0 && (
              <span className="rounded border border-[#f5c518]/50 bg-[#f5c518]/10 px-2 py-0.5 font-bold text-[#f5c518]">
                {scoreLabel} {score.toFixed(1)}
              </span>
            )}
            {year && (
              <span className="rounded border border-white/15 bg-white/5 px-2 py-0.5 text-[#a3a3a3]">
                {year}
              </span>
            )}
            {validTime && (
              <span className="rounded border border-white/15 bg-white/5 px-2 py-0.5 text-[#a3a3a3]">
                {validTime}
              </span>
            )}
          </div>

          {/* Genres */}
          {genres.length > 0 && (
            <p className="mt-3 line-clamp-1 text-[13px] text-[#9ca3af]">
              {genres.map((g) => g.name).join(" • ")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
