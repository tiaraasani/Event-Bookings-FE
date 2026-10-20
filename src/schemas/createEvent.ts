import { z } from "zod";

export const createEventSchema = z
  .object({
    categoryId: z.coerce.number().int().positive(),
    name: z.string().min(3, "Event name must be at least 3 characters"),
    description: z.string().optional(),
    category: z.string().min(1, "Category is required"),
    city: z.string().min(2, "City must be at least 2 characters"),
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
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export type CreateEventSchema = z.infer<typeof createEventSchema>;
