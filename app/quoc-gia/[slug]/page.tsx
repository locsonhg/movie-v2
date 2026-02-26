import type { Metadata } from "next";
import { Suspense } from "react";
import { QuocGiaClient } from "./QuocGiaClient";

interface Props {
  params: Promise<{ slug: string }>;
}

function formatTitle(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = `Phim ${formatTitle(slug)}`;
  return {
    title: `${title} - LocsongPhim`,
    description: `Xem phim ${formatTitle(
      slug
    )} online miễn phí, chất lượng cao, vietsub nhanh nhất tại LocsongPhim`,
  };
}

export default async function QuocGiaPage({ params }: Props) {
  const { slug } = await params;
  return (
    <Suspense>
      <QuocGiaClient slug={slug} titleFallback={`Phim ${formatTitle(slug)}`} />
    </Suspense>
  );
}
