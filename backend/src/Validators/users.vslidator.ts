import { z } from "zod";

export const userValidator = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  passwordHash: z.string().min(6),
  dateOfBirth: z
    .string()
    .transform((val) => new Date(val))
    .refine((date) => !isNaN(date.getTime()), "Invalid date"),
  gender: z.enum(["MALE", "FEMALE", "NON_BINARY", "OTHER"]).optional(),
  orientation: z
    .enum(["STRAIGHT", "GAY", "LESBIAN", "BISEXUAL", "ASEXUAL", "PANSEXUAL", "OTHER"])
    .optional(),
  bio: z.string().optional(),
  avatarUrl: z.string().url("Invalid URL").optional(),
  coverPhotoUrl: z.string().url("Invalid URL").optional(),
  visibility: z.enum(["PUBLIC", "PRIVATE", "FRIENDS_ONLY"]).default("PUBLIC"),
  role: z.enum(["REGULAR", "CREATOR", "MODERATOR", "ADMIN"]).default("REGULAR"),

  // ✅ Suspension fields
  isSuspended: z.boolean().optional().default(false),
  suspendedUntil: z.coerce.date().optional(),
});

export type TUserValidator = z.infer<typeof userValidator>;
