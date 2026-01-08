import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import type { WPTestimonial } from "@/lib/wordpress";
import { decodeHtmlEntities } from "@/lib/wordpress";

interface TestimonialCardProps {
  testimonial: WPTestimonial;
  showRating?: boolean;
}

export function TestimonialCard({
  testimonial,
  showRating = true,
}: TestimonialCardProps) {
  const clientName =
    testimonial.acf?.client_name ||
    decodeHtmlEntities(testimonial.title.rendered);
  const company = testimonial.acf?.company;
  const quote = testimonial.acf?.quote;
  const rating = testimonial.acf?.rating || 5;
  const photo = testimonial.acf?.photo;

  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col p-6">
        {/* Rating Stars */}
        {showRating && (
          <div className="mb-4 flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={i < rating ? "text-yellow-500" : "text-gray-300"}
              >
                ★
              </span>
            ))}
          </div>
        )}

        {/* Quote */}
        {quote && (
          <blockquote className="flex-grow text-muted-foreground italic">
            &ldquo;{quote}&rdquo;
          </blockquote>
        )}

        {/* Client Info */}
        <div className="mt-6 flex items-center gap-4">
          {photo?.url ? (
            <div className="relative h-12 w-12 overflow-hidden rounded-full">
              <Image
                src={photo.url}
                alt={clientName}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
              {clientName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-medium">{clientName}</p>
            {company && (
              <p className="text-sm text-muted-foreground">{company}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
