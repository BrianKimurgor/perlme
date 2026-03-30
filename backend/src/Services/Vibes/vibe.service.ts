import { and, desc, eq, or, sql } from "drizzle-orm";
import db from "../../drizzle/db";
import {
    messages,
    userVibeCounts,
    vibeVotes,
    type VibeType,
} from "../../drizzle/schema";

export class VibeService {

    /**
     * Cast or change a vibe vote from voterId → targetUserId.
     * - One vote per conversation pair (voter, target).
     * - If the voter already voted with the same type, it is a no-op.
     * - If they switch vibe type, old count is decremented and new one incremented.
     */
    async castVibe(voterId: string, targetUserId: string, vibeType: VibeType): Promise<{ changed: boolean }> {
        if (voterId === targetUserId) {
            throw new Error("You cannot vibe yourself");
        }

        const existing = await db
            .select()
            .from(vibeVotes)
            .where(
                and(
                    eq(vibeVotes.voterId, voterId),
                    eq(vibeVotes.targetUserId, targetUserId)
                )
            )
            .limit(1);

        if (existing.length > 0) {
            const old = existing[0];
            // No change
            if (old.vibeType === vibeType) {
                return { changed: false };
            }
            // Switch vibe — decrement old, increment new in a transaction
            await db.transaction(async (tx) => {
                await tx
                    .update(vibeVotes)
                    .set({ vibeType, updatedAt: new Date() })
                    .where(eq(vibeVotes.id, old.id));

                // Decrement old (floor at 0)
                await tx
                    .update(userVibeCounts)
                    .set({
                        count: sql`GREATEST(${userVibeCounts.count} - 1, 0)`,
                        updatedAt: new Date(),
                    })
                    .where(
                        and(
                            eq(userVibeCounts.targetUserId, targetUserId),
                            eq(userVibeCounts.vibeType, old.vibeType)
                        )
                    );

                // Upsert new
                await tx
                    .insert(userVibeCounts)
                    .values({ targetUserId, vibeType, count: 1 })
                    .onConflictDoUpdate({
                        target: [userVibeCounts.targetUserId, userVibeCounts.vibeType],
                        set: {
                            count: sql`${userVibeCounts.count} + 1`,
                            updatedAt: new Date(),
                        },
                    });
            });

            return { changed: true };
        }

        // Brand new vote
        await db.transaction(async (tx) => {
            await tx.insert(vibeVotes).values({ voterId, targetUserId, vibeType });

            await tx
                .insert(userVibeCounts)
                .values({ targetUserId, vibeType, count: 1 })
                .onConflictDoUpdate({
                    target: [userVibeCounts.targetUserId, userVibeCounts.vibeType],
                    set: {
                        count: sql`${userVibeCounts.count} + 1`,
                        updatedAt: new Date(),
                    },
                });
        });

        return { changed: true };
    }

    /**
     * Get the dominant vibe for a user (highest vote count).
     * Returns null if the user has no vibe votes yet.
     */
    async getTopVibe(targetUserId: string): Promise<{ vibeType: VibeType; count: number } | null> {
        const result = await db
            .select()
            .from(userVibeCounts)
            .where(eq(userVibeCounts.targetUserId, targetUserId))
            .orderBy(desc(userVibeCounts.count))
            .limit(1);

        if (!result.length || result[0].count === 0) return null;
        return { vibeType: result[0].vibeType, count: result[0].count };
    }

    /**
     * Get all vibe counts for a user so the UI can show the breakdown.
     */
    async getAllVibeCounts(targetUserId: string): Promise<Array<{ vibeType: VibeType; count: number }>> {
        const rows = await db
            .select()
            .from(userVibeCounts)
            .where(eq(userVibeCounts.targetUserId, targetUserId))
            .orderBy(desc(userVibeCounts.count));

        return rows.map((r) => ({ vibeType: r.vibeType, count: r.count }));
    }

    /**
     * Get the vibe the current user has cast for targetUserId (or null).
     */
    async getMyVote(voterId: string, targetUserId: string): Promise<VibeType | null> {
        const result = await db
            .select()
            .from(vibeVotes)
            .where(
                and(
                    eq(vibeVotes.voterId, voterId),
                    eq(vibeVotes.targetUserId, targetUserId)
                )
            )
            .limit(1);

        return result.length > 0 ? result[0].vibeType : null;
    }

    /**
     * Returns true when:
     *  1. At least 15 messages have been exchanged between the two users, AND
     *  2. The current user has not yet cast a vibe vote for targetUserId.
     */
    async shouldShowVibePrompt(userId: string, targetUserId: string): Promise<boolean> {
        const [{ msgCount }] = await db
            .select({ msgCount: sql<number>`count(*)::int` })
            .from(messages)
            .where(
                or(
                    and(
                        eq(messages.senderId, userId),
                        eq(messages.receiverId, targetUserId)
                    ),
                    and(
                        eq(messages.senderId, targetUserId),
                        eq(messages.receiverId, userId)
                    )
                )
            );

        if (Number(msgCount) < 15) return false;

        const voted = await this.getMyVote(userId, targetUserId);
        return voted === null;
    }
}
