"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
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
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 1024;
    }
    return true;
  });

  useEffect(() => {
    // Listen for resize
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Pick backdrop for desktop, poster for mobile
  let bgUrl: string | null = null;

  if (isDesktop) {
    // Desktop: use backdrop (horizontal)
    const backdrop = imagesData?.images?.find((img) => img.type === "backdrop");
    bgUrl =
      backdrop && imagesData
        ? buildTmdbImageUrl(
            imagesData.image_sizes,
            "backdrop",
            backdrop.file_path,
            "original"
          )
        : normalizeImageUrl(movie.poster_url, cdnUrl);
  } else {
    const poster = imagesData?.images?.find((img) => img.type === "poster");
    bgUrl =
      poster && imagesData
        ? buildTmdbImageUrl(
            imagesData.image_sizes,
            "poster",
            poster.file_path,
            "w500"
          )
        : normalizeImageUrl(movie.poster_url, cdnUrl);
  }

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
