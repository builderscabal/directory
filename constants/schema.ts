import { z } from "zod"

export const startupSchema = z.object({
  startupId: z.string().optional(),
  founders: z.array(z.string()).nonempty("At least one founder is required"),
  contact_email: z.string().email({ message: "A valid email is required." }),
  name: z.string().trim().nonempty({ message: "Name is required." }),
  url: z.string().trim().nonempty({ message: "A valid website is required." }),
  tagline: z.string().trim().max(100, { message: "Tagline must be at most 100 characters long." }).nonempty({ message: "Tagline is required." }),
  description: z.string().trim().max(1000, { message: "Description must be at most 1,000 characters long." }).nonempty({ message: "Pitch is required." }),
  logoUrl: z.string().nonempty({ message: "Logo URL is required." }),
  displayImageUrl: z.string().nonempty({ message: "Display Image URL is required." }),
  showDeck: z.boolean().optional(),
  twitter: z.string().trim().optional(),
  linkedin: z.string().trim().optional(),
  instagram: z.string().trim().optional(),
  facebook: z.string().trim().optional(),
  youtube: z.string().trim().optional(),
  sector: z.string().trim().nonempty({ message: "Sector is required." }),
  category: z.string().trim().nonempty({ message: "Category is required." }),
  industry: z.string().trim().nonempty({ message: "Industry is required." })
});

export const pitchDeckSchema = z.object({
  startupId: z.string().optional(),
  pitchDeckUrl: z.string().nonempty({ message: "Pitch Deck is required." }),
  showDeck: z.boolean().optional(),
});

export const demoSchema = z.object({
  startupId: z.string().optional(),
  demoUrl: z.string().nonempty({ message: "Video demo is required." }),
  showDemo: z.boolean().optional(),
});

export const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  whatsappNumber: z.string().optional(),
  profileImage: z.string().optional(),
  twitter: z.string().trim().optional(),
  linkedin: z.string().trim().optional()
});

export const passwordSchema = z.object({
  password: z.string().min(1, "Password is required"),
  confirmPassword: z.string().min(1, "Please confirm your password")
});