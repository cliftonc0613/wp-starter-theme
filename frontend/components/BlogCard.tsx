import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { WPPost } from "@/lib/wordpress";
import { stripHtml, decodeHtmlEntities, formatDate, getReadingTime } from "@/lib/wordpress";

interface BlogCardProps {
  post: WPPost;
  showExcerpt?: boolean;
  showReadingTime?: boolean;
}

export function BlogCard({
  post,
  showExcerpt = true,
  showReadingTime = true,
}: BlogCardProps) {
  const title = decodeHtmlEntities(post.title.rendered);
  const excerpt = stripHtml(post.excerpt.rendered);
  const date = formatDate(post.date);
  const readingTime = getReadingTime(post.content.rendered);
  const authorName = post.author_name || "Unknown Author";

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      {post.featured_image_url && (
        <Link href={`/blog/${post.slug}`} className="block">
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={post.featured_image_url}
              alt={title}
              fill
              className="object-cover transition-transform hover:scale-105"
            />
          </div>
        </Link>
      )}
      <CardHeader>
        <CardDescription className="flex items-center gap-2 text-sm">
          <span>{date}</span>
          {showReadingTime && (
            <>
              <span>•</span>
              <span>{readingTime} min read</span>
            </>
          )}
        </CardDescription>
        <CardTitle className="line-clamp-2">
          <Link
            href={`/blog/${post.slug}`}
            className="transition-colors hover:text-primary"
          >
            {title}
          </Link>
        </CardTitle>
      </CardHeader>
      {showExcerpt && (
        <CardContent className="flex-grow">
          <p className="text-muted-foreground line-clamp-3">{excerpt}</p>
        </CardContent>
      )}
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground">By {authorName}</p>
      </CardContent>
    </Card>
  );
}
