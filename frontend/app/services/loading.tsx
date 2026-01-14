import { SkeletonServiceCard } from "@/components/Skeleton";

/**
 * Services Page Loading State
 *
 * Shows skeleton placeholders for service cards
 * during navigation and data fetching.
 */
export default function ServicesLoading() {
  return (
    <>
      {/* Hero skeleton */}
      <section className="relative py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <div className="skeleton mx-auto h-12 w-56 mb-4" />
          <div className="skeleton mx-auto h-6 w-80 max-w-full" />
        </div>
      </section>

      {/* Services grid skeleton */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonServiceCard key={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
