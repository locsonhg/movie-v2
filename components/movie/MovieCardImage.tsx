"use client";

import Image from "next/image";
import { useMovieImages } from "@/hooks/useOphimQueries";
import { buildTmdbImageUrl, normalizeImageUrl } from "@/utils/image";
import { OPHIM_CONFIG } from "@/constants/ophim";
import type { MovieItem } from "@/types/ophim";

interface MovieCardImageProps {
  movie: MovieItem;
  cdnUrl?: string;
}

export function MovieCardImage({
  movie,
  cdnUrl = OPHIM_CONFIG.CDN_IMAGE_URL,
}: MovieCardImageProps) {
  const { data: imagesData } = useMovieImages(movie.slug);

  // Prefer TMDB poster; fallback to thumb_url from CDN
  const poster = imagesData?.images?.find((img) => img.type === "poster");
  const src =
    poster && imagesData
      ? buildTmdbImageUrl(
          imagesData.image_sizes,
          "poster",
          poster.file_path,
          "w500"
        )
      : normalizeImageUrl(movie.thumb_url, cdnUrl);

  if (!src) return <div className="h-full w-full bg-[#22253a]" />;

  return (
    <Image
      src={src}
      alt={movie.name}
      fill
      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
      className="object-cover transition-transform duration-300 group-hover:scale-110"
      unoptimized
    />
  );
}
