import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
