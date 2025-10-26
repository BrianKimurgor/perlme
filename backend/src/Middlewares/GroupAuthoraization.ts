import db from "../drizzle/db";
import { groupMembers,  users } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { Request, Response, NextFunction } from "express";

export const authorizeGroupAction = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const groupId = req.params.groupId || req.body.groupId;

    if (!userId || !groupId)
      return res.status(400).json({ message: "Missing user or group information" });

    // 1️⃣ If system admin → full access
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (user?.role === "ADMIN") return next();

    // 2️⃣ Otherwise, check group membership
    const [membership] = await db
      .select()
      .from(groupMembers)
      .where(and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, userId)));

    if (!membership)
      return res.status(403).json({ message: "You are not a member of this group" });

    // 3️⃣ Check if user has one of the allowed group roles
    if (!allowedRoles.includes(membership.role))
      return res.status(403).json({ message: "Insufficient permissions" });

    next();
  };
};
