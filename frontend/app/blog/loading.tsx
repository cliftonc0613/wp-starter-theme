import { SkeletonBlogGrid } from "@/components/Skeleton";

/**
 * Blog Page Loading State
 *
 * Next.js automatically uses this component as a Suspense boundary
 * for the blog page during navigation and data fetching.
 *
 * Shows skeleton placeholders that match the actual blog card layout
 * for a seamless perceived loading experience.
 */
export default function BlogLoading() {
  return (
    <>
      {/* Hero skeleton */}
      <section className="relative py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <div className="skeleton mx-auto h-12 w-48 mb-4" />
          <div className="skeleton mx-auto h-6 w-96 max-w-full" />
        </div>
      </section>

      {/* Content skeleton */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {/* Filters skeleton */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              <div className="skeleton h-10 w-24 rounded-full" />
              <div className="skeleton h-10 w-32 rounded-full" />
              <div className="skeleton h-10 w-28 rounded-full" />
              <div className="skeleton h-10 w-20 rounded-full" />
            </div>
          </div>

          {/* Blog grid skeleton */}
          <SkeletonBlogGrid count={6} />
        </div>
      </section>
    </>
  );
}
