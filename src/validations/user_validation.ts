import { GENDER } from "@/constants";
import { z } from "zod";

export const userUpdateSchema = z.object({
  name: z.string().min(3).max(150),
  email: z.string().email(),
  phone: z.string().min(3).max(150),
  birth_date: z.date(),
  gender: z.enum(
    GENDER.map((gender) => gender.key) as unknown as [string, ...string[]]
  ),
  address: z.string().min(3).max(150),
  city: z.string().min(3).max(150),
  province: z.string().min(3).max(150),
  postal_code: z.string().min(5).max(7),
  avatar: z
    .instanceof(File, { message: "Input type is image" })
    .refine(
      (file) => ["image/png", "image/jpeg", "image/jpg"].includes(file.type),
      { message: "Invalid image file type" }
    )
    .optional(),
});

export type UserUpdateSchema = z.infer<typeof userUpdateSchema>;
