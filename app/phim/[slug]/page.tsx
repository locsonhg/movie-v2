import type { Metadata } from "next";
import { WatchClientWrapper } from "./WatchClientWrapper";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const name = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `Xem phim ${name} - LocsongPhim`,
  };
}

export default async function MoviePage({ params }: Props) {
  const { slug } = await params;
  return <WatchClientWrapper slug={slug} />;
}
