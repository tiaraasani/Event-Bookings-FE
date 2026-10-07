import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "name must be at least 2 characters long"),
  email: z.string().email("email must be a valid email address"),
  password: z.string().min(6, "password must be at least 6 characters long"),
  role: z.enum(["CUSTOMER", "ORGANIZER"]),
  referralCode: z.string().optional(),
  organizationName: z.string().optional(),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
