import { eq, desc, sql, and, inArray, gte, or } from "drizzle-orm";
import db from "../../drizzle/db";
import { FeedOptions, FeedPost } from "../../Types/feed/feed";
import {
  posts,
  users,
  follows,
  likes,
  comments,
  media,
  postTags,
  tags,
  blocks,
} from "../../drizzle/schema";


export class FeedService {
  /**
   * Get personalized feed with posts from followed users and trending content
   */
  async getPersonalizedFeed(options: FeedOptions): Promise<{
    posts: FeedPost[];
    hasMore: boolean;
    page: number;
    total: number;
  }> {
    const {
      userId,
      page = 1,
      limit = 20,
      includeFollowing = true,
      includeTrending = true,
    } = options;

    const offset = (page - 1) * limit;

    // Get users that the current user has blocked or been blocked by
    const blockedUsers = await this.getBlockedUsers(userId);

    // Get followed users
    const followedUserIds = includeFollowing
      ? await this.getFollowedUserIds(userId)
      : [];

    // Build the main query
    let feedPosts: any[] = [];

    if (includeFollowing && followedUserIds.length > 0) {
      // Get posts from followed users
      const followingPosts = await db
        .select({
          post: posts,
          author: {
            id: users.id,
            username: users.username,
            avatarUrl: users.avatarUrl,
            isVerified: users.isVerified,
          },
        })
        .from(posts)
        .innerJoin(users, eq(posts.authorId, users.id))
        .where(
          and(
            inArray(posts.authorId, followedUserIds),
            eq(users.visibility, "PUBLIC"),
            eq(users.isSuspended, false),
            blockedUsers.length > 0
              ? sql`${posts.authorId} NOT IN (${sql.join(
                  blockedUsers.map((id) => sql`${id}`),
                  sql`, `
                )})`
              : undefined
          )
        )
        .orderBy(desc(posts.createdAt))
        .limit(limit)
        .offset(offset);

      feedPosts = followingPosts;
    }

    if (includeTrending) {
      // Get trending posts (posts with high engagement in the last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const trendingPosts = await db
        .select({
          post: posts,
          author: {
            id: users.id,
            username: users.username,
            avatarUrl: users.avatarUrl,
            isVerified: users.isVerified,
          },
        })
        .from(posts)
        .innerJoin(users, eq(posts.authorId, users.id))
        .where(
          and(
            gte(posts.createdAt, sevenDaysAgo),
            eq(users.visibility, "PUBLIC"),
            eq(users.isSuspended, false),
            blockedUsers.length > 0
              ? sql`${posts.authorId} NOT IN (${sql.join(
                  blockedUsers.map((id) => sql`${id}`),
                  sql`, `
                )})`
              : undefined
          )
        )
        .orderBy(desc(posts.createdAt))
        .limit(Math.floor(limit / 2));

      // Merge and deduplicate posts
      const existingPostIds = new Set(feedPosts.map((p) => p.post.id));
      const uniqueTrendingPosts = trendingPosts.filter(
        (p) => !existingPostIds.has(p.post.id)
      );

      feedPosts = [...feedPosts, ...uniqueTrendingPosts];
    }

    // If no posts from following or trending, get general public posts
    if (feedPosts.length === 0) {
      const publicPosts = await db
        .select({
          post: posts,
          author: {
            id: users.id,
            username: users.username,
            avatarUrl: users.avatarUrl,
            isVerified: users.isVerified,
          },
        })
        .from(posts)
        .innerJoin(users, eq(posts.authorId, users.id))
        .where(
          and(
            eq(users.visibility, "PUBLIC"),
            eq(users.isSuspended, false),
            blockedUsers.length > 0
              ? sql`${posts.authorId} NOT IN (${sql.join(
                  blockedUsers.map((id) => sql`${id}`),
                  sql`, `
                )})`
              : undefined
          )
        )
        .orderBy(desc(posts.createdAt))
        .limit(limit)
        .offset(offset);

      feedPosts = publicPosts;
    }

    // Sort by engagement score and created date
    feedPosts.sort((a, b) => {
      return b.post.createdAt.getTime() - a.post.createdAt.getTime();
    });

    // Limit to requested page size
    feedPosts = feedPosts.slice(0, limit);

    // Enrich posts with additional data
    const enrichedPosts = await this.enrichPosts(
      feedPosts.map((fp) => ({ ...fp.post, author: fp.author })),
      userId
    );

    // Get total count for pagination
    const totalCount = await this.getTotalFeedCount(
      userId,
      followedUserIds,
      blockedUsers
    );

    return {
      posts: enrichedPosts,
      hasMore: offset + enrichedPosts.length < totalCount,
      page,
      total: totalCount,
    };
  }

  /**
   * Get trending posts based on engagement
   */
  async getTrendingPosts(
    userId: string,
    limit: number = 20,
    timeframe: number = 7
  ): Promise<FeedPost[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - timeframe);

    const blockedUsers = await this.getBlockedUsers(userId);

    // Get posts with their engagement counts
    const trendingPosts = await db
      .select({
        post: posts,
        author: {
          id: users.id,
          username: users.username,
          avatarUrl: users.avatarUrl,
          isVerified: users.isVerified,
        },
        likesCount: sql<number>`count(distinct ${likes.id})`.as("likes_count"),
        commentsCount: sql<number>`count(distinct ${comments.id})`.as(
          "comments_count"
        ),
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .leftJoin(likes, eq(posts.id, likes.postId))
      .leftJoin(comments, eq(posts.id, comments.postId))
      .where(
        and(
          gte(posts.createdAt, startDate),
          eq(users.visibility, "PUBLIC"),
          eq(users.isSuspended, false),
          blockedUsers.length > 0
            ? sql`${posts.authorId} NOT IN (${sql.join(
                blockedUsers.map((id) => sql`${id}`),
                sql`, `
              )})`
            : undefined
        )
      )
      .groupBy(posts.id, users.id)
      .orderBy(
        desc(
          sql`(count(distinct ${likes.id}) * 2 + count(distinct ${comments.id}) * 3)`
        )
      )
      .limit(limit);

    return this.enrichPosts(
      trendingPosts.map((tp) => ({ ...tp.post, author: tp.author })),
      userId
    );
  }

  /**
   * Get posts from followed users only
   */
  async getFollowingFeed(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    posts: FeedPost[];
    hasMore: boolean;
    page: number;
  }> {
    const offset = (page - 1) * limit;
    const followedUserIds = await this.getFollowedUserIds(userId);

    if (followedUserIds.length === 0) {
      return { posts: [], hasMore: false, page };
    }

    const blockedUsers = await this.getBlockedUsers(userId);

    const followingPosts = await db
      .select({
        post: posts,
        author: {
          id: users.id,
          username: users.username,
          avatarUrl: users.avatarUrl,
          isVerified: users.isVerified,
        },
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .where(
        and(
          inArray(posts.authorId, followedUserIds),
          eq(users.visibility, "PUBLIC"),
          eq(users.isSuspended, false),
          blockedUsers.length > 0
            ? sql`${posts.authorId} NOT IN (${sql.join(
                blockedUsers.map((id) => sql`${id}`),
                sql`, `
              )})`
            : undefined
        )
      )
      .orderBy(desc(posts.createdAt))
      .limit(limit + 1)
      .offset(offset);

    const hasMore = followingPosts.length > limit;
    const postsToReturn = followingPosts.slice(0, limit);

    const enrichedPosts = await this.enrichPosts(
      postsToReturn.map((fp) => ({ ...fp.post, author: fp.author })),
      userId
    );

    return {
      posts: enrichedPosts,
      hasMore,
      page,
    };
  }

  /**
   * Enrich posts with likes, comments, media, and tags
   */
  private async enrichPosts(
    postsData: any[],
    userId: string
  ): Promise<FeedPost[]> {
    if (postsData.length === 0) return [];

    const postIds = postsData.map((p) => p.id);

    // Get likes count and user's like status
    const likesData = await db
      .select({
        postId: likes.postId,
        count: sql<number>`count(*)::int`.as("count"),
        userLiked: sql<boolean>`bool_or(${likes.userId} = ${userId})`.as(
          "user_liked"
        ),
      })
      .from(likes)
      .where(inArray(likes.postId, postIds))
      .groupBy(likes.postId);

    const likesMap = new Map(
      likesData.map((l) => [l.postId, { count: l.count, userLiked: l.userLiked }])
    );

    // Get comments count
    const commentsData = await db
      .select({
        postId: comments.postId,
        count: sql<number>`count(*)::int`.as("count"),
      })
      .from(comments)
      .where(inArray(comments.postId, postIds))
      .groupBy(comments.postId);

    const commentsMap = new Map(commentsData.map((c) => [c.postId, c.count]));

    // Get media
    const mediaData = await db
      .select()
      .from(media)
      .where(inArray(media.postId, postIds));

    const mediaMap = new Map<string, typeof mediaData>();
    mediaData.forEach((m) => {
      if (!mediaMap.has(m.postId)) {
        mediaMap.set(m.postId, []);
      }
      mediaMap.get(m.postId)!.push(m);
    });

    // Get tags
    const tagsData = await db
      .select({
        postId: postTags.postId,
        tag: tags,
      })
      .from(postTags)
      .innerJoin(tags, eq(postTags.tagId, tags.id))
      .where(inArray(postTags.postId, postIds));

    const tagsMap = new Map<string, typeof tagsData>();
    tagsData.forEach((t) => {
      if (!tagsMap.has(t.postId)) {
        tagsMap.set(t.postId, []);
      }
      tagsMap.get(t.postId)!.push(t);
    });

    // Build enriched posts
    return postsData.map((post) => {
      const postLikes = likesMap.get(post.id);
      const postMedia = mediaMap.get(post.id) || [];
      const postTagsData = tagsMap.get(post.id) || [];

      return {
        ...post,
        likesCount: postLikes?.count || 0,
        commentsCount: commentsMap.get(post.id) || 0,
        isLikedByUser: postLikes?.userLiked || false,
        media: postMedia.map((m) => ({
          id: m.id,
          url: m.url,
          type: m.type,
        })),
        tags: postTagsData.map((t) => ({
          id: t.tag.id,
          name: t.tag.name,
        })),
      };
    });
  }

  /**
   * Get list of user IDs that the current user follows
   */
  private async getFollowedUserIds(userId: string): Promise<string[]> {
    const followedUsers = await db
      .select({ followingId: follows.followingId })
      .from(follows)
      .where(eq(follows.followerId, userId));

    return followedUsers.map((f) => f.followingId);
  }

  /**
   * Get list of blocked user IDs (both blocked by user and blocking user)
   */
  private async getBlockedUsers(userId: string): Promise<string[]> {
    const blockedByUser = await db
      .select({ blockedId: blocks.blockedId })
      .from(blocks)
      .where(eq(blocks.blockerId, userId));

    const blockingUser = await db
      .select({ blockerId: blocks.blockerId })
      .from(blocks)
      .where(eq(blocks.blockedId, userId));

    return [
      ...blockedByUser.map((b) => b.blockedId),
      ...blockingUser.map((b) => b.blockerId),
    ];
  }

  /**
   * Get total count of posts available in the feed
   */
  private async getTotalFeedCount(
    userId: string,
    followedUserIds: string[],
    blockedUsers: string[]
  ): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .where(
        and(
          or(
            followedUserIds.length > 0
              ? inArray(posts.authorId, followedUserIds)
              : undefined,
            eq(users.visibility, "PUBLIC")
          ),
          eq(users.isSuspended, false),
          blockedUsers.length > 0
            ? sql`${posts.authorId} NOT IN (${sql.join(
                blockedUsers.map((id) => sql`${id}`),
                sql`, `
              )})`
            : undefined
        )
      );

    return result[0]?.count || 0;
  }
}

export const feedService = new FeedService();
