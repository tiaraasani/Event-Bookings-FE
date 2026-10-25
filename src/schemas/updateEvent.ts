import { z } from "zod";

export const updateEventSchema = z
  .object({
    customCategory: z.string().optional(),
    name: z.string().min(3, "Event name must be at least 3 characters"),
    description: z.string().optional(),
    city: z.string().optional(),
    type: z.enum(["VENUE", "ONLINE"]),
    slug: z.string().min(1, "Slug is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
  })
  .superRefine((data, ctx) => {
    if (data.type === "VENUE" && (!data.city || data.city.trim().length < 2)) {
      ctx.addIssue({
        code: "custom",
        message: "City must be at least 2 characters",
        path: ["city"],
      });
    }

    if (!data.customCategory?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Category is required",
        path: ["customCategory"],
      });
    }

    if (new Date(data.endDate) <= new Date(data.startDate)) {
      ctx.addIssue({
        code: "custom",
        message: "End date must be after start date",
        path: ["endDate"],
      });
    }
  });

export type UpdateEventSchema = z.infer<typeof updateEventSchema>;
