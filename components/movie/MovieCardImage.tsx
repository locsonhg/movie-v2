"use client";

import Image from "next/image";
import { useMovieImages } from "@/hooks/useOphimQueries";
import { buildTmdbImageUrl } from "@/utils/image";
import type { MovieItem } from "@/types/ophim";

interface MovieCardImageProps {
  movie: MovieItem;
  cdnUrl?: string;
}

export function MovieCardImage({ movie }: MovieCardImageProps) {
  const { data: imagesData } = useMovieImages(movie.slug);

  // Prefer TMDB poster; fallback to thumb_url from CDN
  const backdrop = imagesData?.images?.find((img) => img.type === "backdrop");
  const src =
    backdrop && imagesData
      ? buildTmdbImageUrl(
          imagesData.image_sizes,
          "backdrop",
          backdrop.file_path,
          "original"
        )
      : null;

  if (!src) return <div className="h-full w-full bg-[#22253a]" />;

  return src ? (
    <Image
      src={src}
      alt={movie.name}
      fill
      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
      className="object-cover transition-transform duration-300 group-hover:scale-110"
      unoptimized
    />
  ) : (
    <div className="h-full w-full bg-[#22253a]" />
  );
}
