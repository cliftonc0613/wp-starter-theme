import { z } from "zod";

/**
 * Contact Form Validation Schema
 * Shared between client-side form and server-side API validation
 */
export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  service: z.string().optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  referral: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
