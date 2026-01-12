import type { Metadata } from "next";
import { DM_Sans, Playfair_Display, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Toaster } from "@/components/ui/sonner";
import { StructuredData } from "@/components/structured-data";
import { generateOrganizationSchema } from "@/lib/schema";
import { Providers } from "./providers";
import "./globals.css";

// Site-wide Organization schema for rich snippets
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Starter WP Theme";

const organizationSchema = generateOrganizationSchema({
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: "A headless WordPress starter theme built with Next.js and shadcn/ui. Perfect for service-based businesses.",
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Starter WP Theme | Service-Based Business",
    template: "%s | Starter WP Theme",
  },
  description:
    "A headless WordPress starter theme built with Next.js and shadcn/ui. Perfect for service-based businesses.",
  keywords: ["WordPress", "Next.js", "headless CMS", "shadcn/ui", "services"],
  authors: [{ name: "Starter WP Theme" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Starter WP Theme",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${playfair.variable} ${jetbrains.variable} font-sans antialiased`}
      >
        <Providers>
          <StructuredData data={organizationSchema} />
          <SmoothScroll />
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
