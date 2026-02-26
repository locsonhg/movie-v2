"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useMovieDetail,
  useMovieImages,
  useMoviesByCategory,
  useMoviePeoples,
} from "@/hooks/useOphimQueries";
import { normalizeImageUrl, buildTmdbImageUrl } from "@/utils/image";
import { OPHIM_CONFIG } from "@/constants/ophim";
import { MovieCardImage } from "@/components/movie/MovieCardImage";

const CDN = OPHIM_CONFIG.CDN_IMAGE_URL;
const EPISODE_COLLAPSE = 30;

interface Props {
  slug: string;
}

export function WatchClient({ slug }: Props) {
  const router = useRouter();
  const { data, isLoading } = useMovieDetail(slug);
  const movie = data?.item;

  const [serverIdx, setServerIdx] = useState(0);
  const [epIdx, setEpIdx] = useState(0);
  const [collapsed, setCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState<"comment" | "review">("comment");

  const servers = movie?.episodes ?? [];
  const currentServer = servers[serverIdx];
  const episodes = currentServer?.server_data ?? [];
  const safeEpIdx = Math.min(epIdx, Math.max(0, episodes.length - 1));
  const currentEp = episodes[safeEpIdx] ?? null;
  const embedUrl = currentEp?.link_embed ?? "";

  const handleServerChange = (idx: number) => {
    setServerIdx(idx);
    setEpIdx(0);
  };

  const imdbScore = movie?.imdb?.vote_average
    ? movie.imdb.vote_average.toFixed(1)
    : movie?.tmdb?.vote_average
    ? movie.tmdb.vote_average.toFixed(1)
    : null;

  const description = movie?.content
    ? movie.content.replace(/<[^>]*>/g, "").trim()
    : "";

  const posterUrl = movie ? normalizeImageUrl(movie.poster_url, CDN) : null;

  // TMDB images for poster
  const { data: imagesData } = useMovieImages(slug);
  const tmdbPoster = imagesData?.images?.find((img) => img.type === "poster");
  const tmdbPosterUrl =
    tmdbPoster && imagesData
      ? buildTmdbImageUrl(
          imagesData.image_sizes,
          "poster",
          tmdbPoster.file_path,
          "w500"
        )
      : null;
  const displayPosterUrl = tmdbPosterUrl?.startsWith("http")
    ? tmdbPosterUrl
    : posterUrl;

  // Related movies
  const categorySlug = movie?.category?.[0]?.slug ?? "hanh-dong";
  const { data: relatedData } = useMoviesByCategory(categorySlug, { limit: 9 });
  const relatedMovies = useMemo(
    () => (relatedData?.items ?? []).filter((m) => m.slug !== slug).slice(0, 8),
    [relatedData, slug]
  );

  // Actors
  const { data: peoplesData } = useMoviePeoples(slug);
  const actors = peoplesData?.peoples?.filter((p) => p.character) ?? [];

  // Episodes display
  const displayEps = collapsed ? episodes.slice(0, EPISODE_COLLAPSE) : episodes;
  const hasMore = episodes.length > EPISODE_COLLAPSE;

  if (isLoading) return <WatchSkeleton />;
  if (!movie)
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-white/40">
        Không tìm thấy phim
      </div>
    );

  return (
    <div className="min-h-screen bg-[#191b24]">
      {/* ── Back bar ── */}
      <div className="flex items-center gap-3 px-4 pt-16 pb-3 md:px-6">
        <button
          onClick={() => router.back()}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/50 transition-colors hover:border-white/40 hover:text-white"
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
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <p className="truncate text-sm text-white/50">
            Xem phim{" "}
            <span className="font-semibold text-white">{movie.name}</span>
          </p>
          {currentEp && (
            <span className="shrink-0 rounded bg-[#f5a623] px-2 py-0.5 text-xs font-bold text-black">
              Tập {currentEp.name}
            </span>
          )}
        </div>
      </div>

      {/* ── Video section ── */}
      <div className="bg-[#0d0f18]">
        {/* Player */}
        <div className="md:px-[15%]">
          {embedUrl ? (
            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
              <iframe
                key={embedUrl}
                src={embedUrl}
                className="absolute inset-0 h-full w-full border-0"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              />
            </div>
          ) : (
            <div
              className="relative w-full bg-[#0a0b10]"
              style={{ paddingTop: "56.25%" }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/20">
                <svg
                  className="h-16 w-16"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm">Chọn tập để bắt đầu xem</span>
              </div>
            </div>
          )}
        </div>

        {/* Action bar */}
        <div className="px-4 py-3 md:px-[15%]">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {[
              { label: "Yêu thích", icon: <HeartIcon /> },
              { label: "Thêm vào", icon: <PlusIcon /> },
              { label: "Chuyển tập", icon: <ShuffleIcon />, badge: "ON" },
              { label: "Bỏ qua giới thiệu", icon: <SkipIcon />, badge: "OFF" },
              { label: "Rạp phim", icon: <CinemaIcon />, badge: "OFF" },
              { label: "Chia sẻ", icon: <ShareIcon /> },
              { label: "Báo lỗi", icon: <FlagIcon /> },
            ].map((item) => (
              <button
                key={item.label}
                className="flex items-center gap-1.5 text-xs text-white/40 transition-colors hover:text-white/80"
              >
                <span className="h-4 w-4">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`rounded px-1 py-0.5 text-[9px] font-bold ${
                      item.badge === "ON"
                        ? "bg-[#f5a623] text-black"
                        : "bg-white/10 text-white/30"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="px-3 py-6 md:px-[15%]">
        <div className="flex gap-6">
          {/* Left column */}
          <div className="min-w-0 flex-1 space-y-5">
            {/* Movie info card */}
            <div className="rounded-xl bg-[#1e2030] p-4 md:p-5">
              <div className="flex gap-4">
                {/* Poster */}
                {displayPosterUrl && (
                  <Link href={`/phim/${slug}`} className="shrink-0">
                    <div className="relative h-32 w-24 overflow-hidden rounded-xl shadow-lg md:h-36 md:w-28">
                      <Image
                        src={displayPosterUrl!}
                        alt={movie.name}
                        fill
                        sizes="(max-width: 768px) 96px, 112px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </Link>
                )}

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <h1 className="mb-0.5 text-lg font-bold leading-tight text-white md:text-xl">
                    {movie.name}
                  </h1>
                  {movie.origin_name && (
                    <p className="mb-3 text-sm font-medium text-[#f5a623]">
                      {movie.origin_name}
                    </p>
                  )}

                  {/* Badges */}
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {imdbScore && (
                      <span className="flex items-center gap-0.5 rounded border border-[#f5c518] bg-[#f5c518]/10 px-1.5 py-0.5 text-[11px] font-bold text-[#f5c518]">
                        IMDb {imdbScore}
                      </span>
                    )}
                    {movie.quality && (
                      <span className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                        {movie.quality}
                      </span>
                    )}
                    {movie.lang && (
                      <span className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                        {movie.lang}
                      </span>
                    )}
                    {movie.year && (
                      <span className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                        {movie.year}
                      </span>
                    )}
                    {movie.episode_current && (
                      <span className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                        {movie.episode_current}
                      </span>
                    )}
                  </div>

                  {/* Genres */}
                  {movie.category?.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1">
                      {movie.category.map((c) => (
                        <Link
                          key={c.slug}
                          href={`/the-loai/${c.slug}`}
                          className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                        >
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  )}

                  {movie.episode_current && movie.episode_total && (
                    <p className="text-xs text-[#f5a623]">
                      🎬 Đã chiếu: {movie.episode_current} /{" "}
                      {movie.episode_total}
                    </p>
                  )}
                </div>

                {/* Description — hidden on small */}
                {description && (
                  <div className="hidden w-56 shrink-0 lg:block xl:w-72">
                    <p className="mb-3 line-clamp-5 text-sm leading-relaxed text-white/40">
                      {description}
                    </p>
                    <button className="text-xs font-medium text-[#f5a623] hover:underline">
                      Thông tin phim ›
                    </button>
                  </div>
                )}

                {/* Rating column */}
                <div className="hidden shrink-0 flex-col items-center gap-4 xl:flex">
                  <button className="flex flex-col items-center gap-1 text-white/40 transition-colors hover:text-amber-400">
                    <StarIcon className="h-7 w-7" />
                    <span className="text-[10px]">Đánh giá</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 text-white/40 transition-colors hover:text-blue-400">
                    <ChatIcon className="h-7 w-7" />
                    <span className="text-[10px]">Bình luận</span>
                  </button>
                  <button className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-500">
                    ★ 0 Đánh giá
                  </button>
                </div>
              </div>

              {/* Description on mobile */}
              {description && (
                <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-white/40 lg:hidden">
                  {description}
                </p>
              )}
            </div>

            {/* Notify banner */}
            {movie.notify && (
              <div
                className="rounded-xl px-4 py-3 text-sm font-medium text-white"
                style={{
                  background:
                    "linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #2563eb 100%)",
                }}
              >
                🔔 {movie.notify}
              </div>
            )}

            {/* ── Episode section ── */}
            {servers.length > 0 && (
              <div
                id="episode-section"
                className="rounded-xl bg-[#1e2030] p-4 md:p-5"
              >
                {/* Header row */}
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <svg
                      className="h-4 w-4 text-[#f5a623]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                    </svg>
                    Danh sách tập
                  </div>

                  {/* Server tabs */}
                  <div className="flex flex-wrap gap-1.5">
                    {servers.map((server, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleServerChange(idx)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                          idx === serverIdx
                            ? "bg-[#f5a623] text-black"
                            : "border border-white/15 text-white/50 hover:border-[#f5a623]/50 hover:text-white"
                        }`}
                      >
                        {server.server_name}
                      </button>
                    ))}
                  </div>

                  {hasMore && (
                    <button
                      onClick={() => setCollapsed(!collapsed)}
                      className="ml-auto flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/40 transition-colors hover:border-white/25 hover:text-white/70"
                    >
                      {collapsed ? "Mở rộng" : "Rút gọn"}
                      <svg
                        className={`h-3 w-3 transition-transform ${
                          collapsed ? "" : "rotate-180"
                        }`}
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
                    </button>
                  )}
                </div>

                {/* Episode grid */}
                <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12">
                  {displayEps.map((ep, idx) => (
                    <button
                      key={ep.slug}
                      onClick={() => setEpIdx(idx)}
                      className={`rounded-lg py-2 text-xs font-medium transition-all ${
                        idx === safeEpIdx
                          ? "bg-[#f5a623] text-black shadow-md shadow-[#f5a623]/25"
                          : "border border-white/10 bg-white/5 text-white/50 hover:border-[#f5a623]/40 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {ep.name}
                    </button>
                  ))}
                </div>

                {hasMore && collapsed && (
                  <button
                    onClick={() => setCollapsed(false)}
                    className="mt-3 w-full rounded-lg border border-white/10 py-2 text-xs text-white/30 transition-colors hover:border-white/20 hover:text-white/60"
                  >
                    Xem thêm {episodes.length - EPISODE_COLLAPSE} tập ▼
                  </button>
                )}
              </div>
            )}

            {/* ── Actors ── */}
            {actors.length > 0 && (
              <div className="rounded-xl bg-[#1e2030] p-4 md:p-5">
                <h3 className="mb-4 text-sm font-semibold text-white">
                  Diễn viên
                </h3>
                <div
                  className="flex gap-3 overflow-x-auto pb-1"
                  style={{ scrollbarWidth: "none" }}
                >
                  {actors.slice(0, 10).map((actor, idx) => (
                    <div
                      key={`${actor.id ?? "actor"}-${idx}`}
                      className="flex shrink-0 flex-col items-center gap-1.5"
                      style={{ width: 68 }}
                    >
                      <div className="relative h-14 w-14 overflow-hidden rounded-full bg-white/10">
                        {actor.profile_path ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                            alt={actor.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xl text-white/20">
                            👤
                          </div>
                        )}
                      </div>
                      <p className="line-clamp-2 text-center text-[10px] leading-tight text-white/60">
                        {actor.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Comments ── */}
            <div className="rounded-xl bg-[#1e2030] p-4 md:p-5">
              {/* Tabs */}
              <div className="mb-4 flex border-b border-white/10">
                <button
                  onClick={() => setActiveTab("comment")}
                  className={`pb-3 pr-5 text-sm font-medium transition-colors ${
                    activeTab === "comment"
                      ? "border-b-2 border-[#f5a623] text-[#f5a623]"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  Bình luận (0)
                </button>
                <button
                  onClick={() => setActiveTab("review")}
                  className={`px-5 pb-3 text-sm font-medium transition-colors ${
                    activeTab === "review"
                      ? "border-b-2 border-[#f5a623] text-[#f5a623]"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  Đánh giá
                </button>
              </div>

              <p className="mb-4 text-sm text-white/40">
                Vui lòng{" "}
                <Link
                  href="/dang-nhap"
                  className="text-[#f5a623] hover:underline"
                >
                  đăng nhập
                </Link>{" "}
                để tham gia bình luận.
              </p>

              <div className="rounded-xl border border-white/10 bg-[#191b24] p-3">
                <textarea
                  placeholder="Viết bình luận..."
                  className="w-full resize-none bg-transparent text-sm text-white/60 placeholder-white/20 outline-none"
                  rows={3}
                  disabled
                />
                <div className="flex items-center justify-between border-t border-white/10 pt-2">
                  <span className="text-xs text-white/20">0 / 1000</span>
                  <button className="flex items-center gap-1.5 rounded-lg bg-[#f5a623] px-4 py-1.5 text-xs font-semibold text-black opacity-40">
                    Gửi
                    <svg
                      className="h-3 w-3"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="hidden w-96 shrink-0 xl:block">
            <h3 className="mb-5 text-lg font-semibold text-white">
              Đề xuất cho bạn
            </h3>
            <div className="space-y-3">
              {relatedMovies.map((m) => {
                return (
                  <Link
                    key={m._id}
                    href={`/phim/${m.slug}`}
                    className="flex gap-4 rounded-xl p-2.5 transition-colors hover:bg-white/5"
                  >
                    <div className="relative h-36 w-24 shrink-0 overflow-hidden rounded-lg group">
                      <MovieCardImage movie={m} cdnUrl={CDN} />
                    </div>
                    <div className="min-w-0 flex-1 py-1.5">
                      <p className="line-clamp-2 text-base font-medium leading-snug text-white/90">
                        {m.name}
                      </p>
                      <p className="mt-1.5 truncate text-sm text-white/40">
                        {m.origin_name}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        {m.quality && (
                          <span className="rounded bg-[#f5a623]/15 px-2.5 py-0.5 text-xs font-bold text-[#f5a623]">
                            {m.quality}
                          </span>
                        )}
                        {m.episode_current && (
                          <span className="text-xs text-white/30">
                            {m.episode_current}
                          </span>
                        )}
                        {m.year && (
                          <span className="text-xs text-white/30">
                            {m.year}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function HeartIcon() {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      className="h-full w-full"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      className="h-full w-full"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v16m8-8H4"
      />
    </svg>
  );
}
function ShuffleIcon() {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      className="h-full w-full"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2"
      />
    </svg>
  );
}
function SkipIcon() {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      className="h-full w-full"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 5l7 7-7 7M5 5l7 7-7 7"
      />
    </svg>
  );
}
function CinemaIcon() {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      className="h-full w-full"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
      />
    </svg>
  );
}
function ShareIcon() {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      className="h-full w-full"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
      />
    </svg>
  );
}
function FlagIcon() {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      className="h-full w-full"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
      />
    </svg>
  );
}
function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
  );
}
function ChatIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function WatchSkeleton() {
  return (
    <div className="min-h-screen bg-[#191b24]">
      <div className="flex items-center gap-3 px-4 py-3 md:px-6">
        <div className="h-8 w-8 animate-pulse rounded-full bg-white/10" />
        <div className="h-4 w-48 animate-pulse rounded bg-white/10" />
      </div>
      <div className="bg-[#0d0f18]">
        <div className="mx-auto max-w-5xl px-4 py-2 md:px-6">
          <div className="h-4 w-64 animate-pulse rounded bg-white/10" />
        </div>
        <div className="mx-auto max-w-5xl">
          <div
            className="w-full animate-pulse bg-white/5"
            style={{ paddingTop: "56.25%" }}
          />
        </div>
        <div className="mx-auto max-w-5xl px-4 py-3 md:px-6">
          <div className="flex gap-4">
            {[80, 72, 100, 120, 80, 64].map((w, i) => (
              <div
                key={i}
                className="h-4 animate-pulse rounded bg-white/10"
                style={{ width: w }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        <div className="flex gap-6">
          <div className="flex-1 space-y-5">
            <div className="rounded-xl bg-[#1e2030] p-5">
              <div className="flex gap-4">
                <div className="h-36 w-28 animate-pulse rounded-xl bg-white/10" />
                <div className="flex-1 space-y-3">
                  <div className="h-6 w-3/4 animate-pulse rounded bg-white/10" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-white/10" />
                  <div className="flex gap-2">
                    {[56, 40, 48, 56].map((w, i) => (
                      <div
                        key={i}
                        className="h-6 animate-pulse rounded bg-white/10"
                        style={{ width: w }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-[#1e2030] p-5">
              <div className="mb-4 h-5 w-32 animate-pulse rounded bg-white/10" />
              <div className="grid grid-cols-10 gap-1.5">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-8 animate-pulse rounded-lg bg-white/10"
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="hidden w-72 xl:block">
            <div className="mb-4 h-5 w-36 animate-pulse rounded bg-white/10" />
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex gap-3 rounded-xl p-2">
                  <div className="h-20 w-14 animate-pulse rounded-lg bg-white/10" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-3 animate-pulse rounded bg-white/10" />
                    <div className="h-3 w-3/4 animate-pulse rounded bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
