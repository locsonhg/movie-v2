import type { Metadata } from "next";
import { Suspense } from "react";
import { DanhSachClient } from "./DanhSachClient";

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
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title =
    SLUG_TITLE_MAP[slug] ??
    slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${title} - LocsongPhim`,
    description: `Xem ${title} online miễn phí, chất lượng cao, vietsub nhanh nhất tại LocsongPhim`,
  };
}

export default async function DanhSachPage({ params }: Props) {
  const { slug } = await params;
  return (
    <Suspense>
      <DanhSachClient slug={slug} />
    </Suspense>
  );
}
