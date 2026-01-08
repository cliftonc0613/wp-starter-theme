import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingDown, Clock } from "lucide-react";

interface Stake {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

interface StakesSectionProps {
  heading?: string;
  subheading?: string;
  stakes?: Stake[];
  ctaText?: string;
  ctaHref?: string;
}

/**
 * StoryBrand Stakes Section
 *
 * Purpose: Show what's at risk if they DON'T act
 *
 * Every story needs stakes. Without risk, there's no urgency.
 * This section paints the picture of what happens if they
 * stay stuck where they are.
 *
 * IMPORTANT: Don't be fear-mongering or manipulative.
 * Be honest about the real consequences of inaction.
 * Frame it as "here's what you're missing out on" rather
 * than "here's what terrible thing will happen."
 */
export function StakesSection({
  heading = "What Happens If You Wait?",
  subheading = "[SUBHEADING: The cost of staying where you are]",
  stakes = [
    {
      icon: <TrendingDown className="h-8 w-8" />,
      title: "[STAKE 1: Lost Opportunity]",
      description:
        "[What opportunity are they missing? What are they leaving on the table? Be specific about the cost of inaction.]",
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "[STAKE 2: Wasted Time]",
      description:
        "[How is their current approach wasting time? What could they be doing instead if this problem was solved?]",
    },
    {
      icon: <AlertTriangle className="h-8 w-8" />,
      title: "[STAKE 3: Growing Problem]",
      description:
        "[How does this problem get worse over time? Why is NOW the right time to act?]",
    },
  ],
  ctaText = "Don't Wait - Get Started",
  ctaHref = "/contact",
}: StakesSectionProps) {
  return (
    <section className="relative overflow-hidden bg-muted/30 py-16 md:py-24">
      {/* Subtle warning pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 20px,
              currentColor 20px,
              currentColor 22px
            )`,
          }}
        />
      </div>

      <div className="container relative mx-auto px-4">
        {/* Section header */}
        <div className="mb-12 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1 text-sm font-medium text-orange-700 dark:border-orange-900 dark:bg-orange-950 dark:text-orange-300">
            <AlertTriangle className="h-4 w-4" />
            Consider This
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            {heading}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {subheading}
          </p>
        </div>

        {/* Stakes cards */}
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {stakes.map((stake, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl border border-orange-200/50 bg-background p-6 transition-all hover:border-orange-300 hover:shadow-md dark:border-orange-900/50 dark:hover:border-orange-800"
            >
              {/* Icon */}
              <div className="mb-4 inline-flex rounded-lg bg-orange-100 p-3 text-orange-600 dark:bg-orange-950 dark:text-orange-400">
                {stake.icon}
              </div>

              {/* Content */}
              <h3 className="mb-2 text-lg font-semibold">{stake.title}</h3>
              <p className="text-sm text-muted-foreground">
                {stake.description}
              </p>
            </div>
          ))}
        </div>

        {/* Contrast with success */}
        <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
          <p className="mb-6 text-lg">
            <span className="font-medium">The good news?</span>{" "}
            <span className="text-muted-foreground">
              You don&apos;t have to stay stuck. Taking action today means
              [POSITIVE OUTCOME] tomorrow.
            </span>
          </p>
          <Button asChild size="lg">
            <Link href={ctaHref}>{ctaText}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
