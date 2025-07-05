import { z } from "zod";

export const createOrganizer = z.object({
  organizer_name: z.string().min(3).max(150),
  description: z.string().min(3).max(300),
  logo: z
    .instanceof(File, { message: "Input type is image" })
    .refine(
      (file) => ["image/png", "image/jpeg", "image/jpg"].includes(file.type),
      { message: "Invalid image file type" }
    ),
  banner: z
    .instanceof(File, { message: "Input type is image" })
    .refine(
      (file) => ["image/png", "image/jpeg", "image/jpg"].includes(file.type),
      { message: "Invalid image file type" }
    ),
  website: z.string().url().min(3).max(150),
  instagram: z.string().url().min(3).max(150),
  twitter: z.string().url().min(3).max(150),
  facebook: z.string().url().min(3).max(150),
  address: z.string().min(3).max(150),
  city: z.string().min(3).max(150),
  province: z.string().min(3).max(150),
  postal_code: z.string().min(5).max(7),
  contact_person: z.string().min(3).max(150),
  contact_phone: z.string().min(3).max(150),
  contact_email: z.string().min(3).max(150),
  bank_name: z.string().min(3).max(150),
  bank_account_name: z.string().min(3).max(150),
  bank_account_number: z.string().min(3).max(150),
  required_documents: z.array(z.string().min(1)).optional(),
  uploaded_documents: z.array(z.string().min(1)).optional(),
  payment_method: z.string(),
});

export const createProfileOrganizer = z.object({
  organizer_name: z.string().min(3).max(150),
  description: z.string().min(3).max(300),
  logo: z
    .instanceof(File, { message: "Input type is image" })
    .refine(
      (file) => ["image/png", "image/jpeg", "image/jpg"].includes(file.type),
      { message: "Invalid image file type" }
    ),
  banner: z
    .instanceof(File, { message: "Input type is image" })
    .refine(
      (file) => ["image/png", "image/jpeg", "image/jpg"].includes(file.type),
      { message: "Invalid image file type" }
    ),
  contact_person: z.string().min(3).max(150),
  contact_phone: z.string().min(3).max(150),
  contact_email: z.string().min(3).max(150),
});

export const createAddressOrganizer = z.object({
  address: z.string().min(3).max(150),
  city: z.string().min(3).max(150),
  province: z.string().min(3).max(150),
  postal_code: z.string().min(5).max(7),
});

export const createPortfolioOrganizer = z.object({
  website: z.string().url().min(3).max(150),
  instagram: z.string().url().min(3).max(150).optional(),
  twitter: z.string().url().min(3).max(150).optional(),
  facebook: z.string().url().min(3).max(150).optional(),
});

export const createBankOrganizer = z.object({
  bank_name: z.string().min(3).max(150),
  bank_account_name: z.string().min(3).max(150),
  bank_account_number: z.string().min(3).max(150),
});

export const createDocumentOrganizer = z
  .object({
    required_documents: z.array(z.string().min(1)),
    uploaded_documents: z.array(
      z.object({
        file: z
          .instanceof(File, { message: "Input type is file" })
          .refine(
            (file) =>
              [
                "image/png",
                "image/jpeg",
                "image/jpg",
                "application/pdf",
              ].includes(file.type),
            { message: "Invalid file type" }
          ),
      })
    ),
    payment_method: z.string(),
  })
  .refine(
    (data) => data.uploaded_documents.length === data.required_documents.length,
    {
      message:
        "The number of uploaded documents must match the number of required documents",
      path: ["uploaded_documents"],
    }
  );

export const updateProfileOrganizer = z.object({
  organizer_name: z.string().min(3).max(150),
  description: z.string().min(3).max(300),
  logo: z
    .instanceof(File, { message: "Input type is image" })
    .refine(
      (file) => ["image/png", "image/jpeg", "image/jpg"].includes(file.type),
      { message: "Invalid image file type" }
    )
    .optional(),
  banner: z
    .instanceof(File, { message: "Input type is image" })
    .refine(
      (file) => ["image/png", "image/jpeg", "image/jpg"].includes(file.type),
      { message: "Invalid image file type" }
    )
    .optional(),
  contact_person: z.string().min(3).max(150),
  contact_phone: z.string().min(3).max(150),
  contact_email: z.string().min(3).max(150),
});

export type CreateOrganizer = z.infer<typeof createOrganizer>;
export type CreateProfileOrganizer = z.infer<typeof createProfileOrganizer>;
export type CreateAddressOrganizer = z.infer<typeof createAddressOrganizer>;
export type CreatePortfolioOrganizer = z.infer<typeof createPortfolioOrganizer>;
export type CreateBankOrganizer = z.infer<typeof createBankOrganizer>;
export type CreateDocumentOrganizer = z.infer<typeof createDocumentOrganizer>;

export type UpdateProfileOrganizer = z.infer<typeof updateProfileOrganizer>;
