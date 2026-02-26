"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useMoviesByCategory, useSearchMovies } from "@/hooks/useOphimQueries";
import { MovieGridPage } from "@/components/movie/MovieGridPage";
import type { MovieListData } from "@/types/ophim";

interface Props {
  slug: string;
  titleFallback: string;
}

export function TheLoaiClient({ slug, titleFallback }: Props) {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");
  const [sort, setSort] = useState("modified.time_desc");
  const [nameSearch, setNameSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(nameSearch.trim()), 400);
    return () => clearTimeout(t);
  }, [nameSearch]);

  const isSearchMode = debouncedSearch.length >= 2;

  const [sortField, sortType] = sort.includes("year")
    ? ["year", sort.endsWith("asc") ? "asc" : "desc"]
    : ["modified.time", "desc"];

  const { data: listData, isLoading: listLoading } = useMoviesByCategory(slug, {
    page,
    limit: 24,
    sort_field: sortField as "modified.time" | "year" | "_id",
    sort_type: sortType as "asc" | "desc",
  });

  const { data: searchData, isLoading: searchLoading } = useSearchMovies({
    keyword: debouncedSearch,
    page,
    limit: 24,
  });

  const adaptedSearchData: MovieListData | undefined = searchData
    ? {
        titlePage: `Kết quả tìm kiếm: "${debouncedSearch}"`,
        items: searchData.items,
        params: searchData.params,
      }
    : undefined;

  const data = isSearchMode ? adaptedSearchData : listData;
  const isLoading = isSearchMode ? searchLoading : listLoading;
  const title = isSearchMode
    ? `Kết quả: "${debouncedSearch}"`
    : listData?.titlePage || titleFallback;

  return (
    <MovieGridPage
      title={title}
      data={data}
      isLoading={isLoading}
      currentSort={sort}
      onSortChange={setSort}
      nameSearch={nameSearch}
      onNameSearchChange={setNameSearch}
    />
  );
}
