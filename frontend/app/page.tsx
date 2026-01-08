import Link from "next/link";
import { getServices, getTestimonials, getPosts } from "@/lib/wordpress";
import { Hero } from "@/components/Hero";
import { ServiceCard } from "@/components/ServiceCard";
import { TestimonialCard } from "@/components/TestimonialCard";
import { BlogCard } from "@/components/BlogCard";
import { Button } from "@/components/ui/button";

// Enable ISR with 60 second revalidation
export const revalidate = 60;

export default async function HomePage() {
  // Fetch data from WordPress
  const [services, testimonials, posts] = await Promise.all([
    getServices({ per_page: 3 }),
    getTestimonials({ per_page: 3 }),
    getPosts({ per_page: 3 }),
  ]);

  return (
    <>
      {/* Hero Section */}
      <Hero
        title="Transform Your Business with Expert Services"
        subtitle="We help service-based businesses grow with modern, fast, and beautiful websites powered by headless WordPress and Next.js."
        primaryCta={{ text: "Get Started", href: "/contact" }}
        secondaryCta={{ text: "Our Services", href: "/services" }}
        size="large"
      />

      {/* Services Section */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Our Services
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Comprehensive solutions tailored to your business needs
            </p>
          </div>
          {services.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              No services available yet. Check back soon!
            </p>
          )}
          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              What Our Clients Say
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Don&apos;t just take our word for it
            </p>
          </div>
          {testimonials.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              No testimonials yet.
            </p>
          )}
          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/testimonials">View All Testimonials</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Latest from the Blog
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Insights and updates from our team
            </p>
          </div>
          {posts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              No blog posts yet. Check back soon!
            </p>
          )}
          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/blog">View All Posts</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl bg-primary p-8 text-center text-primary-foreground md:p-12">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mt-4 text-lg opacity-90">
              Contact us today and let&apos;s discuss how we can help transform
              your business.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                <Link href="/services">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
