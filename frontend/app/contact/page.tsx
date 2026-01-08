import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with us. We'd love to hear from you and discuss how we can help your business grow.",
};

export default function ContactPage() {
  return (
    <>
      <Hero
        title="Contact Us"
        subtitle="Have a question or want to work together? We'd love to hear from you."
        size="default"
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form - Placeholder for Task 5.0 */}
            <div>
              <h2 className="mb-6 text-2xl font-bold">Send Us a Message</h2>
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">
                    Contact form coming soon...
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="mb-6 text-2xl font-bold">Get in Touch</h2>
              <div className="space-y-6">
                <Card>
                  <CardContent className="flex items-start gap-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="mb-1 text-lg">Email</CardTitle>
                      <a
                        href="mailto:hello@example.com"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        hello@example.com
                      </a>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-start gap-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="mb-1 text-lg">Phone</CardTitle>
                      <a
                        href="tel:+1234567890"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        (123) 456-7890
                      </a>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-start gap-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="mb-1 text-lg">Address</CardTitle>
                      <address className="not-italic text-muted-foreground">
                        123 Main Street
                        <br />
                        City, State 12345
                      </address>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
