"use client";

import { useHome, useMovieList } from "@/hooks/useOphimQueries";
import { HeroBanner } from "@/components/home/HeroBanner";
import { AnimeShowcase } from "@/components/home/AnimeShowcase";
import { MovieRow } from "@/components/movie/MovieRow";
import { Top10Slider } from "@/components/movie/Top10Slider";

const GENRE_CARDS = [
  {
    name: "Hành Động",
    slug: "hanh-dong",
    gradient: "135deg, #b91c1c 0%, #7f1d1d 100%",
    glow: "rgba(185,28,28,0.5)",
    icon: "💥",
  },
  {
    name: "Tình Cảm",
    slug: "tinh-cam",
    gradient: "135deg, #be185d 0%, #831843 100%",
    glow: "rgba(190,24,93,0.5)",
    icon: "❤️",
  },
  {
    name: "Kinh Dị",
    slug: "kinh-di",
    gradient: "135deg, #4c1d95 0%, #2e1065 100%",
    glow: "rgba(76,29,149,0.5)",
    icon: "👻",
  },
  {
    name: "Hài Hước",
    slug: "hai-huoc",
    gradient: "135deg, #b45309 0%, #78350f 100%",
    glow: "rgba(180,83,9,0.5)",
    icon: "😂",
  },
  {
    name: "Viễn Tưởng",
    slug: "vien-tuong",
    gradient: "135deg, #0369a1 0%, #0c4a6e 100%",
    glow: "rgba(3,105,161,0.5)",
    icon: "🚀",
  },
  {
    name: "Cổ Trang",
    slug: "co-trang",
    gradient: "135deg, #92400e 0%, #451a03 100%",
    glow: "rgba(146,64,14,0.5)",
    icon: "⚔️",
  },
  {
    name: "Hoạt Hình",
    slug: "hoat-hinh",
    gradient: "135deg, #047857 0%, #064e3b 100%",
    glow: "rgba(4,120,87,0.5)",
    icon: "🎨",
  },
  {
    name: "Chiếu Rạp",
    slug: "chieu-rap",
    gradient: "135deg, #1d4ed8 0%, #1e3a8a 100%",
    glow: "rgba(29,78,216,0.5)",
    icon: "🎬",
  },
  {
    name: "Tâm Lý",
    slug: "tam-ly",
    gradient: "135deg, #0f766e 0%, #134e4a 100%",
    glow: "rgba(15,118,110,0.5)",
    icon: "🧠",
  },
  {
    name: "Thái Lan",
    slug: "thai-lan",
    gradient: "135deg, #4d7c0f 0%, #365314 100%",
    glow: "rgba(77,124,15,0.5)",
    icon: "🇹🇭",
  },
  {
    name: "Hàn Quốc",
    slug: "han-quoc",
    gradient: "135deg, #9333ea 0%, #581c87 100%",
    glow: "rgba(147,51,234,0.5)",
    icon: "🇰🇷",
  },
  {
    name: "Sitcom",
    slug: "sitcom",
    gradient: "135deg, #0891b2 0%, #164e63 100%",
    glow: "rgba(8,145,178,0.5)",
    icon: "📺",
  },
];

export default function Home() {
  const { data: homeData, isLoading: homeLoading } = useHome();

  const { data: phimBoData, isLoading: phimBoLoading } = useMovieList(
    "phim-bo",
    { limit: 14, page: 1 }
  );
  const { data: phimLeData, isLoading: phimLeLoading } = useMovieList(
    "phim-le",
    { limit: 14, page: 1 }
  );
  const { data: hoatHinhData, isLoading: hoatHinhLoading } = useMovieList(
    "hoat-hinh",
    { limit: 14, page: 1 }
  );
  const { data: tvShowsData, isLoading: tvShowsLoading } = useMovieList(
    "tv-shows",
    { limit: 14, page: 1 }
  );

  const cdnUrl = homeData?.APP_DOMAIN_CDN_IMAGE ?? "https://phimimg.com";

  return (
    <div className="bg-[#191b24] min-h-screen">
      {/* Hero Banner */}
      <HeroBanner movies={homeData?.items ?? []} cdnUrl={cdnUrl} />

      {/* Top 10 */}
      <div className="px-4 md:px-6 pt-6 pb-2">
        <Top10Slider
          title="Top 10 phim bộ hôm nay"
          slug="phim-bo"
          cdnUrl={cdnUrl}
        />
      </div>

      {/* Genre section */}
      <div className="px-4 md:px-6 pb-8">
        <div className="mb-5 flex items-center gap-3">
          <span
            className="h-7 w-1.5 rounded-full"
            style={{
              background: "linear-gradient(to bottom, #f59e0b, #ef4444)",
            }}
          />
          <h2 className="text-xl font-bold text-white md:text-2xl">
            Bạn đang quan tâm gì?
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-6 md:gap-5 lg:grid-cols-6 xl:grid-cols-12">
          {GENRE_CARDS.map((g) => (
            <a
              key={g.slug}
              href={`/the-loai/${g.slug}`}
              className="group relative flex flex-col items-start justify-between overflow-hidden rounded-xl p-4 transition-all duration-300 hover:-translate-y-1"
              style={{
                background: `linear-gradient(${g.gradient})`,
                boxShadow: `0 4px 20px ${g.glow}`,
                minHeight: 88,
              }}
            >
              {/* Shimmer overlay */}
              <div className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

              {/* Glow border on hover */}
              <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 ring-2 ring-white/30 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Icon */}
              <span className="text-2xl leading-none">{g.icon}</span>

              {/* Name */}
              <span className="mt-2 text-sm font-bold leading-tight text-white drop-shadow">
                {g.name}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Movie Rows */}
      <div className="px-4 md:px-6 py-4 space-y-10">
        {/* Anime Showcase */}
        <AnimeShowcase cdnUrl={cdnUrl} />

        {/* Phim Mới Cập Nhật */}
        <MovieRow
          title="Phim Mới Cập Nhật"
          slug="phim-moi"
          movies={homeData?.items ?? []}
          cdnUrl={cdnUrl}
          isLoading={homeLoading}
        />

        {/* Phim Bộ */}
        <MovieRow
          title="Phim Bộ"
          slug="phim-bo"
          movies={phimBoData?.items ?? []}
          cdnUrl={cdnUrl}
          isLoading={phimBoLoading}
        />

        {/* Phim Lẻ */}
        <MovieRow
          title="Phim Lẻ"
          slug="phim-le"
          movies={phimLeData?.items ?? []}
          cdnUrl={cdnUrl}
          isLoading={phimLeLoading}
        />

        {/* Hoạt Hình */}
        <MovieRow
          title="Hoạt Hình"
          slug="hoat-hinh"
          movies={hoatHinhData?.items ?? []}
          cdnUrl={cdnUrl}
          isLoading={hoatHinhLoading}
        />

        {/* TV Shows */}
        <MovieRow
          title="TV Shows"
          slug="tv-shows"
          movies={tvShowsData?.items ?? []}
          cdnUrl={cdnUrl}
          isLoading={tvShowsLoading}
        />
      </div>
    </div>
  );
}
