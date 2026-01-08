import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { WPService } from "@/lib/wordpress";
import { stripHtml, decodeHtmlEntities } from "@/lib/wordpress";

interface ServiceCardProps {
  service: WPService;
  showFeatures?: boolean;
  showCta?: boolean;
}

export function ServiceCard({
  service,
  showFeatures = true,
  showCta = true,
}: ServiceCardProps) {
  const title = decodeHtmlEntities(service.title.rendered);
  const excerpt = stripHtml(service.excerpt.rendered);
  const features = service.acf?.features || [];
  const pricing = service.acf?.pricing;
  const ctaText = service.acf?.cta_text || "Learn More";
  const ctaLink = service.acf?.cta_link || `/services/${service.slug}`;

  return (
    <Card className="flex h-full flex-col">
      {service.featured_image_url && (
        <div className="relative aspect-video overflow-hidden rounded-t-lg">
          <Image
            src={service.featured_image_url}
            alt={title}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle>
          <Link
            href={`/services/${service.slug}`}
            className="hover:text-primary transition-colors"
          >
            {title}
          </Link>
        </CardTitle>
        {pricing && (
          <CardDescription className="text-lg font-semibold text-primary">
            {pricing}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground line-clamp-3">{excerpt}</p>
        {showFeatures && features.length > 0 && (
          <ul className="mt-4 space-y-2">
            {features.slice(0, 4).map((item, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <span className="text-green-500">✓</span>
                <span>{item.feature}</span>
              </li>
            ))}
            {features.length > 4 && (
              <li className="text-sm text-muted-foreground">
                +{features.length - 4} more features
              </li>
            )}
          </ul>
        )}
      </CardContent>
      {showCta && (
        <CardFooter>
          <Button asChild className="w-full">
            <Link href={ctaLink}>{ctaText}</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
