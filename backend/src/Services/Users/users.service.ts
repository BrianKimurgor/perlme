import { and, eq, sql } from "drizzle-orm";
import db from "../../drizzle/db";
import { follows, users, posts } from "../../drizzle/schema";

import bcrypt from "bcrypt";
import { TUserValidator, userValidator } from "../../Validators/users.vslidator";

// ========================== GET ALL USERS ==========================
export const getAllUsers = async () => {
  const allUsers = await db.select().from(users);
  return allUsers;
};

// ========================== GET USER BY ID ==========================
export const getUserById = async (id: string) => {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  
  if (!user) return null;

  // Get counts for followers, following, and posts
  const [followersCount] = await db
    .select({ count: sql<number>`cast(count(*) as integer)` })
    .from(follows)
    .where(eq(follows.followingId, id));

  const [followingCount] = await db
    .select({ count: sql<number>`cast(count(*) as integer)` })
    .from(follows)
    .where(eq(follows.followerId, id));

  const [postsCount] = await db
    .select({ count: sql<number>`cast(count(*) as integer)` })
    .from(posts)
    .where(eq(posts.authorId, id));

  return {
    ...user,
    _count: {
      followers: followersCount?.count || 0,
      following: followingCount?.count || 0,
      posts: postsCount?.count || 0,
    },
  };
};

// ========================== GET USER BY EMAIL ==========================
export const getUserByEmail = async (email: string) => {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user || null;
};

// ========================== UPDATE USER ==========================
// Allows partial updates. If a password is provided, it’s automatically hashed.
export const updateUser = async (id: string, updates: Partial<TUserValidator>) => {
  // Validate only provided fields
  const validated = userValidator.partial().parse(updates);

  // Handle password hashing if updating password
  let updateData = { ...validated };
  if (updates.passwordHash) {
    const hashed = await bcrypt.hash(updates.passwordHash, 10);
    updateData.passwordHash = hashed;
  }

  const [updatedUser] = await db
    .update(users)
    .set({
      ...updateData,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning();

  return updatedUser;
};

// ========================== DELETE USER ==========================
export const deleteUser = async (id: string) => {
  const [deletedUser] = await db.delete(users).where(eq(users.id, id)).returning();
  return deletedUser;
};

// ========================== SUSPEND USER ==========================
export const suspendUser = async (id: string, until?: Date) => {
  const [updatedUser] = await db
    .update(users)
    .set({
      isSuspended: true,
      suspendedUntil: until ?? null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning();

  return updatedUser;
};

// ========================== UNSUSPEND USER ==========================
export const unsuspendUser = async (id: string) => {
  const [updatedUser] = await db
    .update(users)
    .set({
      isSuspended: false,
      suspendedUntil: null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning();

  return updatedUser;
};

// ========================== CHECK IF USER IS ACTIVE ==========================
export const isUserActive = (user: any): boolean => {
  if (!user) return false;
  if (!user.isSuspended) return true;
  if (user.suspendedUntil && new Date(user.suspendedUntil) < new Date()) return true;
  return false;
};

// ========================== FOLLOW USER ==========================
export const followUser = async (followerId: string, followingId: string) => {
  // Check if already following
  const [existing] = await db
    .select()
    .from(follows)
    .where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)));

  if (existing) {
    throw new Error("Already following this user");
  }

  // Check if both users exist
  const [follower, following] = await Promise.all([
    db.select().from(users).where(eq(users.id, followerId)).limit(1),
    db.select().from(users).where(eq(users.id, followingId)).limit(1),
  ]);

  if (!follower.length || !following.length) {
    throw new Error("User not found");
  }

  // Create follow relationship
  const [follow] = await db
    .insert(follows)
    .values({
      followerId,
      followingId,
    })
    .returning();

  return follow;
};

// ========================== UNFOLLOW USER ==========================
export const unfollowUser = async (followerId: string, followingId: string) => {
  const [deleted] = await db
    .delete(follows)
    .where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)))
    .returning();

  if (!deleted) {
    throw new Error("Follow relationship not found");
  }

  return deleted;
};

// ========================== CHECK IF FOLLOWING ==========================
export const isFollowing = async (followerId: string, followingId: string): Promise<boolean> => {
  const [follow] = await db
    .select()
    .from(follows)
    .where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)))
    .limit(1);

  return !!follow;
};

