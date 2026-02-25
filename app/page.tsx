"use client";

import { useHome, useMovieList } from "@/hooks/useOphimQueries";
import { HeroBanner } from "@/components/home/HeroBanner";
import { AnimeShowcase } from "@/components/home/AnimeShowcase";
import { MovieRow } from "@/components/movie/MovieRow";
import { Top10Slider } from "@/components/movie/Top10Slider";

const GENRE_CARDS = [
  {
    name: "Viễn Tưởng",
    slug: "vien-tuong",
    color: "linear-gradient(135deg, #1e3a5f, #0f2340)",
  },
  {
    name: "Thái Lan",
    slug: "thai-lan",
    color: "linear-gradient(135deg, #2d6a2d, #1a3d1a)",
  },
  {
    name: "Sitcom",
    slug: "sitcom",
    color: "linear-gradient(135deg, #1a5c3a, #0f3522)",
  },
  {
    name: "Chiếu Rạp",
    slug: "chieu-rap",
    color: "linear-gradient(135deg, #1a3d5c, #0f2233)",
  },
  {
    name: "Kinh Dị",
    slug: "kinh-di",
    color: "linear-gradient(135deg, #5c1a1a, #330f0f)",
  },
  {
    name: "Cổ Trang",
    slug: "co-trang",
    color: "linear-gradient(135deg, #5c3d1a, #33220f)",
  },
  {
    name: "Hành Động",
    slug: "hanh-dong",
    color: "linear-gradient(135deg, #5c1a3a, #330f22)",
  },
  {
    name: "Tình Cảm",
    slug: "tinh-cam",
    color: "linear-gradient(135deg, #5c1a5c, #33103a)",
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
        <h2 className="mb-4 text-xl font-bold text-white">
          Bạn đang quan tâm gì?
        </h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
          {GENRE_CARDS.map((g) => (
            <a
              key={g.slug}
              href={`/the-loai/${g.slug}`}
              className="relative flex h-20 items-end overflow-hidden rounded-lg p-3 transition-transform hover:scale-105"
              style={{ background: g.color }}
            >
              <span className="relative z-10 text-sm font-bold text-white drop-shadow">
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
