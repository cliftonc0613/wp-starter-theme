import type { Metadata } from "next";
import Link from "next/link";
import { getTestimonials, isWordPressConfigured } from "@/lib/wordpress";
import type { WPTestimonial } from "@/lib/wordpress";
import { Hero } from "@/components/Hero";
import { TestimonialCard } from "@/components/TestimonialCard";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "Read what our clients have to say about working with us. Real stories from real businesses.",
};

// Enable ISR with 60 second revalidation
export const revalidate = 60;

export default async function TestimonialsPage() {
  let testimonials: WPTestimonial[] = [];

  if (isWordPressConfigured()) {
    try {
      testimonials = await getTestimonials({ per_page: 100 });
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
    }
  }

  return (
    <>
      <Hero
        title="Client Testimonials"
        subtitle="Don't just take our word for it. Here's what our clients have to say about their experience working with us."
        size="default"
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {testimonials.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-lg text-muted-foreground">
                No testimonials yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Ready to Be Our Next Success Story?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join our growing list of satisfied clients. Let&apos;s discuss how
            we can help your business thrive.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/contact">Start Your Journey</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
