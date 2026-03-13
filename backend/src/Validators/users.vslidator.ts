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

  // ✅ Profile completion fields
  pronouns: z.enum(["HE_HIM", "SHE_HER", "THEY_THEM", "OTHER"]).optional(),
  relationshipIntention: z
    .enum(["MARRIAGE", "LONG_TERM", "LONG_TERM_OPEN_SHORT", "SHORT_TERM_OPEN_LONG", "CASUAL", "FRIENDSHIP", "FIGURING_OUT"])
    .optional(),
  hasChildren: z.enum(["YES", "NO"]).optional(),
  wantsChildren: z.enum(["WANT", "DONT_WANT", "NOT_SURE"]).optional(),
  smoking: z.enum(["NON_SMOKER", "OCCASIONALLY", "SMOKER"]).optional(),
  drinking: z.enum(["NEVER", "SOCIALLY", "REGULARLY"]).optional(),
  fitnessLevel: z.enum(["VERY_ACTIVE", "MODERATELY_ACTIVE", "NOT_ACTIVE"]).optional(),
  educationLevel: z.enum(["HIGH_SCHOOL", "COLLEGE", "BACHELORS", "MASTERS", "PHD"]).optional(),
  occupation: z.string().max(255).optional(),
  industry: z.string().max(255).optional(),
  ethnicity: z.string().max(255).optional(),
});

export type TUserValidator = z.infer<typeof userValidator>;

// ✅ Validator for discovery preferences (used in profile/discovery route)
export const discoveryPreferencesValidator = z.object({
  minAge: z.number().int().min(18).max(100).optional(),
  maxAge: z.number().int().min(18).max(100).optional(),
  distanceKm: z.number().int().min(1).optional(),
  distancePreference: z.enum(["KM_10", "KM_50", "KM_100", "GLOBAL"]).optional(),
  showLocation: z.boolean().optional(),
}).refine(
  (data) => !data.minAge || !data.maxAge || data.minAge <= data.maxAge,
  { message: "minAge must be <= maxAge", path: ["minAge"] }
);

export type TDiscoveryPreferencesValidator = z.infer<typeof discoveryPreferencesValidator>;

// ✅ Validator for setting languages (array of language IDs)
export const userLanguagesValidator = z.object({
  languageIds: z.array(z.string().uuid()).min(1, "At least one language required"),
});

// ✅ Validator for setting personality traits (array of trait IDs)
export const userPersonalityTraitsValidator = z.object({
  traitIds: z.array(z.string().uuid()).min(1, "At least one trait required"),
});

// ✅ Validator for setting interested-in genders
export const userInterestedInValidator = z.object({
  genders: z
    .array(z.enum(["MALE", "FEMALE", "NON_BINARY", "OTHER"]))
    .min(1, "Select at least one option"),
});

// ✅ Validator for setting interests (array of interest IDs)
export const userInterestsValidator = z.object({
  interestIds: z.array(z.string().uuid()).min(1, "At least one interest required"),
});

