"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { useSearchMovies } from "@/hooks/useOphimQueries";
import { MovieCard } from "@/components/movie/MovieCard";
import { MovieCardSkeleton } from "@/components/movie/MovieCardSkeleton";

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const keyword = searchParams.get("keyword") ?? "";
  const pageParam = Number(searchParams.get("page")) || 1;

  const [page, setPage] = useState(pageParam);

  // Sync page state with URL
  useEffect(() => {
    setPage(pageParam);
  }, [pageParam]);

  const { data, isLoading, isFetching } = useSearchMovies({
    keyword,
    page,
    limit: 24,
  });

  const movies = data?.items ?? [];
  const totalItems = data?.params?.pagination?.totalItems ?? 0;
  const totalPages = data?.params?.pagination?.totalPages ?? 1;

  const goToPage = (p: number) => {
    setPage(p);
    router.push(`/tim-kiem?keyword=${encodeURIComponent(keyword)}&page=${p}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Build pagination range
  const buildPages = () => {
    const pages: (number | "...")[] = [];
    const delta = 2;
    const left = Math.max(2, page - delta);
    const right = Math.min(totalPages - 1, page + delta);

    pages.push(1);
    if (left > 2) pages.push("...");
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  if (!keyword || keyword.length < 2) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <svg
          className="h-20 w-20 text-[#3a3a3a]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <h2 className="text-xl font-semibold text-white">Tìm kiếm phim</h2>
        <p className="max-w-md text-sm text-[#a3a3a3]">
          Nhập từ khóa (ít nhất 2 ký tự) để tìm kiếm phim, diễn viên, đạo
          diễn...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">
          Kết quả tìm kiếm: &ldquo;{keyword}&rdquo;
        </h1>
        {!isLoading && (
          <p className="mt-1 text-sm text-[#a3a3a3]">
            Tìm thấy {totalItems} kết quả
          </p>
        )}
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 24 }).map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      ) : movies.length === 0 ? (
        /* Empty state */
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
          <svg
            className="h-16 w-16 text-[#3a3a3a]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-lg font-semibold text-white">
            Không tìm thấy kết quả
          </h2>
          <p className="max-w-md text-sm text-[#a3a3a3]">
            Không có phim nào khớp với từ khóa &ldquo;{keyword}&rdquo;. Hãy thử
            tìm kiếm với từ khóa khác.
          </p>
        </div>
      ) : (
        <>
          {/* Movie grid */}
          <div
            className={`grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 ${
              isFetching ? "opacity-60" : ""
            }`}
          >
            {movies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-1.5">
              {/* Prev */}
              <button
                disabled={page <= 1}
                onClick={() => goToPage(page - 1)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-sm text-[#a3a3a3] transition-colors hover:border-[#f5a623]/50 hover:text-white disabled:pointer-events-none disabled:opacity-30"
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Page numbers */}
              {buildPages().map((p, idx) =>
                p === "..." ? (
                  <span
                    key={`dots-${idx}`}
                    className="flex h-9 w-9 items-center justify-center text-sm text-[#6b7280]"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => goToPage(p as number)}
                    className={`flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm font-medium transition-colors ${
                      p === page
                        ? "border-[#f5a623] bg-[#f5a623]/10 text-[#f5a623]"
                        : "border-white/10 text-[#a3a3a3] hover:border-[#f5a623]/50 hover:text-white"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

              {/* Next */}
              <button
                disabled={page >= totalPages}
                onClick={() => goToPage(page + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-sm text-[#a3a3a3] transition-colors hover:border-[#f5a623]/50 hover:text-white disabled:pointer-events-none disabled:opacity-30"
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
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-[#111319] pt-20">
      <Suspense
        fallback={
          <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
            <div className="mb-6">
              <div className="h-8 w-64 animate-pulse rounded bg-[#22253a]" />
              <div className="mt-2 h-4 w-32 animate-pulse rounded bg-[#22253a]" />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {Array.from({ length: 24 }).map((_, i) => (
                <MovieCardSkeleton key={i} />
              ))}
            </div>
          </div>
        }
      >
        <SearchResults />
      </Suspense>
    </div>
  );
}
