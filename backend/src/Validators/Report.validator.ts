import { z } from "zod";

// ========================== ENUMS ==========================

// Type of report (what’s being reported)
export const reportTypeEnum = z.enum([
  "USER",
  "POST",
  "COMMENT",
  "MESSAGE",
  "GROUP_MESSAGE",
]);

// Current moderation status
export const reportStatusEnum = z.enum([
  "PENDING",
  "REVIEWED",
  "RESOLVED",
  "DISMISSED",
]);

// Moderator action taken (optional)
export const reportActionEnum = z.enum(["NONE", "REMOVE_CONTENT"]);

// ========================== VALIDATORS ==========================

// 🔹 Create report schema
export const createReportValidator = z.object({
  reporterId: z.string().uuid({ message: "Invalid reporter ID" }),
  reportedUserId: z.string().uuid({ message: "Invalid reported user ID" }),

  // Optional references to the content being reported
  postId: z.string().uuid().optional(),
  commentId: z.string().uuid().optional(),
  messageId: z.string().uuid().optional(),
  groupMessageId: z.string().uuid().optional(),

  type: reportTypeEnum.default("USER"),
  reason: z
    .string()
    .min(3, { message: "Reason must be at least 3 characters" })
    .max(500, { message: "Reason too long" }),
  details: z.string().max(1000).optional(),
});

// 🔹 Update report (for admin/moderator actions)
export const updateReportValidator = z.object({
  status: reportStatusEnum.optional(),
  action: reportActionEnum.optional().default("NONE"), // 👈 Added for moderator decisions
  reviewedBy: z.string().uuid().optional(), // moderator/admin ID
  resolutionNotes: z
    .string()
    .max(1000, { message: "Resolution notes too long" })
    .optional(),
});

// 🔹 Filter/search validator (for admin dashboards or queries)
export const reportQueryValidator = z.object({
  type: reportTypeEnum.optional(),
  status: reportStatusEnum.optional(),
  reporterId: z.string().uuid().optional(),
  reportedUserId: z.string().uuid().optional(),
});

// ========================== TYPES ==========================
export type TCreateReport = z.infer<typeof createReportValidator>;
export type TUpdateReport = z.infer<typeof updateReportValidator>;
export type TReportQuery = z.infer<typeof reportQueryValidator>;
export type TReportAction = z.infer<typeof reportActionEnum>;
