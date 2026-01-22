import db from "../drizzle/db";
import { eq } from "drizzle-orm";
import { TSelectUser, TInsertUser, users } from "../drizzle/schema";
import crypto from "node:crypto";

const VERIFICATION_CODE_LENGTH = 8;
const VERIFICATION_CODE_EXPIRY = 10 * 60 * 1000; // 10 minutes

// Generate cryptographically secure verification code
const generateSecureVerificationCode = (length: number = VERIFICATION_CODE_LENGTH): string => {
  const digits = "0123456789";
  let code = "";
  const randomBytes = crypto.randomBytes(length);

  for (let i = 0; i < length; i++) {
    code += digits[randomBytes[i] % digits.length];
  }

  return code;
};

// --------------------------- REGISTER USER ---------------------------
export const registerUserService = async (
  user: TInsertUser
): Promise<TSelectUser> => {
  const [newUser] = await db.insert(users).values(user).returning();
  if (!newUser) throw new Error("Failed to create user");
  return newUser;
};

// --------------------------- GET USER BY EMAIL ---------------------------
export const getUserByEmailService = async (
  email: string
): Promise<TSelectUser | undefined> => {
  return await db.query.users.findFirst({
    where: eq(users.email, email.toLowerCase()),
  });
};

// --------------------------- GET USER BY ID ---------------------------
export const getUserByIdService = async (
  id: string
): Promise<TSelectUser | undefined> => {
  return await db.query.users.findFirst({
    where: eq(users.id, id),
  });
};

// --------------------------- UPDATE USER PASSWORD ---------------------------
export const updateUserPasswordService = async (
  email: string,
  newPasswordHash: string
): Promise<string> => {
  const result = await db
    .update(users)
    .set({
      passwordHash: newPasswordHash,
      updatedAt: new Date(),
    })
    .where(eq(users.email, email.toLowerCase()))
    .returning();

  if (result.length === 0) {
    throw new Error("User not found or password update failed");
  }

  return "Password updated successfully";
};

// --------------------------- UPDATE EMAIL VERIFICATION STATUS ---------------------------
export const updateVerificationStatusService = async (
  email: string,
  status: boolean,
  confirmationCode: string | null
): Promise<string> => {
  const result = await db
    .update(users)
    .set({
      isVerified: status,
      confirmationCode,
      confirmationCodeExpiresAt: null, // Clear expiry when verified
      updatedAt: new Date(),
    })
    .where(eq(users.email, email.toLowerCase()))
    .returning();

  if (result.length === 0) {
    throw new Error("User not found or verification status update failed");
  }

  return "Verification status updated successfully";
};

// --------------------------- GENERATE AND UPDATE NEW CONFIRMATION CODE ---------------------------
export const generateAndSetNewConfirmationCode = async (
  email: string
): Promise<string> => {
  const newCode = generateSecureVerificationCode();

  const result = await db
    .update(users)
    .set({
      confirmationCode: newCode,
      confirmationCodeExpiresAt: new Date(Date.now() + VERIFICATION_CODE_EXPIRY),
      updatedAt: new Date(),
    })
    .where(eq(users.email, email.toLowerCase()))
    .returning();

  if (result.length === 0) {
    throw new Error("User not found or failed to set new confirmation code");
  }

  return newCode;
};

// --------------------------- INCREMENT FAILED LOGIN ATTEMPTS ---------------------------
export const incrementFailedLoginAttempts = async (
  userId: string
): Promise<void> => {
  // Fetch current failedLoginAttempts
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  const currentAttempts = user?.failedLoginAttempts ?? 0;

  await db
    .update(users)
    .set({
      failedLoginAttempts: currentAttempts + 1,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));
};

// --------------------------- RESET FAILED LOGIN ATTEMPTS ---------------------------
export const resetFailedLoginAttempts = async (
  userId: string
): Promise<void> => {
  await db
    .update(users)
    .set({
      failedLoginAttempts: 0,
      accountLockedUntil: null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));
};

// --------------------------- LOCK ACCOUNT ---------------------------
export const lockAccount = async (
  userId: string,
  durationMs: number
): Promise<void> => {
  const lockUntil = new Date(Date.now() + durationMs);

  await db
    .update(users)
    .set({
      accountLockedUntil: lockUntil,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));
};
