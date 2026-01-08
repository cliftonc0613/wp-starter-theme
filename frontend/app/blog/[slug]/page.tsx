import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPost,
  getPosts,
  stripHtml,
  decodeHtmlEntities,
  formatDate,
  getReadingTime,
  isWordPressConfigured,
} from "@/lib/wordpress";
import { Button } from "@/components/ui/button";
import { BlogCard } from "@/components/BlogCard";
import { BlogPostingSchema, BreadcrumbSchema } from "@/components/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Starter WP Theme";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// Generate static paths for all posts
export async function generateStaticParams() {
  // If WordPress isn't configured during build, return empty array
  // Pages will be generated on-demand with ISR
  if (!isWordPressConfigured()) {
    console.warn('WORDPRESS_API_URL not set - skipping static generation for blog posts');
    return [];
  }

  try {
    const posts = await getPosts({ per_page: 100 });
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Failed to fetch posts for static generation:', error);
    return [];
  }
}

// Allow dynamic paths not generated at build time
export const dynamicParams = true;

// Generate metadata for each post
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const title = decodeHtmlEntities(post.title.rendered);
  const description = stripHtml(post.excerpt.rendered);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: post.author_name ? [post.author_name] : undefined,
      images: post.featured_image_url
        ? [{ url: post.featured_image_url }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.featured_image_url ? [post.featured_image_url] : [],
    },
  };
}

// Enable ISR with 60 second revalidation
export const revalidate = 60;

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const title = decodeHtmlEntities(post.title.rendered);
  const date = formatDate(post.date);
  const readingTime = getReadingTime(post.content.rendered);
  const authorName = post.author_name || "Unknown Author";

  // Fetch related posts (latest 3 posts excluding current)
  const allPosts = await getPosts({ per_page: 4 });
  const relatedPosts = allPosts.filter((p) => p.id !== post.id).slice(0, 3);

  const description = stripHtml(post.excerpt.rendered);
  const postUrl = `${SITE_URL}/blog/${slug}`;

  return (
    <>
      {/* Structured Data */}
      <BlogPostingSchema
        headline={title}
        description={description}
        url={postUrl}
        image={post.featured_image_url || undefined}
        datePublished={post.date}
        dateModified={post.modified}
        author={{
          name: authorName,
        }}
        publisher={{
          name: SITE_NAME,
        }}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          { name: title, url: postUrl },
        ]}
      />

      {/* Article Header */}
      <article className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            {/* Meta */}
            <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span>{date}</span>
              <span>•</span>
              <span>{readingTime} min read</span>
              <span>•</span>
              <span>By {authorName}</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              {title}
            </h1>
          </div>

          {/* Featured Image */}
          {post.featured_image_url && (
            <div className="mx-auto mt-8 max-w-4xl">
              <div className="relative aspect-video overflow-hidden rounded-xl">
                <Image
                  src={post.featured_image_url}
                  alt={title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}

          {/* Content */}
          <div className="mx-auto mt-12 max-w-3xl">
            <div
              className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: post.content.rendered }}
            />
          </div>

          {/* Back to Blog */}
          <div className="mx-auto mt-12 max-w-3xl">
            <Button asChild variant="outline">
              <Link href="/blog">← Back to Blog</Link>
            </Button>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="border-t bg-muted/50 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">
              Related Posts
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
