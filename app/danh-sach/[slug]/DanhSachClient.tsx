"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  useMovieList,
  useCategories,
  useSearchMovies,
} from "@/hooks/useOphimQueries";
import { MovieGridPage } from "@/components/movie/MovieGridPage";
import type { MovieListData } from "@/types/ophim";

const SLUG_TITLE_MAP: Record<string, string> = {
  "phim-moi": "Phim Mới Cập Nhật",
  "phim-bo": "Phim Bộ",
  "phim-le": "Phim Lẻ",
  "tv-shows": "TV Shows",
  "hoat-hinh": "Hoạt Hình",
  "phim-chieu-rap": "Phim Chiếu Rạp",
  "phim-bo-dang-chieu": "Phim Bộ Đang Chiếu",
  "phim-bo-hoan-thanh": "Phim Bộ Hoàn Thành",
  "phim-sap-chieu": "Phim Sắp Chiếu",
};

interface Props {
  slug: string;
}

export function DanhSachClient({ slug }: Props) {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");
  const [sort, setSort] = useState("modified.time_desc");
  const [category, setCategory] = useState("");
  const [nameSearch, setNameSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce 400ms
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(nameSearch.trim()), 400);
    return () => clearTimeout(t);
  }, [nameSearch]);

  const isSearchMode = debouncedSearch.length >= 2;

  const [sortField, sortType] = sort.includes("year")
    ? ["year", sort.endsWith("asc") ? "asc" : "desc"]
    : ["modified.time", "desc"];

  const { data: listData, isLoading: listLoading } = useMovieList(slug, {
    page,
    limit: 24,
    sort_field: sortField as "modified.time" | "year" | "_id",
    sort_type: sortType as "asc" | "desc",
    ...(category ? { category } : {}),
  });

  const { data: searchData, isLoading: searchLoading } = useSearchMovies({
    keyword: debouncedSearch,
    page,
    limit: 24,
  });

  const { data: categoriesData } = useCategories();

  // Adapt searchData to MovieListData shape
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
    : listData?.titlePage ||
      SLUG_TITLE_MAP[slug] ||
      slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <MovieGridPage
      title={title}
      data={data}
      isLoading={isLoading}
      currentSort={sort}
      onSortChange={setSort}
      categories={categoriesData?.items}
      currentCategory={category}
      onCategoryChange={setCategory}
      nameSearch={nameSearch}
      onNameSearchChange={setNameSearch}
    />
  );
}
