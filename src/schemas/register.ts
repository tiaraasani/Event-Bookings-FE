import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2, "name must be at least 2 characters long"),
    email: z.string().email("email must be a valid email address"),
    password: z.string().min(6, "password must be at least 6 characters long"),
    confirmPassword: z.string().min(1, "please confirm your password"),
    role: z.enum(["CUSTOMER", "ORGANIZER"]),
    referralCode: z.string().optional(),
    organizationName: z.string().optional(),
  })
  // Checked after the field rules above; the error is attached to confirmPassword
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
