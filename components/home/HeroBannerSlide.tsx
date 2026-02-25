"use client";

import Image from "next/image";
import type { MovieItem } from "@/types/ophim";
import { OPHIM_CONFIG } from "@/constants/ophim";
import { useMovieImages } from "@/hooks/useOphimQueries";
import { normalizeImageUrl, buildTmdbImageUrl } from "@/utils/image";

interface HeroBannerSlideProps {
  movie: MovieItem;
  isActive: boolean;
  cdnUrl?: string;
}

export function HeroBannerSlide({
  movie,
  isActive,
  cdnUrl = OPHIM_CONFIG.CDN_IMAGE_URL,
}: HeroBannerSlideProps) {
  const { data: imagesData } = useMovieImages(movie.slug);

  // Pick first high-quality backdrop; fallback to poster_url from list
  const backdrop = imagesData?.images?.find((img) => img.type === "backdrop");
  const bgUrl =
    backdrop && imagesData
      ? buildTmdbImageUrl(
          imagesData.image_sizes,
          "backdrop",
          backdrop.file_path,
          "w1280"
        )
      : normalizeImageUrl(movie.poster_url, cdnUrl);

  return (
    <div
      className={`absolute inset-0 transition-opacity duration-700 ${
        isActive ? "opacity-100" : "opacity-0"
      }`}
    >
      {bgUrl ? (
        <Image
          src={bgUrl}
          alt={movie.name}
          fill
          priority={isActive}
          className="object-cover object-center"
          unoptimized
        />
      ) : (
        <div className="h-full w-full bg-[#22253a]" />
      )}
    </div>
  );
}
