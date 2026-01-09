"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Menu, Phone, Mail, Calendar, Facebook, Linkedin } from "lucide-react";
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

const navItems = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact" },
];

// Contact info - can be moved to env vars or CMS later
const contactInfo = {
  phone: "(123) 456-7890",
  email: "hello@example.com",
  schedulingUrl: "/contact",
};

// Social links
const socialLinks = [
  { href: "https://facebook.com", icon: Facebook, label: "Facebook" },
  { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!headerRef.current) return;

    // Initialize Headroom - handles show/hide on scroll
    // Background opacity and blur transitions are handled via CSS classes
    // See globals.css: .headroom--top and .headroom--not-top
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

    return () => {
      headroom.destroy();
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
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
          <SheetContent side="right" className="flex w-[320px] flex-col overflow-y-auto sm:w-[400px]">
            <SheetHeader className="border-b pb-4">
              <SheetTitle className="text-left text-xl font-bold">
                Menu
              </SheetTitle>
            </SheetHeader>

            {/* Navigation Links */}
            <nav className="flex flex-col space-y-1 px-4 pt-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="py-2 text-sm font-bold uppercase tracking-wider transition-colors hover:text-neutral-600"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="px-4 pt-4">
              <Button asChild className="w-full rounded-lg py-6 text-sm font-bold uppercase tracking-wider">
                <Link href="/contact" onClick={() => setIsOpen(false)}>
                  Get in Touch
                </Link>
              </Button>
            </div>

            {/* Contact Section */}
            <div className="mt-6 border-t px-4 pt-6">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider">
                Contact
              </h3>
              <div className="space-y-3">
                <a
                  href={`tel:${contactInfo.phone.replace(/[^0-9]/g, "")}`}
                  className="flex items-center gap-3 text-sm text-neutral-600 transition-colors hover:text-neutral-900"
                >
                  <Phone className="h-4 w-4" />
                  {contactInfo.phone}
                </a>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="flex items-center gap-3 text-sm text-neutral-600 transition-colors hover:text-neutral-900"
                >
                  <Mail className="h-4 w-4" />
                  {contactInfo.email}
                </a>
                <Link
                  href={contactInfo.schedulingUrl}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-neutral-600 transition-colors hover:text-neutral-900"
                >
                  <Calendar className="h-4 w-4" />
                  Schedule Meeting
                </Link>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6 border-t px-4 pb-8 pt-6">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider">
                Connect
              </h3>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition-colors hover:border-neutral-400 hover:text-neutral-900"
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
