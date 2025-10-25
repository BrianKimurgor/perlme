import db from "../../drizzle/db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

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
  return user || null;
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
