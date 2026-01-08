import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HeroProps {
  title: string;
  subtitle?: string;
  primaryCta?: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
  centered?: boolean;
  size?: "default" | "large" | "small";
}

export function Hero({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  centered = true,
  size = "default",
}: HeroProps) {
  const sizeClasses = {
    small: "py-12 md:py-16",
    default: "py-16 md:py-24",
    large: "py-24 md:py-32",
  };

  const titleSizes = {
    small: "text-3xl md:text-4xl",
    default: "text-4xl md:text-5xl lg:text-6xl",
    large: "text-5xl md:text-6xl lg:text-7xl",
  };

  return (
    <section className={`${sizeClasses[size]} ${centered ? "text-center" : ""}`}>
      <div className="container mx-auto px-4">
        <div className={centered ? "mx-auto max-w-3xl" : ""}>
          <h1
            className={`${titleSizes[size]} font-bold tracking-tight`}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              {subtitle}
            </p>
          )}
          {(primaryCta || secondaryCta) && (
            <div
              className={`mt-8 flex flex-wrap gap-4 ${
                centered ? "justify-center" : ""
              }`}
            >
              {primaryCta && (
                <Button asChild size="lg">
                  <Link href={primaryCta.href}>{primaryCta.text}</Link>
                </Button>
              )}
              {secondaryCta && (
                <Button asChild variant="outline" size="lg">
                  <Link href={secondaryCta.href}>{secondaryCta.text}</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
