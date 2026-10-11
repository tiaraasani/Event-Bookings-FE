import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "The current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters long."),
    confirmPassword: z.string().min(1, "Confirmation is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password doesn't match",
    path: ["confirmPassword"],
  });

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
