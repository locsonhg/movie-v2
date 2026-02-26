"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { MovieListData, FilterItem } from "@/types/ophim";
import { OPHIM_CONFIG } from "@/constants/ophim";
import { MovieCard } from "./MovieCard";
import { MovieCardSkeleton } from "./MovieCardSkeleton";

interface MovieGridPageProps {
  title: string;
  data: MovieListData | undefined;
  isLoading: boolean;
  cdnUrl?: string;
  onSortChange?: (sort: string) => void;
  currentSort?: string;
  categories?: FilterItem[];
  currentCategory?: string;
  onCategoryChange?: (category: string) => void;
  /** Controlled search input */
  nameSearch?: string;
  onNameSearchChange?: (v: string) => void;
}

const SORT_OPTIONS = [
  { label: "Mới cập nhật", value: "modified.time_desc" },
  { label: "Năm mới nhất", value: "year_desc" },
  { label: "Năm cũ nhất", value: "year_asc" },
];

export function MovieGridPage({
  title,
  data,
  isLoading,
  cdnUrl = OPHIM_CONFIG.CDN_IMAGE_URL,
  onSortChange,
  currentSort = "modified.time_desc",
  categories,
  currentCategory = "",
  onCategoryChange,
  nameSearch = "",
  onNameSearchChange,
}: MovieGridPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page") ?? "1");
  const totalItems = data?.params?.pagination?.totalItems ?? 0;
  const totalItemsPerPage = data?.params?.pagination?.totalItemsPerPage ?? 24;
  const totalPages =
    data?.params?.pagination?.totalPages ??
    (totalItems > 0 ? Math.ceil(totalItems / totalItemsPerPage) : 1);

  const movies = data?.items ?? [];

  const goToPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(page));
      router.push(`${pathname}?${params.toString()}`, { scroll: true });
    },
    [router, pathname, searchParams]
  );

  // Build page range for pagination
  const getPageRange = () => {
    const delta = 2;
    const range: (number | "...")[] = [];
    const left = Math.max(1, currentPage - delta);
    const right = Math.min(totalPages, currentPage + delta);

    if (left > 1) {
      range.push(1);
      if (left > 2) range.push("...");
    }
    for (let i = left; i <= right; i++) range.push(i);
    if (right < totalPages) {
      if (right < totalPages - 1) range.push("...");
      range.push(totalPages);
    }
    return range;
  };

  return (
    <div className="min-h-screen bg-[#191b24]">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-6 pt-20 md:pt-24 pb-10">
        {/* Header */}
        <div className="mb-5">
          <div className="flex items-center gap-3">
            <span className="h-6 w-1.5 rounded-full bg-[#e50914]" />
            <h1 className="text-2xl font-bold text-white">{title}</h1>
          </div>
          {totalItems > 0 && (
            <p className="mt-1 pl-4 text-sm text-[#6b7280]">
              {totalItems.toLocaleString()} phim
            </p>
          )}
        </div>

        {/* Filter bar */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          {/* Search by name */}
          <div className="relative flex-1 min-w-45 max-w-xs">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b7280]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35m0 0A7 7 0 104.65 4.65a7 7 0 0011.999 11.999z"
              />
            </svg>
            <input
              type="text"
              placeholder="Tìm trong danh sách..."
              value={nameSearch}
              onChange={(e) => onNameSearchChange?.(e.target.value)}
              className="h-9 w-full rounded-lg border border-white/10 bg-[#22253a] pl-9 pr-3 text-sm text-white placeholder-[#6b7280] outline-none focus:border-[#e50914] transition"
            />
          </div>

          {/* Category filter */}
          {categories && categories.length > 0 && (
            <select
              value={currentCategory}
              onChange={(e) => onCategoryChange?.(e.target.value)}
              className="h-9 rounded-lg border border-white/10 bg-[#22253a] px-3 text-sm text-[#a3a3a3] outline-none hover:border-white/20 focus:border-[#e50914] cursor-pointer"
            >
              <option value="">Tất cả thể loại</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          )}

          {/* Sort */}
          <select
            value={currentSort}
            onChange={(e) => onSortChange?.(e.target.value)}
            className="h-9 rounded-lg border border-white/10 bg-[#22253a] px-3 text-sm text-[#a3a3a3] outline-none hover:border-white/20 focus:border-[#e50914] cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8">
          {isLoading
            ? Array.from({ length: 24 }).map((_, i) => (
                <MovieCardSkeleton key={i} />
              ))
            : movies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} cdnUrl={cdnUrl} />
              ))}
        </div>

        {/* Empty state */}
        {!isLoading && movies.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <svg
              className="mb-4 h-16 w-16 text-[#3a3a3a]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
              />
            </svg>
            <p className="text-[#a3a3a3]">Không tìm thấy phim nào</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-1 flex-wrap">
            {/* Prev */}
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-[#22253a] text-[#a3a3a3] transition hover:border-[#e50914] hover:text-white disabled:pointer-events-none disabled:opacity-30"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {getPageRange().map((p, i) =>
              p === "..." ? (
                <span
                  key={`dot-${i}`}
                  className="flex h-9 w-9 items-center justify-center text-[#6b7280]"
                >
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => goToPage(p as number)}
                  className={[
                    "flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition",
                    p === currentPage
                      ? "border-[#e50914] bg-[#e50914] text-white"
                      : "border-white/10 bg-[#22253a] text-[#a3a3a3] hover:border-[#e50914] hover:text-white",
                  ].join(" ")}
                >
                  {p}
                </button>
              )
            )}

            {/* Next */}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-[#22253a] text-[#a3a3a3] transition hover:border-[#e50914] hover:text-white disabled:pointer-events-none disabled:opacity-30"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
