import { EVENT_TYPE_ARRAY } from "@/constants";
import { z } from "zod";

export const createEventOnline = z.object({
  platform: z.string().min(3).max(150),
  link: z.string().url().min(3),
});

export const createEventOffline = z.object({
  galleries: z.nullable(
    z.array(
      z
        .instanceof(File, { message: "Input type is image" })
        .refine(
          (file) =>
            ["image/png", "image/jpeg", "image/jpg"].includes(file.type),
          { message: "Invalid image file type" }
        )
    )
  ),
  venue_name: z.string().min(3).max(150),
  venue_address: z.string().min(3).max(150),
  venue_city: z.string().min(3).max(150),
  venue_province: z.string().min(5).max(7),
  venue_latitude: z.date(),
  venue_longitude: z.date(),
  min_age: z.number(),
  max_age: z.number(),
});

export const createEventHybrid = createEventOffline.merge(createEventOnline);

export const createEventGeneral = z
  .object({
    category: z.number(),
    title: z.string().min(3).max(150),
    description: z.string().min(3).max(300),
    terms_conditions: z.string(),
    banner: z
      .instanceof(File, { message: "Input type is image" })
      .refine(
        (file) => ["image/png", "image/jpeg", "image/jpg"].includes(file.type),
        { message: "Invalid image file type" }
      ),
    type: z.enum(EVENT_TYPE_ARRAY.map((type) => type.value)),
    registration_start: z.date(),
    registration_end: z.date(),
    is_featured: z.boolean(),
    tags: z.nullable(z.array(z.string())),
    start_datetime: z.date(),
    end_datetime: z.date(),
  })
  .merge(createEventOnline)
  .merge(createEventOffline);

export type CreateEventGeneral = z.infer<typeof createEventGeneral>;
export type CreateEventOnline = z.infer<typeof createEventOnline>;
export type CreateEventOffline = z.infer<typeof createEventOffline>;
export type CreateEventHybrid = z.infer<typeof createEventHybrid>;
