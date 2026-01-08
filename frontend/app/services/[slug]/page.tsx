import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getService, getServices, stripHtml, decodeHtmlEntities } from "@/lib/wordpress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceSchema, BreadcrumbSchema } from "@/components/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Starter WP Theme";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

// Generate static paths for all services
export async function generateStaticParams() {
  const services = await getServices({ per_page: 100 });
  return services.map((service) => ({
    slug: service.slug,
  }));
}

// Generate metadata for each service
export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  const title = decodeHtmlEntities(service.title.rendered);
  const description = stripHtml(service.excerpt.rendered);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: service.featured_image_url
        ? [{ url: service.featured_image_url }]
        : [],
    },
  };
}

// Enable ISR with 60 second revalidation
export const revalidate = 60;

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    notFound();
  }

  const title = decodeHtmlEntities(service.title.rendered);
  const features = service.acf?.features || [];
  const pricing = service.acf?.pricing;
  const duration = service.acf?.duration;
  const ctaText = service.acf?.cta_text || "Get Started";
  const ctaLink = service.acf?.cta_link || "/contact";

  const description = stripHtml(service.excerpt.rendered || service.content.rendered);
  const serviceUrl = `${SITE_URL}/services/${slug}`;

  return (
    <>
      {/* Structured Data */}
      <ServiceSchema
        name={title}
        description={description}
        url={serviceUrl}
        provider={{
          name: SITE_NAME,
          url: SITE_URL,
        }}
        image={service.featured_image_url || undefined}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Services", url: `${SITE_URL}/services` },
          { name: title, url: serviceUrl },
        ]}
      />

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                {title}
              </h1>
              {(pricing || duration) && (
                <div className="mt-4 flex flex-wrap gap-4">
                  {pricing && (
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-lg font-semibold text-primary">
                      {pricing}
                    </span>
                  )}
                  {duration && (
                    <span className="inline-flex items-center rounded-full bg-muted px-4 py-2 text-lg text-muted-foreground">
                      {duration}
                    </span>
                  )}
                </div>
              )}
              <div
                className="prose prose-lg mt-6 max-w-none text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: service.content.rendered }}
              />
              <div className="mt-8">
                <Button asChild size="lg">
                  <Link href={ctaLink}>{ctaText}</Link>
                </Button>
              </div>
            </div>
            {service.featured_image_url && (
              <div className="relative aspect-video overflow-hidden rounded-xl lg:aspect-square">
                <Image
                  src={service.featured_image_url}
                  alt={title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      {features.length > 0 && (
        <section className="bg-muted/50 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tight md:text-4xl">
              What&apos;s Included
            </h2>
            <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-2">
              {features.map((item, index) => (
                <Card key={index}>
                  <CardContent className="flex items-center gap-4 p-6">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                      ✓
                    </span>
                    <span className="font-medium">{item.feature}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="mx-auto max-w-2xl">
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                Ready to Get Started with {title}?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Contact us today to discuss your project and how we can help you
                achieve your goals.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <Button asChild size="lg">
                  <Link href={ctaLink}>{ctaText}</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/services">View All Services</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
