import { EVENT_TYPE_ARRAY } from "@/constants";
import { z } from "zod";

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
    type: z.enum(
      EVENT_TYPE_ARRAY.map((type) => type.key) as [string, ...string[]]
    ),
    registration_start: z.date(),
    registration_end: z.date(),
    is_featured: z.boolean(),
    tags: z.array(z.string()).optional(),
    start_datetime: z.date(),
    end_datetime: z.date(),

    // offline fields - conditional
    galleries: z
      .array(
        z
          .instanceof(File, { message: "Input type is image" })
          .refine(
            (file) =>
              ["image/png", "image/jpeg", "image/jpg"].includes(file.type),
            { message: "Invalid image file type" }
          )
      )
      .optional(),
    venue_name: z.string().min(3, "Venue name is required").max(150).optional(),
    venue_address: z
      .string()
      .min(3, "Venue address is required")
      .max(150)
      .optional(),
    venue_city: z.string().min(3, "Venue city is required").max(150).optional(),
    venue_province: z
      .string()
      .min(3, "Venue province is required")
      .max(150)
      .optional(),
    venue_latitude: z.string().min(1, "Venue latitude is required").optional(),
    venue_longitude: z
      .string()
      .min(1, "Venue longitude is required")
      .optional(),
    min_age: z.number().min(1, "Minimum age must be 1 or greater").optional(),
    max_age: z.number().min(1, "Maximum age must be 1 or greater").optional(),

    // online fields - conditional
    platform: z.string().min(3, "Platform is required").max(150).optional(),
    link: z
      .string()
      .url("Invalid URL format")
      .min(3, "Link is required")
      .optional(),
  })
  .superRefine((data, ctx) => {
    // Validate offline/hybrid specific fields
    if (["offline", "hybrid"].includes(data.type)) {
      if (!data.venue_name) {
        ctx.addIssue({
          path: ["venue_name"],
          code: z.ZodIssueCode.custom,
          message: "Venue name is required for offline/hybrid events",
        });
      }
      if (!data.venue_address) {
        ctx.addIssue({
          path: ["venue_address"],
          code: z.ZodIssueCode.custom,
          message: "Venue address is required for offline/hybrid events",
        });
      }
      if (!data.venue_city) {
        ctx.addIssue({
          path: ["venue_city"],
          code: z.ZodIssueCode.custom,
          message: "Venue city is required for offline/hybrid events",
        });
      }
      if (!data.venue_province) {
        ctx.addIssue({
          path: ["venue_province"],
          code: z.ZodIssueCode.custom,
          message: "Venue province is required for offline/hybrid events",
        });
      }
      if (!data.venue_latitude) {
        ctx.addIssue({
          path: ["venue_latitude"],
          code: z.ZodIssueCode.custom,
          message: "Venue latitude is required for offline/hybrid events",
        });
      }
      if (!data.venue_longitude) {
        ctx.addIssue({
          path: ["venue_longitude"],
          code: z.ZodIssueCode.custom,
          message: "Venue longitude is required for offline/hybrid events",
        });
      }
      if (data.min_age === undefined || data.min_age === null) {
        ctx.addIssue({
          path: ["min_age"],
          code: z.ZodIssueCode.custom,
          message: "Minimum age is required for offline/hybrid events",
        });
      }
      if (data.max_age === undefined || data.max_age === null) {
        ctx.addIssue({
          path: ["max_age"],
          code: z.ZodIssueCode.custom,
          message: "Maximum age is required for offline/hybrid events",
        });
      }

      // Additional validation: max_age should be greater than min_age
      if (
        data.min_age !== undefined &&
        data.max_age !== undefined &&
        data.max_age <= data.min_age
      ) {
        ctx.addIssue({
          path: ["max_age"],
          code: z.ZodIssueCode.custom,
          message: "Maximum age must be greater than minimum age",
        });
      }
    }

    // Validate online/hybrid specific fields
    if (["online", "hybrid"].includes(data.type)) {
      if (!data.platform) {
        ctx.addIssue({
          path: ["platform"],
          code: z.ZodIssueCode.custom,
          message: "Platform is required for online/hybrid events",
        });
      }
      if (!data.link) {
        ctx.addIssue({
          path: ["link"],
          code: z.ZodIssueCode.custom,
          message: "Link is required for online/hybrid events",
        });
      }
    }

    // Validate date logic
    if (data.registration_end <= data.registration_start) {
      ctx.addIssue({
        path: ["registration_end"],
        code: z.ZodIssueCode.custom,
        message: "Registration end date must be after registration start date",
      });
    }

    if (data.end_datetime <= data.start_datetime) {
      ctx.addIssue({
        path: ["end_datetime"],
        code: z.ZodIssueCode.custom,
        message: "Event end date must be after event start date",
      });
    }

    // Validate that event registration should end before or at event start
    if (data.registration_end > data.start_datetime) {
      ctx.addIssue({
        path: ["registration_end"],
        code: z.ZodIssueCode.custom,
        message: "Registration should end before or at the event start time",
      });
    }
  });

export const updateEventGeneral = z
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
      )
      .optional(),
    type: z.enum(
      EVENT_TYPE_ARRAY.map((type) => type.key) as [string, ...string[]]
    ),
    registration_start: z.date(),
    registration_end: z.date(),
    is_featured: z.boolean(),
    tags: z.array(z.string()).optional(),
    start_datetime: z.date(),
    end_datetime: z.date(),

    // offline fields - conditional
    galleries: z
      .array(
        z
          .instanceof(File, { message: "Input type is image" })
          .refine(
            (file) =>
              ["image/png", "image/jpeg", "image/jpg"].includes(file.type),
            { message: "Invalid image file type" }
          )
      )
      .optional(),
    venue_name: z.string().min(3, "Venue name is required").max(150).optional(),
    venue_address: z
      .string()
      .min(3, "Venue address is required")
      .max(150)
      .optional(),
    venue_city: z.string().min(3, "Venue city is required").max(150).optional(),
    venue_province: z
      .string()
      .min(3, "Venue province is required")
      .max(150)
      .optional(),
    venue_latitude: z.string().min(1, "Venue latitude is required").optional(),
    venue_longitude: z
      .string()
      .min(1, "Venue longitude is required")
      .optional(),
    min_age: z.number().min(0, "Minimum age must be 0 or greater").optional(),
    max_age: z.number().min(0, "Maximum age must be 0 or greater").optional(),

    // online fields - conditional
    platform: z.string().min(3, "Platform is required").max(150).optional(),
    link: z
      .string()
      .url("Invalid URL format")
      .min(3, "Link is required")
      .optional(),
  })
  .superRefine((data, ctx) => {
    // Validate offline/hybrid specific fields

    if (["offline", "hybrid"].includes(data.type)) {
      if (!data.venue_name) {
        ctx.addIssue({
          path: ["venue_name"],
          code: z.ZodIssueCode.custom,
          message: "Venue name is required for offline/hybrid events",
        });
      }
      if (!data.venue_address) {
        ctx.addIssue({
          path: ["venue_address"],
          code: z.ZodIssueCode.custom,
          message: "Venue address is required for offline/hybrid events",
        });
      }
      if (!data.venue_city) {
        ctx.addIssue({
          path: ["venue_city"],
          code: z.ZodIssueCode.custom,
          message: "Venue city is required for offline/hybrid events",
        });
      }
      if (!data.venue_province) {
        ctx.addIssue({
          path: ["venue_province"],
          code: z.ZodIssueCode.custom,
          message: "Venue province is required for offline/hybrid events",
        });
      }
      if (!data.venue_latitude) {
        ctx.addIssue({
          path: ["venue_latitude"],
          code: z.ZodIssueCode.custom,
          message: "Venue latitude is required for offline/hybrid events",
        });
      }
      if (!data.venue_longitude) {
        ctx.addIssue({
          path: ["venue_longitude"],
          code: z.ZodIssueCode.custom,
          message: "Venue longitude is required for offline/hybrid events",
        });
      }
      if (data.min_age === undefined || data.min_age === null) {
        ctx.addIssue({
          path: ["min_age"],
          code: z.ZodIssueCode.custom,
          message: "Minimum age is required for offline/hybrid events",
        });
      }
      if (data.max_age === undefined || data.max_age === null) {
        ctx.addIssue({
          path: ["max_age"],
          code: z.ZodIssueCode.custom,
          message: "Maximum age is required for offline/hybrid events",
        });
      }

      // Additional validation: max_age should be greater than min_age
      if (
        data.min_age !== undefined &&
        data.max_age !== undefined &&
        data.max_age <= data.min_age
      ) {
        ctx.addIssue({
          path: ["max_age"],
          code: z.ZodIssueCode.custom,
          message: "Maximum age must be greater than minimum age",
        });
      }
    }

    // Validate online/hybrid specific fields
    if (["online", "hybrid"].includes(data.type)) {
      if (!data.platform) {
        ctx.addIssue({
          path: ["platform"],
          code: z.ZodIssueCode.custom,
          message: "Platform is required for online/hybrid events",
        });
      }
      if (!data.link) {
        ctx.addIssue({
          path: ["link"],
          code: z.ZodIssueCode.custom,
          message: "Link is required for online/hybrid events",
        });
      }
    }

    // Validate date logic
    if (data.registration_end <= data.registration_start) {
      ctx.addIssue({
        path: ["registration_end"],
        code: z.ZodIssueCode.custom,
        message: "Registration end date must be after registration start date",
      });
    }

    if (data.end_datetime <= data.start_datetime) {
      ctx.addIssue({
        path: ["end_datetime"],
        code: z.ZodIssueCode.custom,
        message: "Event end date must be after event start date",
      });
    }

    // Validate that event registration should end before or at event start
    if (data.registration_end > data.start_datetime) {
      ctx.addIssue({
        path: ["registration_end"],
        code: z.ZodIssueCode.custom,
        message: "Registration should end before or at the event start time",
      });
    }
  });

export type CreateEventGeneral = z.infer<typeof createEventGeneral>;
export type UpdateEventGeneral = z.infer<typeof updateEventGeneral>;
