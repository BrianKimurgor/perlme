import { pgTable, uuid, varchar, text, timestamp, boolean, doublePrecision, pgEnum, index, } from "drizzle-orm/pg-core";
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
}, (table) => [
  index("idx_users_created_at").on(table.createdAt.desc()),
  index("idx_users_email").on(table.email),
  index("idx_users_username").on(table.username),
]);

// ========================== INTERESTS ==========================
export const interests = pgTable("interests", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).unique().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_interests_name").on(table.name),
]);

// Pivot: Users ↔ Interests
export const userInterests = pgTable("user_interests", {
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  interestId: uuid("interest_id")
    .references(() => interests.id, { onDelete: "cascade" })
    .notNull(),
  assignedAt: timestamp("assigned_at").defaultNow(),
}, (table) => [
  index("idx_user_interests_user_id").on(table.userId),
  index("idx_user_interests_interest_id").on(table.interestId),
]);

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
}, (table) => [
  index("idx_follows_follower_id").on(table.followerId),
  index("idx_follows_following_id").on(table.followingId),
  index("idx_follows_created_at").on(table.createdAt.desc()),
]);

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
}, (table) => [
  index("idx_blocks_blocker_id").on(table.blockerId),
  index("idx_blocks_blocked_id").on(table.blockedId),
]);

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
}, (table) => [
  index("idx_messages_sender_id").on(table.senderId),
  index("idx_messages_receiver_id").on(table.receiverId),
  index("idx_messages_created_at").on(table.createdAt.desc()),
  index("idx_messages_status").on(table.status),
]);

// ========================== POSTS ==========================
export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  authorId: uuid("author_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_posts_created_at").on(table.createdAt.desc()),
  index("idx_posts_author_id").on(table.authorId),
]);

// ========================== MEDIA (for posts) ==========================
export const media = pgTable("media", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id")
    .references(() => posts.id, { onDelete: "cascade" })
    .notNull(),
  url: text("url").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // image, video, etc.
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_media_post_id").on(table.postId),
  index("idx_media_created_at").on(table.createdAt.desc()),
]);

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
}, (table) => [
  index("idx_comments_post_id").on(table.postId),
  index("idx_comments_user_id").on(table.userId),
  index("idx_comments_created_at").on(table.createdAt.desc()),
]);

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
}, (table) => [
  index("idx_likes_post_id").on(table.postId),
  index("idx_likes_user_id").on(table.userId),
  index("idx_likes_created_at").on(table.createdAt.desc()),
]);

// ========================== TAGS ==========================
export const tags = pgTable("tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).unique().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_tags_name").on(table.name),
]);

// Pivot: Posts ↔ Tags
export const postTags = pgTable("post_tags", {
  postId: uuid("post_id")
    .references(() => posts.id, { onDelete: "cascade" })
    .notNull(),
  tagId: uuid("tag_id")
    .references(() => tags.id, { onDelete: "cascade" })
    .notNull(),
  assignedAt: timestamp("assigned_at").defaultNow(),
}, (table) => [
  index("idx_post_tags_post_id").on(table.postId),
  index("idx_post_tags_tag_id").on(table.tagId),
]);

// ========================== REPORTS ==========================
export const reports = pgTable("reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  reporterId: uuid("reporter_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  reportedUserId: uuid("reported_user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  reason: text("reason").notNull(),
  status: reportStatusEnum("status").default("PENDING"),
  createdAt: timestamp("created_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
}, (table) => [
  index("idx_reports_reporter_id").on(table.reporterId),
  index("idx_reports_reported_user_id").on(table.reportedUserId),
  index("idx_reports_status").on(table.status),
  index("idx_reports_created_at").on(table.createdAt.desc()),
]);

// ========================== LOCATIONS ==========================
export const locations = pgTable("locations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  country: varchar("country", { length: 100 }),
  city: varchar("city", { length: 100 }),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  visibility: locationVisibilityEnum("visibility").default("VISIBLE"),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_locations_user_id").on(table.userId),
  index("idx_locations_country").on(table.country),
  index("idx_locations_city").on(table.city),
]);

// ========================== USER PREFERENCES ==========================
export const userPreferences = pgTable("user_preferences", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  type: preferenceTypeEnum("type").notNull(),
  value: varchar("value", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_user_preferences_user_id").on(table.userId),
  index("idx_user_preferences_type").on(table.type),
]);

// ========================== RELATIONSHIPS ==========================
export const usersRelations = relations(users, ({ many }) => ({
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
  location: many(locations),
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
  reportedUser: one(users, {
    fields: [reports.reportedUserId],
    references: [users.id],
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
