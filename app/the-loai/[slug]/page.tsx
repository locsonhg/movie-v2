import type { Metadata } from "next";
import { Suspense } from "react";
import { TheLoaiClient } from "./TheLoaiClient";

interface Props {
  params: Promise<{ slug: string }>;
}

function formatTitle(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = `Thể loại: ${formatTitle(slug)}`;
  return {
    title: `${title} - LocsonhgPhim`,
    description: `Xem phim thể loại ${formatTitle(
      slug
    )} online miễn phí, chất lượng cao, vietsub nhanh nhất tại LocsonhgPhim`,
  };
}

export default async function TheLoaiPage({ params }: Props) {
  const { slug } = await params;
  return (
    <Suspense>
      <TheLoaiClient
        slug={slug}
        titleFallback={`Thể loại: ${formatTitle(slug)}`}
      />
    </Suspense>
  );
}
