import { z } from "zod";

/**
 * Helper: Parse booleans from string query params
 * Example: "true" → true, "false" → false
 */
const parseBoolean = (val: string | undefined, defaultValue = true) => {
  if (val === undefined) return defaultValue;
  return val.toLowerCase() === "true";
};

/**
 * Unified validator for both:
 * - 🧭 Explore Feed (discover posts, users, groups, creators)
 * - ❤️ Recommendation Feed (discover compatible users)
 */
export const exploreAndRecommendValidator = z.object({
  // ========== COMMON (pagination, context) ==========
  userId: z.string().uuid("Invalid user ID").optional(),

  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Number.parseInt(val, 10) : 20))
    .refine((val) => val > 0 && val <= 100, {
      message: "Limit must be between 1 and 100",
    }),

  offset: z
    .string()
    .optional()
    .transform((val) => (val ? Number.parseInt(val, 10) : 0))
    .refine((val) => val >= 0, {
      message: "Offset must be 0 or greater",
    }),

  // ========== EXPLORE FILTERS ==========
  includeCreators: z
    .string()
    .optional()
    .transform((val) => parseBoolean(val, true)),

  includeGroups: z
    .string()
    .optional()
    .transform((val) => parseBoolean(val, true)),

  tags: z
    .string()
    .optional()
    .transform((val) =>
      val ? val.split(",").map((t) => t.trim()).filter(Boolean) : []
    ),

  // ========== RECOMMENDATION FILTERS ==========
  gender: z
    .enum(["MALE", "FEMALE", "NON_BINARY", "OTHER"])
    .optional(),

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

  minAge: z
    .string()
    .optional()
    .transform((val) => (val ? Number.parseInt(val, 10) : 18)),

  maxAge: z
    .string()
    .optional()
    .transform((val) => (val ? Number.parseInt(val, 10) : 99)),

  distanceKm: z
    .string()
    .optional()
    .transform((val) => (val ? Number.parseInt(val, 10) : undefined)),

  interests: z
    .string()
    .optional()
    .transform((val) =>
      val ? val.split(",").map((t) => t.trim()).filter(Boolean) : []
    ),
});

/**
 * Type inference for TypeScript usage
 */
export type ExploreAndRecommendParams = z.infer<typeof exploreAndRecommendValidator>;
