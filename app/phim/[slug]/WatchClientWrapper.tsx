"use client";

import dynamic from "next/dynamic";

const WatchClient = dynamic(
  () => import("./WatchClient").then((m) => ({ default: m.WatchClient })),
  { ssr: false }
);

export function WatchClientWrapper({ slug }: { slug: string }) {
  return <WatchClient slug={slug} />;
}
