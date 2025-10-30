// src/interfaces/feed.interfaces.ts
import { TSelectPost } from "../../drizzle/schema";

/**
 * Represents a single post returned in the feed.
 */
export interface FeedPost extends TSelectPost {
  author: {
    id: string;
    username: string;
    avatarUrl: string | null;
    isVerified: boolean;
  };
  likesCount: number;
  commentsCount: number;
  isLikedByUser: boolean;
  media: Array<{
    id: string;
    url: string;
    type: string;
  }>;
  tags: Array<{
    id: string;
    name: string;
  }>;
}

/**
 * Options used to customize the feed retrieval.
 */
export interface FeedOptions {
  userId: string;
  page?: number;
  limit?: number;
  includeFollowing?: boolean;
  includeTrending?: boolean;
}

/**
 * The structure returned by a paginated feed.
 */
export interface FeedResponse {
  posts: FeedPost[];
  hasMore: boolean;
  page: number;
  total: number;
}

/**
 * Interface for paginated following feed.
 */
export interface FollowingFeedResponse {
  posts: FeedPost[];
  hasMore: boolean;
  page: number;
}
