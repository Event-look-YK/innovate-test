import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export type SignInValues = z.infer<typeof signInSchema>;

export const signUpCarrierStep1Schema = z
  .object({
    fullName: z.string().min(2, "Name is required"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "At least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpCarrierStep1Values = z.infer<typeof signUpCarrierStep1Schema>;

export const signUpCarrierStep2Schema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  taxId: z.string().min(2, "Tax ID is required"),
  country: z.string().min(2, "Country is required"),
  city: z.string().min(2, "City is required"),
});

export type SignUpCarrierStep2Values = z.infer<typeof signUpCarrierStep2Schema>;

const freelanceAccountFields = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "At least 8 characters"),
});

export const signUpFreelanceStep1Schema = freelanceAccountFields
  .extend({
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpFreelanceStep1Values = z.infer<typeof signUpFreelanceStep1Schema>;

export const signUpFreelanceStep2Schema = z.object({
  phone: z.string().min(6, "Phone is required"),
  licenseNumber: z.string().min(2, "License number is required"),
  vehicleType: z.enum(["Truck", "Van", "Refrigerated"]),
  payloadT: z.coerce.number().positive("Must be greater than 0"),
});

export type SignUpFreelanceStep2Values = z.infer<typeof signUpFreelanceStep2Schema>;

export const signUpFreelanceSchema = freelanceAccountFields.merge(signUpFreelanceStep2Schema);

export type SignUpFreelanceValues = z.infer<typeof signUpFreelanceSchema>;
