"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { MOVIE_LIST_SLUGS } from "@/constants/ophim";
import {
  useCategories,
  useCountries,
  useSearchMovies,
} from "@/hooks/useOphimQueries";
import { MovieCardImage } from "@/components/movie/MovieCardImage";
import type { MovieItem } from "@/types/ophim";

const NAV_ITEMS = [
  { label: "Phim Mới", href: `/danh-sach/${MOVIE_LIST_SLUGS.NEW}` },
  { label: "Phim Bộ", href: `/danh-sach/${MOVIE_LIST_SLUGS.SERIES}` },
  { label: "Phim Lẻ", href: `/danh-sach/${MOVIE_LIST_SLUGS.SINGLE}` },
  { label: "Hoạt Hình", href: `/danh-sach/${MOVIE_LIST_SLUGS.ANIMATION}` },
  { label: "TV Shows", href: `/danh-sach/${MOVIE_LIST_SLUGS.TV_SHOWS}` },
  { label: "Chiếu Rạp", href: `/danh-sach/${MOVIE_LIST_SLUGS.THEATER}` },
];

function ChevronDown() {
  return (
    <svg
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}

interface DropdownMenuProps {
  label: string;
  items: { name: string; slug: string }[];
  basePath: string;
  columns?: number;
}

function DropdownMenu({
  label,
  items,
  basePath,
  columns = 4,
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    []
  );

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`flex items-center gap-1 rounded px-3 py-1.5 text-[15px] font-light transition-colors hover:bg-white/10 hover:text-white ${
          open ? "bg-white/10 text-white" : "text-white"
        }`}
      >
        {label}
        <span
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          <ChevronDown />
        </span>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-max min-w-130 rounded-xl border border-white/10 bg-[#191b24]/95 p-5 shadow-2xl shadow-black/60 backdrop-blur-md">
          <div
            className="grid gap-x-8 gap-y-1"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
          >
            {items.map((item) => (
              <Link
                key={item.slug}
                href={`${basePath}/${item.slug}`}
                onClick={() => setOpen(false)}
                className="rounded px-2 py-1.5 text-[15px] font-light text-white transition-colors hover:bg-white/10 hover:text-white"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Search suggestion item ── */
function SearchSuggestionItem({
  movie,
  onClick,
}: {
  movie: MovieItem;
  onClick: () => void;
}) {
  return (
    <Link
      href={`/phim/${movie.slug}`}
      onClick={onClick}
      className="group/item flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-white/10"
    >
      <div className="relative h-16 w-11 shrink-0 overflow-hidden rounded bg-[#2a2d3e]">
        <MovieCardImage movie={movie} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 text-sm font-medium text-white">
          {movie.name}
        </p>
        <p className="line-clamp-1 text-xs text-[#a3a3a3]">
          {movie.origin_name}
        </p>
        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-[#6b7280]">
          {movie.year > 0 && <span>{movie.year}</span>}
          {movie.quality && (
            <span className="rounded bg-[#e50914]/80 px-1 py-px text-[10px] text-white">
              {movie.quality}
            </span>
          )}
          {movie.episode_current && <span>{movie.episode_current}</span>}
        </div>
      </div>
    </Link>
  );
}

/* ── Debounce hook ── */
function useDebounce(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(searchQuery, 400);

  const { data: categoriesData } = useCategories();
  const { data: countriesData } = useCountries();
  const { data: searchData, isFetching: isSearching } = useSearchMovies({
    keyword: debouncedQuery,
    limit: 8,
  });

  const categories = categoriesData?.items ?? [];
  const countries = countriesData?.items ?? [];
  const suggestions = searchData?.items ?? [];
  const showSuggestions = searchFocused && debouncedQuery.length >= 2;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(e.target as Node) &&
        mobileSearchContainerRef.current &&
        !mobileSearchContainerRef.current.contains(e.target as Node)
      ) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const closeSuggestions = useCallback(() => {
    setSearchFocused(false);
    setSearchQuery("");
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length < 2) return;
    setSearchFocused(false);
    setMobileSearchOpen(false);
    router.push(`/tim-kiem?keyword=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-colors duration-300 ${
        scrolled ? "bg-[#191b24] shadow-lg shadow-black/40" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-14 items-center gap-0 px-3 md:h-16 md:gap-4 md:px-4 xl:px-8">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5a623] md:h-12 md:w-12">
            <svg
              className="ml-0.5 h-3.5 w-3.5 text-white md:h-4 md:w-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[17px] font-black tracking-tight text-white md:text-[20px]">
              Locsonhg<span className="text-[#f5a623]">Phim</span>
            </span>
            <span className="hidden text-[13px] text-[#a3a3a3] sm:block md:text-[15px]">
              Phim hay từ HG
            </span>
          </div>
        </Link>

        {/* Mobile flex spacer — pushes actions to the right on mobile */}
        <div className="flex-1 md:hidden" />

        {/* Search bar with autocomplete */}
        <div
          ref={desktopSearchRef}
          className="relative hidden md:block md:ml-4"
        >
          <form onSubmit={handleSearch}>
            <div
              className={`flex h-9 w-85 items-center gap-2 rounded-xs border px-3 transition-all focus-within:border-[#f5a623]/60 ${
                scrolled
                  ? "border-[#3a3a3a] bg-[#1c1c1c]"
                  : "border-white/20 bg-black/30 backdrop-blur-sm"
              }`}
            >
              <svg
                className="h-4 w-4 shrink-0 text-[#6b7280]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                placeholder="Tìm kiếm phim, diễn viên"
                className="flex-1 bg-transparent text-sm text-white placeholder-[#6b7280] outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-[#6b7280] transition-colors hover:text-white"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
              {isSearching && debouncedQuery.length >= 2 && (
                <div className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-[#6b7280] border-t-[#f5a623]" />
              )}
            </div>
          </form>

          {/* Search suggestions dropdown */}
          {showSuggestions && (
            <div className="absolute left-0 top-full z-50 mt-2 w-105 overflow-hidden rounded-xl border border-white/10 bg-[#191b24]/98 shadow-2xl shadow-black/60 backdrop-blur-md">
              {suggestions.length > 0 ? (
                <>
                  <div className="max-h-105 overflow-y-auto p-2">
                    {suggestions.map((movie) => (
                      <SearchSuggestionItem
                        key={movie._id}
                        movie={movie}
                        onClick={closeSuggestions}
                      />
                    ))}
                  </div>
                  <Link
                    href={`/tim-kiem?keyword=${encodeURIComponent(
                      debouncedQuery
                    )}`}
                    onClick={closeSuggestions}
                    className="flex items-center justify-center gap-1.5 border-t border-white/10 px-4 py-3 text-sm text-[#f5a623] transition-colors hover:bg-white/5"
                  >
                    Xem tất cả kết quả cho &ldquo;{debouncedQuery}&rdquo;
                    <svg
                      className="h-3.5 w-3.5"
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
                </>
              ) : !isSearching ? (
                <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
                  <svg
                    className="h-10 w-10 text-[#3a3a3a]"
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
                  <p className="text-sm text-[#6b7280]">
                    Không tìm thấy kết quả cho &ldquo;{debouncedQuery}&rdquo;
                  </p>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Desktop Nav */}
        <nav className="hidden flex-1 items-center gap-4 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded px-3 py-1.5 text-[15px] font-light text-white transition-colors hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}

          {/* Thể loại dropdown */}
          {categories.length > 0 && (
            <DropdownMenu
              label="Thể loại"
              items={categories}
              basePath="/the-loai"
              columns={4}
            />
          )}

          {/* Quốc gia dropdown */}
          {countries.length > 0 && (
            <DropdownMenu
              label="Quốc gia"
              items={countries}
              basePath="/quoc-gia"
              columns={4}
            />
          )}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Mobile search icon */}
          <button
            className="rounded p-1.5 text-[#a3a3a3] transition-colors hover:text-white md:hidden"
            onClick={() => {
              setMobileSearchOpen((v) => !v);
              setMobileOpen(false);
              setTimeout(() => mobileSearchRef.current?.focus(), 50);
            }}
            aria-label="Tìm kiếm"
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
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          {/* Thành viên button */}
          <button className="hidden items-center gap-1.5 rounded-full border border-white/30 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:border-white/60 hover:bg-white/10 md:flex">
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Thành viên
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded p-2 text-[#a3a3a3] transition-colors hover:bg-white/5 hover:text-white md:hidden"
            aria-label="Menu"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      {mobileSearchOpen && (
        <div
          ref={mobileSearchContainerRef}
          className="border-t border-white/5 bg-[#191b24]/95 px-4 py-3 backdrop-blur-sm md:hidden"
        >
          <form
            onSubmit={(e) => {
              handleSearch(e);
              setMobileSearchOpen(false);
            }}
            className="flex items-center gap-2 rounded-lg border border-[#3a3a3a] bg-[#1c1c1c] px-3 py-2"
          >
            <svg
              className="h-4 w-4 shrink-0 text-[#6b7280]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref={mobileSearchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder="Tìm kiếm phim, diễn viên..."
              className="flex-1 bg-transparent text-sm text-white placeholder-[#6b7280] outline-none"
            />
            {isSearching && debouncedQuery.length >= 2 && (
              <div className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-[#6b7280] border-t-[#f5a623]" />
            )}
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-[#6b7280] hover:text-white"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </form>

          {/* Mobile search suggestions */}
          {showSuggestions && (
            <div className="mt-2 max-h-[60vh] overflow-y-auto rounded-xl border border-white/10 bg-[#191b24] p-2">
              {suggestions.length > 0 ? (
                <>
                  {suggestions.map((movie) => (
                    <SearchSuggestionItem
                      key={movie._id}
                      movie={movie}
                      onClick={() => {
                        closeSuggestions();
                        setMobileSearchOpen(false);
                      }}
                    />
                  ))}
                  <Link
                    href={`/tim-kiem?keyword=${encodeURIComponent(
                      debouncedQuery
                    )}`}
                    onClick={() => {
                      closeSuggestions();
                      setMobileSearchOpen(false);
                    }}
                    className="mt-1 flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm text-[#f5a623] transition-colors hover:bg-white/5"
                  >
                    Xem tất cả kết quả
                    <svg
                      className="h-3.5 w-3.5"
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
                </>
              ) : !isSearching ? (
                <p className="py-6 text-center text-sm text-[#6b7280]">
                  Không tìm thấy kết quả
                </p>
              ) : null}
            </div>
          )}
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/5 bg-[#191b24] px-4 py-3 md:hidden">
          <form onSubmit={handleSearch} className="mb-3">
            <div className="flex h-9 items-center gap-2 rounded-full border border-[#3a3a3a] bg-[#1c1c1c] px-3">
              <svg
                className="h-4 w-4 shrink-0 text-[#6b7280]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm phim, diễn viên"
                className="flex-1 bg-transparent text-sm text-white placeholder-[#6b7280] outline-none"
              />
            </div>
          </form>
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded px-3 py-2 text-sm font-medium text-[#a3a3a3] transition-colors hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            {/* Mobile: Thể loại */}
            {categories.length > 0 && (
              <details className="group">
                <summary className="cursor-pointer list-none rounded px-3 py-2 text-sm font-medium text-[#a3a3a3] hover:bg-white/5 hover:text-white">
                  Thể loại
                </summary>
                <div className="mt-1 grid grid-cols-2 gap-0.5 pl-3">
                  {categories.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/the-loai/${c.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="rounded px-2 py-1.5 text-xs text-[#a3a3a3] hover:text-white"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </details>
            )}
            {/* Mobile: Quốc gia */}
            {countries.length > 0 && (
              <details className="group">
                <summary className="cursor-pointer list-none rounded px-3 py-2 text-sm font-medium text-[#a3a3a3] hover:bg-white/5 hover:text-white">
                  Quốc gia
                </summary>
                <div className="mt-1 grid grid-cols-2 gap-0.5 pl-3">
                  {countries.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/quoc-gia/${c.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="rounded px-2 py-1.5 text-xs text-[#a3a3a3] hover:text-white"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </details>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
