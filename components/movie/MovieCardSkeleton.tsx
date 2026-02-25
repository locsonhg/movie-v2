import { Skeleton } from "@/components/ui";

export function MovieCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-md bg-[#22253a]">
      <Skeleton className="aspect-[2/3] w-full" />
      <div className="p-2 space-y-1.5">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}
