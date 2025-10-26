import { z } from "zod";

// ========================== ENUMS ==========================
// Enum for group roles — includes all possible group permissions
export const groupRoleEnum = z.enum([
  "GROUP_ADMIN",      // Full control: can edit/delete group, manage members
  "GROUP_MODERATOR",  // Limited admin: can remove users or messages
  "GROUP_MEMBER",     // Regular participant
  "GROUP_REMOVED",    // User was removed/banned from the group
]);

// ========================== GROUP CHAT VALIDATOR ==========================
// Defines validation for group creation and updates
export const groupChatValidator = z.object({
  name: z
    .string()
    .min(3, "Group name must be at least 3 characters long")
    .max(255, "Group name cannot exceed 255 characters"),
  
  description: z
    .string()
    .max(1000, "Description too long (max 1000 chars)")
    .optional(),

  avatarUrl: z
    .string()
    .url("Invalid avatar URL")
    .optional(),

  topic: z
    .string()
    .max(100, "Topic name too long (max 100 chars)")
    .optional(),

  isPrivate: z.boolean().default(false),

  isDeleted: z.boolean().optional().default(false),

  // ID of the user creating the group — validated as UUID
  creatorId: z.string().uuid("Invalid creator ID"),

  // Optional metadata for audit purposes
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type TGroupChatValidator = z.infer<typeof groupChatValidator>;

// ========================== GROUP MEMBER VALIDATOR ==========================
// Validation for group members joining or role changes
export const groupMemberValidator = z.object({
  groupId: z.string().uuid("Invalid group ID"),
  userId: z.string().uuid("Invalid user ID"),
  role: groupRoleEnum.default("GROUP_MEMBER"),

  joinedAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type TGroupMemberValidator = z.infer<typeof groupMemberValidator>;

// ========================== GROUP MESSAGE VALIDATOR ==========================
// Validation for messages sent in a group chat
export const groupMessageValidator = z.object({
  groupId: z.string().uuid("Invalid group ID"),
  senderId: z.string().uuid("Invalid sender ID"),

  content: z
    .string()
    .min(1, "Message content cannot be empty")
    .max(5000, "Message too long"),

  mediaUrl: z
    .string()
    .url("Invalid media URL")
    .optional(),

  mediaType: z
    .string()
    .max(50, "Invalid media type format")
    .optional(),

  isEdited: z.boolean().optional().default(false),
  isDeleted: z.boolean().optional().default(false),

  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type TGroupMessageValidator = z.infer<typeof groupMessageValidator>;
