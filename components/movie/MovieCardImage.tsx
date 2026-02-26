"use client";

import Image from "next/image";
import { useMovieImages } from "@/hooks/useOphimQueries";
import { buildTmdbImageUrl } from "@/utils/image";
import type { MovieItem } from "@/types/ophim";

interface MovieCardImageProps {
  movie: MovieItem;
  cdnUrl?: string;
  /** "poster" for portrait cards (2:3), "backdrop" for landscape (16:9) */
  variant?: "poster" | "backdrop";
}

export function MovieCardImage({
  movie,
  variant = "poster",
}: MovieCardImageProps) {
  const { data: imagesData } = useMovieImages(movie.slug);

  const image = imagesData?.images?.find((img) => img.type === variant);
  const src =
    image && imagesData
      ? buildTmdbImageUrl(
          imagesData.image_sizes,
          variant,
          image.file_path,
          variant === "poster" ? "w500" : "w780"
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
