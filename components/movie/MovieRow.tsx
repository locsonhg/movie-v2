import Link from "next/link";
import type { MovieItem } from "@/types/ophim";
import { MovieCard } from "./MovieCard";
import { MovieCardSkeleton } from "./MovieCardSkeleton";

interface MovieRowProps {
  title: string;
  slug: string;
  movies: MovieItem[];
  cdnUrl?: string;
  isLoading?: boolean;
}

export function MovieRow({
  title,
  slug,
  movies,
  cdnUrl,
  isLoading = false,
}: MovieRowProps) {
  return (
    <section className="mb-8">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between px-4 md:px-0">
        <div className="flex items-center gap-3">
          <span className="h-5 w-1 rounded-full bg-[#e50914]" />
          <h2 className="text-lg font-bold uppercase tracking-wide text-white">
            {title}
          </h2>
        </div>
        <Link
          href={`/danh-sach/${slug}`}
          className="text-sm text-[#a3a3a3] transition-colors hover:text-[#e50914]"
        >
          Xem thêm →
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
        {isLoading
          ? Array.from({ length: 7 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))
          : movies
              .slice(0, 14)
              .map((movie) => (
                <MovieCard key={movie._id} movie={movie} cdnUrl={cdnUrl} />
              ))}
      </div>
    </section>
  );
}
