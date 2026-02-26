"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useMoviesByCountry } from "@/hooks/useOphimQueries";
import { MovieGridPage } from "@/components/movie/MovieGridPage";

interface Props {
  slug: string;
  titleFallback: string;
}

export function QuocGiaClient({ slug, titleFallback }: Props) {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");
  const [sort, setSort] = useState("modified.time_desc");

  const [sortField, sortType] = sort.includes("year")
    ? ["year", sort.endsWith("asc") ? "asc" : "desc"]
    : ["modified.time", "desc"];

  const { data, isLoading } = useMoviesByCountry(slug, {
    page,
    limit: 24,
    sort_field: sortField as "modified.time" | "year" | "_id",
    sort_type: sortType as "asc" | "desc",
  });

  const title = data?.titlePage || titleFallback;

  return (
    <MovieGridPage
      title={title}
      data={data}
      isLoading={isLoading}
      currentSort={sort}
      onSortChange={setSort}
    />
  );
}
