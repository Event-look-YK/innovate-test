import { z } from "zod";

export const profileSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().optional(),
  language: z.enum(["uk", "en"]),
});

export type ProfileValues = z.infer<typeof profileSchema>;

export const companySchema = z.object({
  companyName: z.string().min(2),
  taxId: z.string().min(2),
  country: z.string().min(2),
  city: z.string().min(2),
});

export type CompanyValues = z.infer<typeof companySchema>;
