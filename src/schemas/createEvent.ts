import { z } from "zod";

export const createEventSchema = z
  .object({
    categoryId: z.coerce.number().int().positive().optional(),
    customCategory: z.string().optional(),
    name: z.string().min(3, "Event name must be at least 3 characters"),
    description: z.string().optional(),
    city: z.string().optional(),
    type: z.enum(["VENUE", "ONLINE"]),
    slug: z.string().min(1, "Slug is required"),
    image: z.string().optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),

    tickets: z
      .array(
        z.object({
          name: z.string().min(1, "Ticket name is required"),
          price: z.coerce.number().int().min(0),
          quantity: z.coerce.number().int().positive(),
        }),
      )
      .min(1, "Add at least one ticket"),
  })
  .superRefine((data, ctx) => {
    if (data.type === "VENUE" && (!data.city || data.city.trim().length < 2)) {
      ctx.addIssue({
        code: "custom",
        message: "City must be at least 2 characters",
        path: ["city"],
      });
    }

    if (!data.categoryId && !data.customCategory?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Category is required",
        path: ["categoryId"],
      });
    }

    if (new Date(data.endDate) <= new Date(data.startDate)) {
      ctx.addIssue({
        code: "custom",
        message: "End date must be after start date",
        path: ["endDate"],
      });
    }

    if (new Date(data.startDate) < new Date()) {
      ctx.addIssue({
        code: "custom",
        message: "Start date cannot be in the past",
        path: ["startDate"],
      });
    }
  });

export type CreateEventSchema = z.infer<typeof createEventSchema>;
