import { getServices, getTestimonials, getPosts } from "@/lib/wordpress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Home() {
  // Fetch data from WordPress
  let services: Awaited<ReturnType<typeof getServices>> = [];
  let testimonials: Awaited<ReturnType<typeof getTestimonials>> = [];
  let posts: Awaited<ReturnType<typeof getPosts>> = [];
  let error: string | null = null;

  try {
    [services, testimonials, posts] = await Promise.all([
      getServices({ per_page: 3 }),
      getTestimonials({ per_page: 3 }),
      getPosts({ per_page: 3 }),
    ]);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to connect to WordPress API";
    console.error("WordPress API Error:", e);
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-6xl">
            Starter WP Theme
          </h1>
          <p className="mb-8 text-xl text-muted-foreground">
            A headless WordPress starter theme with Next.js and shadcn/ui
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg">Get Started</Button>
            <Button variant="outline" size="lg">Learn More</Button>
          </div>
        </section>

        {/* API Connection Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>WordPress API Connection</CardTitle>
            <CardDescription>
              Testing connection to: {process.env.WORDPRESS_API_URL}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
                <p className="font-medium">Connection Error</p>
                <p className="text-sm">{error}</p>
              </div>
            ) : (
              <div className="rounded-lg bg-green-500/10 p-4 text-green-700 dark:text-green-400">
                <p className="font-medium">Connected Successfully!</p>
                <p className="text-sm">
                  Found {services.length} services, {testimonials.length} testimonials, {posts.length} posts
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Services Section */}
        <section className="mb-16">
          <h2 className="mb-8 text-3xl font-bold">Services</h2>
          {services.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <Card key={service.id}>
                  <CardHeader>
                    <CardTitle dangerouslySetInnerHTML={{ __html: service.title.rendered }} />
                    {service.acf?.pricing && (
                      <CardDescription>{service.acf.pricing}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div
                      className="text-muted-foreground line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: service.excerpt.rendered }}
                    />
                    {service.acf?.features && service.acf.features.length > 0 && (
                      <ul className="mt-4 space-y-1 text-sm">
                        {service.acf.features.slice(0, 3).map((item, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            {item.feature}
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No services found. Add some in WordPress.</p>
          )}
        </section>

        {/* Testimonials Section */}
        <section className="mb-16">
          <h2 className="mb-8 text-3xl font-bold">Testimonials</h2>
          {testimonials.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id}>
                  <CardContent className="pt-6">
                    {testimonial.acf?.quote && (
                      <blockquote className="mb-4 text-muted-foreground italic">
                        &ldquo;{testimonial.acf.quote}&rdquo;
                      </blockquote>
                    )}
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium">
                          {testimonial.acf?.client_name || testimonial.title.rendered}
                        </p>
                        {testimonial.acf?.company && (
                          <p className="text-sm text-muted-foreground">
                            {testimonial.acf.company}
                          </p>
                        )}
                      </div>
                    </div>
                    {testimonial.acf?.rating && (
                      <div className="mt-2 flex gap-1">
                        {Array.from({ length: testimonial.acf.rating }).map((_, i) => (
                          <span key={i} className="text-yellow-500">★</span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No testimonials found. Add some in WordPress.</p>
          )}
        </section>

        {/* Blog Section */}
        <section className="mb-16">
          <h2 className="mb-8 text-3xl font-bold">Latest Posts</h2>
          {posts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Card key={post.id}>
                  <CardHeader>
                    <CardTitle dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                    <CardDescription>
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="text-muted-foreground line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No blog posts found. Add some in WordPress.</p>
          )}
        </section>
      </main>
    </div>
  );
}
