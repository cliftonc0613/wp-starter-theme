"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Headroom from "headroom.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const navItems = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!headerRef.current) return;

    // Initialize Headroom
    const headroom = new Headroom(headerRef.current, {
      offset: 100,
      tolerance: {
        up: 10,
        down: 5,
      },
      classes: {
        initial: "headroom",
        pinned: "headroom--pinned",
        unpinned: "headroom--unpinned",
        top: "headroom--top",
        notTop: "headroom--not-top",
        frozen: "headroom--frozen",
      },
    });
    headroom.init();

    // GSAP ScrollTrigger for background effects
    const scrollTrigger = ScrollTrigger.create({
      start: "top top",
      end: "100px top",
      onUpdate: (self) => {
        const progress = self.progress;
        const header = headerRef.current;
        if (!header) return;

        // Interpolate background opacity and blur based on scroll
        const bgOpacity = 0.6 + progress * 0.35; // 60% -> 95%
        const blurAmount = 8 + progress * 4; // 8px -> 12px

        header.style.setProperty(
          "background-color",
          `oklch(1 0 0 / ${bgOpacity})`
        );
        header.style.setProperty(
          "backdrop-filter",
          `blur(${blurAmount}px)`
        );
      },
    });

    // Cleanup
    return () => {
      headroom.destroy();
      scrollTrigger.kill();
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className="fixed top-0 z-50 w-full border-b bg-background/60 backdrop-blur-[8px]"
    >
      <div className="container mx-auto flex h-[var(--header-height,4rem)] items-center justify-between px-4 transition-[height] duration-300">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold tracking-tight">Starter WP</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {navItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href={item.href}>
                    {item.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Desktop CTA */}
        <div className="hidden md:flex">
          <Button asChild>
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Toggle menu">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="text-xl font-bold"
                >
                  Starter WP
                </Link>
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-8 flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
              <Button asChild className="mt-4 w-full">
                <Link href="/contact" onClick={() => setIsOpen(false)}>
                  Get in Touch
                </Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
