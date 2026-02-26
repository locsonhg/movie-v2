"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useMovieList, useCategories } from "@/hooks/useOphimQueries";
import { MovieGridPage } from "@/components/movie/MovieGridPage";

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

  const [sortField, sortType] = sort.includes("year")
    ? ["year", sort.endsWith("asc") ? "asc" : "desc"]
    : ["modified.time", "desc"];

  const { data, isLoading } = useMovieList(slug, {
    page,
    limit: 24,
    sort_field: sortField as "modified.time" | "year" | "_id",
    sort_type: sortType as "asc" | "desc",
    ...(category ? { category } : {}),
  });

  const { data: categoriesData } = useCategories();

  const title =
    data?.titlePage ||
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
    />
  );
}
