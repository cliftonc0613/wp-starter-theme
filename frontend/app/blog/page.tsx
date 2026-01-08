import type { Metadata } from "next";
import { getPosts } from "@/lib/wordpress";
import { Hero } from "@/components/Hero";
import { BlogCard } from "@/components/BlogCard";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read our latest articles, insights, and updates on industry trends and best practices.",
};

// Enable ISR with 60 second revalidation
export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getPosts({ per_page: 12 });

  return (
    <>
      <Hero
        title="Our Blog"
        subtitle="Insights, updates, and resources to help you stay informed and grow your business."
        size="default"
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {posts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-lg text-muted-foreground">
                No blog posts yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
