import { pgTable, uuid, varchar, text, timestamp, boolean, doublePrecision, pgEnum, integer, } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ========================== ENUMS ==========================

export const userRoleEnum = pgEnum("user_role", ["REGULAR", "CREATOR", "MODERATOR", "ADMIN",]);

export const genderEnum = pgEnum("gender", ["MALE", "FEMALE", "NON_BINARY", "OTHER",]);

export const orientationEnum = pgEnum("orientation", ["STRAIGHT", "GAY", "LESBIAN", "BISEXUAL", "ASEXUAL", "PANSEXUAL", "OTHER",]);

export const visibilityEnum = pgEnum("visibility", ["PUBLIC", "PRIVATE", "FRIENDS_ONLY",]);

export const messageStatusEnum = pgEnum("message_status", ["SENT", "DELIVERED", "READ",]);

export const reportStatusEnum = pgEnum("report_status", ["PENDING", "REVIEWED", "RESOLVED", "DISMISSED",]);

export const notificationTypeEnum = pgEnum("notification_type", ["MESSAGE", "LIKE", "COMMENT", "REPOST", "FOLLOW", "TIP", "SUBSCRIPTION", "ADMIN_MESSAGE", "MATCH",]);

export const locationVisibilityEnum = pgEnum("location_visibility", ["VISIBLE", "HIDDEN",]);

export const preferenceTypeEnum = pgEnum("preference_type", ["AGE", "DISTANCE", "GENDER", "INTEREST",]);

export const groupRoleEnum = pgEnum("group_role", ["GROUP_ADMIN","GROUP_MODERATOR","GROUP_MEMBER","GROUP_REMOVED"]);

// ========================== ENUMS (extended) ==========================
export const reportTypeEnum = pgEnum("report_type", ["USER","POST","COMMENT","MESSAGE",  "GROUP_MESSAGE",]);

export const reportActionEnum = pgEnum("report_action", ["NONE",  "REMOVE_CONTENT",]);

// ========================== USERS ==========================
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 255 }).unique().notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  dateOfBirth: timestamp("date_of_birth").notNull(),
  gender: genderEnum("gender"),
  orientation: orientationEnum("orientation"),
  isSuspended: boolean("is_suspended").default(false),
  suspendedUntil: timestamp("suspended_until"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  coverPhotoUrl: text("cover_photo_url"),
  isVerified: boolean("is_verified").default(false),
  confirmationCode: varchar("confirmation_code", { length: 255 }),
  confirmationCodeExpiresAt: timestamp("confirmation_code_expires_at"),
  visibility: visibilityEnum("visibility").default("PUBLIC"),
  role: userRoleEnum("role").default("REGULAR").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});


// ========================== INTERESTS ==========================
export const interests = pgTable("interests", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).unique().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Pivot: Users ↔ Interests
export const userInterests = pgTable("user_interests", {
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  interestId: uuid("interest_id")
    .references(() => interests.id, { onDelete: "cascade" })
    .notNull(),
  assignedAt: timestamp("assigned_at").defaultNow(),
});

// ========================== FOLLOWS ==========================
export const follows = pgTable("follows", {
  id: uuid("id").primaryKey().defaultRandom(),
  followerId: uuid("follower_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  followingId: uuid("following_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ========================== BLOCKS ==========================
export const blocks = pgTable("blocks", {
  id: uuid("id").primaryKey().defaultRandom(),
  blockerId: uuid("blocker_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  blockedId: uuid("blocked_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ========================== MESSAGES ==========================
export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  senderId: uuid("sender_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  receiverId: uuid("receiver_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  content: text("content").notNull(),
  mediaUrl: text("media_url"),
  mediaType: varchar("media_type", { length: 50 }),
  status: messageStatusEnum("status").default("SENT"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ========================== POSTS ==========================
export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  authorId: uuid("author_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ========================== MEDIA (for posts) ==========================
export const media = pgTable("media", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id")
    .references(() => posts.id, { onDelete: "cascade" })
    .notNull(),
  url: text("url").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // image, video, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

// ========================== COMMENTS ==========================
export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id")
    .references(() => posts.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ========================== LIKES ==========================
export const likes = pgTable("likes", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id")
    .references(() => posts.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ========================== TAGS ==========================
export const tags = pgTable("tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).unique().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Pivot: Posts ↔ Tags
export const postTags = pgTable("post_tags", {
  postId: uuid("post_id")
    .references(() => posts.id, { onDelete: "cascade" })
    .notNull(),
  tagId: uuid("tag_id")
    .references(() => tags.id, { onDelete: "cascade" })
    .notNull(),
  assignedAt: timestamp("assigned_at").defaultNow(),
});

// ========================== REPORTS (Enhanced) ==========================
export const reports = pgTable("reports", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Who reported
  reporterId: uuid("reporter_id").references(() => users.id, { onDelete: "cascade" }).notNull(),

  // Who or what is being reported
  reportedUserId: uuid("reported_user_id").references(() => users.id, { onDelete: "cascade" })    .notNull(),

  // Optional — if this is content-based reporting
  postId: uuid("post_id").references(() => posts.id, { onDelete: "set null" }),
  commentId: uuid("comment_id").references(() => comments.id, { onDelete: "set null" }),
  messageId: uuid("message_id").references(() => messages.id, { onDelete: "set null" }),
  groupMessageId: uuid("group_message_id").references(() => groupMessages.id, { onDelete: "set null" }),
   // 👇 New field for moderation actions
  action: reportActionEnum("action").default("NONE").notNull(),

  // Report details
  type: reportTypeEnum("type").default("USER"),
  reason: text("reason").notNull(),
  details: text("details"), // optional additional context

  // Moderation lifecycle
  status: reportStatusEnum("status").default("PENDING"),
  reviewedBy: uuid("reviewed_by").references(() => users.id, { onDelete: "set null" }),
  resolutionNotes: text("resolution_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});


// ========================== LOCATIONS ==========================
export const locations = pgTable("locations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull()
    .unique(), // ensures one location per user
  country: varchar("country", { length: 100 }),
  city: varchar("city", { length: 100 }),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  visibility: locationVisibilityEnum("visibility").default("VISIBLE"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ========================== USER PREFERENCES ==========================
export const userPreferences = pgTable("user_preferences", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  type: preferenceTypeEnum("type").notNull(),
  value: varchar("value", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// ========================== GROUP CHATS ==========================
export const groupChats = pgTable("group_chats", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  creatorId: uuid("creator_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  avatarUrl: text("avatar_url"),
  isPrivate: boolean("is_private").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ========================== GROUP MEMBERS ==========================
export const groupMembers = pgTable("group_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  groupId: uuid("group_id")
    .references(() => groupChats.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  role: groupRoleEnum("role").default("GROUP_MEMBER").notNull(),
  joinedAt: timestamp("joined_at").defaultNow(),
});

// ========================== GROUP MESSAGES ==========================
export const groupMessages = pgTable("group_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  groupId: uuid("group_id")
    .references(() => groupChats.id, { onDelete: "cascade" })
    .notNull(),
  senderId: uuid("sender_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  content: text("content").notNull(),
  mediaUrl: text("media_url"),
  mediaType: varchar("media_type", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// ========================== POST METRICS ==========================
export const postMetrics = pgTable("post_metrics", {
  postId: uuid("post_id")
    .references(() => posts.id, { onDelete: "cascade" })
    .primaryKey(),
  likeCount: integer("like_count").default(0),
  commentCount: integer("comment_count").default(0),
  shareCount: integer("share_count").default(0),
  viewCount: integer("view_count").default(0),
  score: doublePrecision("score").default(0), // trending score
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ========================== USER METRICS ==========================
export const userMetrics = pgTable("user_metrics", {
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .primaryKey(),
  followersCount: integer("followers_count").default(0),
  followingCount: integer("following_count").default(0),
  postsCount: integer("posts_count").default(0),
  likesReceived: integer("likes_received").default(0),
  engagementScore: doublePrecision("engagement_score").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ========================== GROUP TAGS ==========================
export const groupTags = pgTable("group_tags", {
  groupId: uuid("group_id")
    .references(() => groupChats.id, { onDelete: "cascade" })
    .notNull(),
  tagId: uuid("tag_id")
    .references(() => tags.id, { onDelete: "cascade" })
    .notNull(),
  assignedAt: timestamp("assigned_at").defaultNow(),
});

// ========================== INTERACTIONS ==========================
export const interactions = pgTable("interactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(), // actor
  targetUserId: uuid("target_user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(), // recipient
  type: varchar("type", { length: 50 }).notNull(), // e.g. "VIEW", "FOLLOW", "LIKE_PROFILE"
  createdAt: timestamp("created_at").defaultNow(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  posts: many(posts),
  messagesSent: many(messages, { relationName: "sender" }),
  messagesReceived: many(messages, { relationName: "receiver" }),
  interests: many(userInterests),
  followers: many(follows, { relationName: "follower" }),
  following: many(follows, { relationName: "following" }),
  likes: many(likes),
  comments: many(comments),
  blocks: many(blocks, { relationName: "blocker" }),
  blockedBy: many(blocks, { relationName: "blocked" }),
  reportsMade: many(reports, { relationName: "reporter" }),
  reportsReceived: many(reports, { relationName: "reportedUser" }),
  // ✅ FIXED: user has one location
  location: one(locations, { fields: [users.id], references: [locations.userId] }),
  preferences: many(userPreferences),
}));



export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, { fields: [posts.authorId], references: [users.id] }),
  likes: many(likes),
  comments: many(comments),
  tags: many(postTags),
  media: many(media),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  post: one(posts, { fields: [likes.postId], references: [posts.id] }),
  user: one(users, { fields: [likes.userId], references: [users.id] }),
}));

export const mediaRelations = relations(media, ({ one }) => ({
  post: one(posts, { fields: [media.postId], references: [posts.id] }),
}));

export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(posts, { fields: [postTags.postId], references: [posts.id] }),
  tag: one(tags, { fields: [postTags.tagId], references: [tags.id] }),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  reporter: one(users, { fields: [reports.reporterId], references: [users.id] }),
  reportedUser: one(users, { fields: [reports.reportedUserId], references: [users.id] }),
  reviewedByUser: one(users, { fields: [reports.reviewedBy], references: [users.id] }),
  post: one(posts, { fields: [reports.postId], references: [posts.id] }),
  comment: one(comments, { fields: [reports.commentId], references: [comments.id] }),
  message: one(messages, { fields: [reports.messageId], references: [messages.id] }),
  groupMessage: one(groupMessages, { fields: [reports.groupMessageId],references: [groupMessages.id], }),
}));


export const groupChatsRelations = relations(groupChats, ({ one, many }) => ({
  creator: one(users, { fields: [groupChats.creatorId], references: [users.id] }),
  members: many(groupMembers),
  messages: many(groupMessages),
}));

export const groupMembersRelations = relations(groupMembers, ({ one }) => ({
  group: one(groupChats, { fields: [groupMembers.groupId], references: [groupChats.id] }),
  user: one(users, { fields: [groupMembers.userId], references: [users.id] }),
}));

export const groupMessagesRelations = relations(groupMessages, ({ one }) => ({
  group: one(groupChats, { fields: [groupMessages.groupId], references: [groupChats.id] }),
  sender: one(users, { fields: [groupMessages.senderId], references: [users.id] }),
}));

export const postMetricsRelations = relations(postMetrics, ({ one }) => ({
  post: one(posts, {
    fields: [postMetrics.postId],
    references: [posts.id],
  }),
}));

export const userMetricsRelations = relations(userMetrics, ({ one }) => ({
  user: one(users, {
    fields: [userMetrics.userId],
    references: [users.id],
  }),
}));

export const groupTagsRelations = relations(groupTags, ({ one }) => ({
  group: one(groupChats, {
    fields: [groupTags.groupId],
    references: [groupChats.id],
  }),
  tag: one(tags, {
    fields: [groupTags.tagId],
    references: [tags.id],
  }),
}));

export const interactionsRelations = relations(interactions, ({ one }) => ({
  user: one(users, {
    fields: [interactions.userId],
    references: [users.id],
    relationName: "interactionActor",
  }),
  targetUser: one(users, {
    fields: [interactions.targetUserId],
    references: [users.id],
    relationName: "interactionTarget",
  }),
}));
// ========================== TYPES ==========================
export type TSelectUser = typeof users.$inferSelect;
export type TInsertUser = typeof users.$inferInsert;

export type TSelectInterest = typeof interests.$inferSelect;
export type TInsertInterest = typeof interests.$inferInsert;

export type TSelectFollow = typeof follows.$inferSelect;
export type TInsertFollow = typeof follows.$inferInsert;

export type TSelectMessage = typeof messages.$inferSelect;
export type TInsertMessage = typeof messages.$inferInsert;

export type TSelectPost = typeof posts.$inferSelect;
export type TInsertPost = typeof posts.$inferInsert;

export type TSelectComment = typeof comments.$inferSelect;
export type TInsertComment = typeof comments.$inferInsert;

export type TSelectLike = typeof likes.$inferSelect;
export type TInsertLike = typeof likes.$inferInsert;

export type TSelectBlock = typeof blocks.$inferSelect;
export type TInsertBlock = typeof blocks.$inferInsert;

export type TSelectLocation = typeof locations.$inferSelect;
export type TInsertLocation = typeof locations.$inferInsert;

export type TSelectUserPreference = typeof userPreferences.$inferSelect;
export type TInsertUserPreference = typeof userPreferences.$inferInsert;

export type TSelectTag = typeof tags.$inferSelect;
export type TInsertTag = typeof tags.$inferInsert;

export type TSelectPostTag = typeof postTags.$inferSelect;
export type TInsertPostTag = typeof postTags.$inferInsert;

export type TSelectMedia = typeof media.$inferSelect;
export type TInsertMedia = typeof media.$inferInsert;

export type TSelectReport = typeof reports.$inferSelect;
export type TInsertReport = typeof reports.$inferInsert;

export type TSelectGroupChat = typeof groupChats.$inferSelect;
export type TInsertGroupChat = typeof groupChats.$inferInsert;

export type TSelectGroupMember = typeof groupMembers.$inferSelect;
export type TInsertGroupMember = typeof groupMembers.$inferInsert;

export type TSelectGroupMessage = typeof groupMessages.$inferSelect;
export type TInsertGroupMessage = typeof groupMessages.$inferInsert;

export type TSelectPostMetric = typeof postMetrics.$inferSelect;
export type TInsertPostMetric = typeof postMetrics.$inferInsert;

export type TSelectUserMetric = typeof userMetrics.$inferSelect;
export type TInsertUserMetric = typeof userMetrics.$inferInsert;

export type TSelectGroupTag = typeof groupTags.$inferSelect;
export type TInsertGroupTag = typeof groupTags.$inferInsert;

export type TSelectInteraction = typeof interactions.$inferSelect;
export type TInsertInteraction = typeof interactions.$inferInsert;