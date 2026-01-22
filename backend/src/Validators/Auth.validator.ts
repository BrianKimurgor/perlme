import { z } from "zod";

// Helper: validate 18+ age
const isAtLeast18 = (date: Date) => {
  const today = new Date();
  const age = today.getFullYear() - date.getFullYear();
  const hasBirthdayPassed =
    today.getMonth() > date.getMonth() ||
    (today.getMonth() === date.getMonth() &&
      today.getDate() >= date.getDate());
  return hasBirthdayPassed ? age >= 18 : age - 1 >= 18;
};

// Password strength validator
const strongPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password cannot exceed 128 characters")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^a-zA-Z0-9]/,
    "Password must contain at least one special character"
  );

// Email sanitization
const emailSchema = z
  .string()
  .email("Invalid email address")
  .transform((email) => email.toLowerCase().trim());

// ========================== USER REGISTRATION ==========================
export const registerUserValidator = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username cannot exceed 50 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, hyphens, and underscores"
    )
    .transform((username) => username.trim()),

  email: emailSchema,

  // 🔒 Changed from "passwordHash" to "password" (plain text input)
  password: strongPasswordSchema,

  dateOfBirth: z.coerce
    .date({
      required_error: "Date of birth is required",
      invalid_type_error: "Invalid date of birth format",
    })
    .refine((date) => isAtLeast18(date), {
      message: "You must be at least 18 years old to register.",
    }),

  gender: z
    .enum(["MALE", "FEMALE", "NON_BINARY", "OTHER"])
    .optional()
    .default("OTHER"),

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
    .optional()
    .default("OTHER"),

  bio: z
    .string()
    .max(1000, "Bio cannot exceed 1000 characters")
    .optional()
    .default("")
    .transform((bio) => bio.trim()),

  // URL validation with XSS prevention
  avatarUrl: z
    .string()
    .url("Invalid avatar URL")
    .regex(/^https?:\/\//, "Avatar URL must use HTTP or HTTPS")
    .optional()
    .nullable(),

  coverPhotoUrl: z
    .string()
    .url("Invalid cover photo URL")
    .regex(/^https?:\/\//, "Cover photo URL must use HTTP or HTTPS")
    .optional()
    .nullable(),

  visibility: z
    .enum(["PUBLIC", "PRIVATE", "FRIENDS_ONLY"])
    .optional()
    .default("PUBLIC"),

  role: z
    .enum(["REGULAR", "CREATOR", "MODERATOR", "ADMIN"])
    .optional()
    .default("REGULAR"),
});

// ========================== USER LOGIN ==========================
export const loginUserValidator = z.object({
  email: emailSchema,

  // 🔒 Changed from "passwordHash" to "password"
  password: z
    .string()
    .min(1, "Password is required")
    .max(128, "Password cannot exceed 128 characters"),
});

// ========================== PASSWORD UPDATE ==========================
export const updatePasswordValidator = z.object({
  email: emailSchema,
  newPassword: strongPasswordSchema,
});

// ========================== EMAIL VERIFICATION ==========================
export const verifyEmailValidator = z.object({
  email: emailSchema,
  confirmationCode: z
    .string()
    .length(8, "Confirmation code must be 8 digits") // Updated from 6 to 8
    .regex(/^\d+$/, "Confirmation code must contain only digits"),
});

// ========================== PROFILE UPDATE ==========================
export const updateProfileValidator = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username cannot exceed 50 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, hyphens, and underscores"
    )
    .optional()
    .transform((username) => username?.trim()),

  bio: z
    .string()
    .max(1000, "Bio cannot exceed 1000 characters")
    .optional()
    .transform((bio) => bio?.trim()),

  avatarUrl: z
    .string()
    .url("Invalid avatar URL")
    .regex(/^https?:\/\//, "Avatar URL must use HTTP or HTTPS")
    .optional(),

  coverPhotoUrl: z
    .string()
    .url("Invalid cover photo URL")
    .regex(/^https?:\/\//, "Cover photo URL must use HTTP or HTTPS")
    .optional(),

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

// ========================== REFRESH TOKEN ==========================
export const refreshTokenValidator = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});
