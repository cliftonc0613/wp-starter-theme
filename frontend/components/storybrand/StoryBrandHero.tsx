import Link from "next/link";
import { Button } from "@/components/ui/button";

interface StoryBrandHeroProps {
  headline?: string;
  subheadline?: string;
  primaryCta?: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
  backgroundImage?: string;
}

/**
 * StoryBrand Hero Section
 *
 * Purpose: Pass the "grunt test" - visitor understands in 3 seconds:
 * 1. What you offer
 * 2. How it makes their life better
 * 3. How to get it
 *
 * The headline should focus on the CUSTOMER'S aspirational identity,
 * not your company. Position them as the hero.
 */
export function StoryBrandHero({
  headline = "[HEADLINE: Aspirational identity your customer wants]",
  subheadline = "[SUBHEADLINE: How you help them achieve that identity - keep it simple and clear]",
  primaryCta = { text: "Get a Free Quote", href: "/contact" },
  secondaryCta = { text: "Learn More", href: "#value-stack" },
  backgroundImage,
}: StoryBrandHeroProps) {
  return (
    <section
      className="relative flex min-h-[90vh] items-center justify-center bg-gradient-to-br from-background to-muted"
      style={
        backgroundImage
          ? {
              backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-20 text-center">
        {/* Main headline - Customer as hero */}
        <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          {headline}
        </h1>

        {/* Subheadline - How you help */}
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl md:text-2xl">
          {subheadline}
        </p>

        {/* Dual CTAs */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {/* Primary CTA - Direct action */}
          <Button asChild size="lg" className="min-w-[200px] text-lg">
            <Link href={primaryCta.href}>{primaryCta.text}</Link>
          </Button>

          {/* Secondary CTA - Transitional action */}
          <Button
            asChild
            variant="outline"
            size="lg"
            className="min-w-[200px] text-lg"
          >
            <Link href={secondaryCta.href}>{secondaryCta.text}</Link>
          </Button>
        </div>

        {/* Optional: Trust indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 opacity-60">
          <span className="text-sm text-muted-foreground">
            [TRUST BADGE: "Trusted by 500+ businesses"]
          </span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className="h-6 w-6 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}
