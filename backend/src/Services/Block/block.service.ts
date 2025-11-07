import { eq, and } from "drizzle-orm";
import { CreateBlockInput, createBlockSchema, UnblockInput, unblockSchema } from "../../Validators/Block.validator";
import db from "../../drizzle/db";
import { blocks } from "../../drizzle/schema";

export class BlockService {
  /**
   * ✅ Create a new block between two users
   */
  static async createBlock(input: CreateBlockInput) {
    // Validate input
    const data = createBlockSchema.parse(input);

    // Prevent duplicate blocks
    const existing = await db.query.blocks.findFirst({
      where: and(
        eq(blocks.blockerId, data.blockerId),
        eq(blocks.blockedId, data.blockedId)
      ),
    });

    if (existing) {
      throw new Error("User is already blocked.");
    }

    // Insert block
    const [newBlock] = await db
      .insert(blocks)
      .values({
        blockerId: data.blockerId,
        blockedId: data.blockedId,
      })
      .returning();

    return newBlock;
  }

  /**
   * ✅ Remove a block (unblock)
   */
  static async removeBlock(input: UnblockInput) {
    // Validate input
    const data = unblockSchema.parse(input);

    const deleted = await db
      .delete(blocks)
      .where(
        and(
          eq(blocks.blockerId, data.blockerId),
          eq(blocks.blockedId, data.blockedId)
        )
      )
      .returning();

    if (deleted.length === 0) {
      throw new Error("No existing block found.");
    }

    return { success: true };
  }

  /**
   * ✅ Check if one user is blocking another
   */
  static async isBlocked(blockerId: string, blockedId: string) {
    const block = await db.query.blocks.findFirst({
      where: and(eq(blocks.blockerId, blockerId), eq(blocks.blockedId, blockedId)),
    });

    return !!block;
  }

  /**
   * ✅ Get all users blocked by a given user
   */
  static async getBlockedUsers(blockerId: string) {
    const results = await db.query.blocks.findMany({
      where: eq(blocks.blockerId, blockerId),
    });

    return results;
  }

  /**
   * ✅ Get all users who have blocked a given user
   */
  static async getBlockedBy(blockedId: string) {
    const results = await db.query.blocks.findMany({
      where: eq(blocks.blockedId, blockedId),
    });

    return results;
  }
}
