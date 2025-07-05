import { z } from "zod";

export const ticketTypeSchema = z
  .object({
    name: z.string().min(3).max(150),
    description: z.string().min(3).max(255),
    price: z.string().min(4).max(12),
    quantity: z.number().min(1),
    min_purchase: z.number().min(1),
    max_purchase: z.number().min(1),
    sale_start: z.date(),
    sale_end: z.date(),
    is_active: z.boolean(),
    benefits: z.array(
      z.object({ value: z.string().min(1, "Benefit cannot be empty") })
    ),
  })
  .superRefine((data, ctx) => {
    if (data.max_purchase < data.min_purchase) {
      ctx.addIssue({
        code: "custom",
        message: "Max purchase must be greater than min purchase",
        path: ["max_purchase"],
      });
    }

    if (data.sale_start > data.sale_end) {
      ctx.addIssue({
        code: "custom",
        message: "Sale end date must be greater than sale start date",
        path: ["sale_end"],
      });
    }
  });

export type TicketTypeSchema = z.infer<typeof ticketTypeSchema>;
