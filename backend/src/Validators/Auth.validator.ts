import { z } from "zod";

// ========================== USER REGISTRATION ==========================
export const registerUserValidator = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  passwordHash: z.string().min(6, "Password must be at least 6 characters"),
  dateOfBirth: z
    .string()
    .transform((val) => new Date(val))
    .refine((date) => !isNaN(date.getTime()), "Invalid date of birth"),
  gender: z.enum(["MALE", "FEMALE", "NON_BINARY", "OTHER"]).optional(),
  orientation: z
    .enum([
      "STRAIGHT",
      "GAY",
      "LESBIAN",
      "BISEXUAL",
      "ASEXUAL",
      "PANSEXUAL",
      "OTHER",
    ])
    .optional(),
  bio: z.string().optional().default(""),
  avatarUrl: z.string().optional().default(""),
  coverPhotoUrl: z.string().optional().default(""),
  visibility: z.enum(["PUBLIC", "PRIVATE", "FRIENDS_ONLY"]).optional().default("PUBLIC"),
  role: z.enum(["REGULAR", "CREATOR", "MODERATOR", "ADMIN"]).optional().default("REGULAR"),
});

// ========================== USER LOGIN ==========================
export const loginUserValidator = z.object({
  email: z.string().email("Invalid email address"),
  passwordHash: z.string().min(6, "Password must be at least 6 characters"),
});

// ========================== PASSWORD UPDATE ==========================
export const updatePasswordValidator = z.object({
  email: z.string().email("Invalid email address"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

// ========================== EMAIL VERIFICATION ==========================
export const verifyEmailValidator = z.object({
  email: z.string().email("Invalid email address"),
  confirmationCode: z
    .string()
    .length(6, "Confirmation code must be 6 characters"),
});

// ========================== PROFILE UPDATE ==========================
export const updateProfileValidator = z.object({
  username: z.string().min(3).optional(),
  bio: z.string().optional(),
  avatarUrl: z.string().optional(),
  coverPhotoUrl: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "NON_BINARY", "OTHER"]).optional(),
  orientation: z
    .enum([
      "STRAIGHT",
      "GAY",
      "LESBIAN",
      "BISEXUAL",
      "ASEXUAL",
      "PANSEXUAL",
      "OTHER",
    ])
    .optional(),
  visibility: z.enum(["PUBLIC", "PRIVATE", "FRIENDS_ONLY"]).optional(),
});
