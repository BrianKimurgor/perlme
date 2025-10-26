import { z } from "zod";

// Helper: validate 18+ age
const isAtLeast18 = (date: Date) => {
  const today = new Date();
  const age = today.getFullYear() - date.getFullYear();
  const hasBirthdayPassed =
    today.getMonth() > date.getMonth() ||
    (today.getMonth() === date.getMonth() && today.getDate() >= date.getDate());
  return hasBirthdayPassed ? age >= 18 : age - 1 >= 18;
};

// ========================== USER REGISTRATION ==========================
export const registerUserValidator = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username cannot exceed 50 characters"),
  email: z.string().email("Invalid email address"),
  passwordHash: z.string().min(6, "Password must be at least 6 characters"),

  // 👇 Use coercion to ensure it's always a Date object
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

  bio: z.string().max(1000).optional().default(""),
  
  // ✅ Optional with no URL validation required
  avatarUrl: z.string().optional().nullable(),
  coverPhotoUrl: z.string().optional().nullable(),

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
    .length(6, "Confirmation code must be 6 digits"),
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
