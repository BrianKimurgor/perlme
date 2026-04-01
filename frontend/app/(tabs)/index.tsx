import { ProfileSwipeCard, SwipeCardUser } from "@/components/ProfileSwipeCard";
import { StoryBar } from "@/components/StoryBar";
import { Loading } from "@/components/ui";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { RootState } from "@/src/store";
import { ExploreUser, useGetRecommendationsQuery } from "@/src/store/Apis/ExploreApi";
import { Post, useGetAllPostsQuery, useLikePostMutation, useUnlikePostMutation } from "@/src/store/Apis/PostsApi";
import {
  useFollowUserMutation,
} from "@/src/store/Apis/UsersApi";
import { expoLogger as logger } from "@/src/utils/logger";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

const { width: SCREEN_W } = Dimensions.get("window");

// ─── Relative time helper ────────────────────────────────────────────────
function timeAgo(dateStr: string): string {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  return `${Math.floor(diff / 604800)}w`;
}

// ─── Instagram-style Feed Post Card ──────────────────────────────────────
const FeedPostCard: React.FC<{
  post: Post;
  currentUserId: string | undefined;
  isDark: boolean;
  accent: string;
  onPressUser: (id: string) => void;
  onPressPost: (id: string) => void;
}> = ({ post, currentUserId, isDark, accent, onPressUser, onPressPost }) => {
  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();

  // Prefer flat fields from backend formatPost(); fall back to array shape
  const isLiked = post.isLikedByCurrentUser ?? post.likes?.some((l) => l.userId === currentUserId) ?? false;
  const likeCount = post.likeCount ?? post._count?.likes ?? post.likes?.length ?? 0;
  const commentCount = post.commentCount ?? post._count?.comments ?? post.comments?.length ?? 0;
  const mediaUrl = post.media?.[0]?.url ?? null;

  const handleLike = async () => {
    try {
      if (isLiked) {
        await unlikePost(post.id).unwrap();
      } else {
        await likePost(post.id).unwrap();
      }
    } catch (_) { }
  };

  const cardBg = isDark ? "#111" : "#fff";
  const textColor = isDark ? "#f0f0f0" : "#111";
  const subColor = isDark ? "#888" : "#777";
  const dividerColor = isDark ? "#222" : "#efefef";

  return (
    <View style={[feedStyles.card, { backgroundColor: cardBg, borderBottomColor: dividerColor }]}>
      {/* Header */}
      <TouchableOpacity
        style={feedStyles.cardHeader}
        onPress={() => post.author && onPressUser(post.author.id)}
        activeOpacity={0.8}
      >
        <View style={feedStyles.headerLeft}>
          {post.author?.avatarUrl ? (
            <Image
              source={{ uri: post.author.avatarUrl }}
              style={feedStyles.avatar}
              contentFit="cover"
            />
          ) : (
            <View style={[feedStyles.avatar, { backgroundColor: isDark ? "#333" : "#e0e0e0", alignItems: "center", justifyContent: "center" }]}>
              <Ionicons name="person" size={18} color={isDark ? "#888" : "#bbb"} />
            </View>
          )}
          <Text style={[feedStyles.username, { color: textColor }]}>
            {post.author?.username ?? "unknown"}
          </Text>
        </View>
        <Ionicons name="ellipsis-horizontal" size={20} color={subColor} />
      </TouchableOpacity>

      {/* Media */}
      <TouchableOpacity activeOpacity={0.95} onPress={() => onPressPost(post.id)}>
        {mediaUrl ? (
          <Image
            source={{ uri: mediaUrl }}
            style={feedStyles.postImage}
            contentFit="cover"
          />
        ) : (
          <View style={[feedStyles.postImagePlaceholder, { backgroundColor: isDark ? "#1c1c1e" : "#f0f0f0" }]}>
            <MaterialCommunityIcons name="image-off-outline" size={40} color={isDark ? "#444" : "#ccc"} />
          </View>
        )}
      </TouchableOpacity>

      {/* Action Bar */}
      <View style={feedStyles.actions}>
        <View style={feedStyles.actionsLeft}>
          <TouchableOpacity onPress={handleLike} style={feedStyles.actionBtn}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={26}
              color={isLiked ? "#e0245e" : (isDark ? "#f0f0f0" : "#111")}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onPressPost(post.id)} style={feedStyles.actionBtn}>
            <Ionicons name="chatbubble-outline" size={24} color={isDark ? "#f0f0f0" : "#111"} />
          </TouchableOpacity>
          <TouchableOpacity style={feedStyles.actionBtn}>
            <Ionicons name="paper-plane-outline" size={24} color={isDark ? "#f0f0f0" : "#111"} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Ionicons name="bookmark-outline" size={24} color={isDark ? "#f0f0f0" : "#111"} />
        </TouchableOpacity>
      </View>

      {/* Like count */}
      {likeCount > 0 && (
        <Text style={[feedStyles.likeCount, { color: textColor }]}>
          {likeCount.toLocaleString()} {likeCount === 1 ? "like" : "likes"}
        </Text>
      )}

      {/* Caption */}
      {post.content ? (
        <View style={feedStyles.captionRow}>
          <Text style={[feedStyles.captionUsername, { color: textColor }]}>
            {post.author?.username ?? ""}{" "}
          </Text>
          <Text style={[feedStyles.captionText, { color: textColor }]} numberOfLines={2}>
            {post.content}
          </Text>
        </View>
      ) : null}

      {/* Comments preview */}
      {commentCount > 0 && (
        <TouchableOpacity onPress={() => onPressPost(post.id)}>
          <Text style={[feedStyles.viewComments, { color: subColor }]}>
            View all {commentCount} comment{commentCount !== 1 ? "s" : ""}
          </Text>
        </TouchableOpacity>
      )}

      {/* Timestamp */}
      <Text style={[feedStyles.timestamp, { color: subColor }]}>
        {timeAgo(post.createdAt)}
      </Text>
    </View>
  );
};

// ─── Empty state card ──────────────────────────────────────────────────────
const AllSeenCard: React.FC<{ isDark: boolean; accent: string; onRefresh: () => void }> = ({
  isDark,
  accent,
  onRefresh,
}) => (
  <View style={[styles.allSeenCard, { backgroundColor: isDark ? "#1e1e1e" : "#fff" }]}>
    <MaterialCommunityIcons name="heart-search" size={60} color={accent} />
    <Text style={[styles.allSeenTitle, { color: isDark ? "#f0f0f0" : "#111" }]}>
      You've seen everyone!
    </Text>
    <Text style={[styles.allSeenSub, { color: isDark ? "#aaa" : "#777" }]}>
      Check back later for new people nearby.
    </Text>
    <TouchableOpacity
      style={[styles.refreshBtn, { backgroundColor: accent }]}
      onPress={onRefresh}
    >
      <Text style={styles.refreshBtnText}>Refresh</Text>
    </TouchableOpacity>
  </View>
);

// ─── Main Home Screen ──────────────────────────────────────────────────────
export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, accent, isDark } = useAppTheme();
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);

  const { data, isLoading, isError: recError, error: recErrorDetail, refetch } = useGetRecommendationsQuery();
  const { data: posts = [], isLoading: postsLoading, isError: postsError, error: postsErrorDetail, refetch: refetchPosts } = useGetAllPostsQuery();
  const [followUser] = useFollowUserMutation();

  // ─── Debug logging ────────────────────────────────────────────────────────
  useEffect(() => {
    logger.info("[Feed] Recommendations state:", {
      isLoading,
      isError: recError,
      error: recErrorDetail,
      usersCount: data?.users?.length ?? 0,
      rawData: data,
    });
  }, [isLoading, recError, recErrorDetail, data]);

  useEffect(() => {
    logger.info("[Feed] Posts state:", {
      isLoading: postsLoading,
      isError: postsError,
      error: postsErrorDetail,
      postsCount: posts.length,
    });
  }, [postsLoading, postsError, postsErrorDetail, posts]);

  const [refreshing, setRefreshing] = useState(false);
  const [profileIndex, setProfileIndex] = useState(0);
  const [swipeHistory, setSwipeHistory] = useState<number[]>([]);
  const [loadTimedOut, setLoadTimedOut] = useState(false);

  // If recommendations are still loading after 12s, force the error/retry screen
  useEffect(() => {
    if (!isLoading) {
      setLoadTimedOut(false);
      return;
    }
    const t = setTimeout(() => {
      logger.warn("[Feed] Recommendations request timed out after 12s");
      setLoadTimedOut(true);
    }, 12_000);
    return () => clearTimeout(t);
  }, [isLoading]);

  const scrollY = useRef(new Animated.Value(0)).current;

  const profiles: ExploreUser[] = data?.users ?? [];
  const currentProfile = profiles[profileIndex];
  const storyUsers = profiles.slice(0, 14);
  const noMoreProfiles = profiles.length > 0 && profileIndex >= profiles.length;

  // ─── Scroll-based hero card shrink ────────────────────────────────────────
  const heroOpacity = scrollY.interpolate({
    inputRange: [0, 160],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });
  const heroScale = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0.88],
    extrapolate: "clamp",
  });
  const heroTranslateY = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, -30],
    extrapolate: "clamp",
  });

  // ─── Swipe handlers ───────────────────────────────────────────────────────
  const advance = useCallback(() => {
    setSwipeHistory((prev) => [...prev, profileIndex]);
    setProfileIndex((prev) => prev + 1);
  }, [profileIndex]);

  const handleSwipeLeft = useCallback(() => {
    advance();
  }, [advance]);

  const handleSwipeRight = useCallback(async () => {
    if (currentProfile) {
      try {
        await followUser(currentProfile.id).unwrap();
      } catch (e: any) {
        // ignore "already following" errors silently
        if (e?.data?.message !== "Already following this user") {
          logger.error("Follow failed:", e);
        }
      }
    }
    advance();
  }, [currentProfile, advance, followUser]);

  const handleRewind = useCallback(() => {
    if (swipeHistory.length === 0) return;
    const last = swipeHistory[swipeHistory.length - 1];
    setSwipeHistory((prev) => prev.slice(0, -1));
    setProfileIndex(last);
  }, [swipeHistory]);

  const handleSuperlike = useCallback(async () => {
    if (currentProfile) {
      try {
        await followUser(currentProfile.id).unwrap();
      } catch (_) { }
    }
    advance();
    Toast.show({ type: "success", text1: "⭐ Superlike sent!", position: "top" });
  }, [currentProfile, advance, followUser]);

  const handleSpotlight = useCallback(() => {
    Toast.show({
      type: "info",
      text1: "⚡ Spotlight",
      text2: "Coming soon — Premium feature!",
      position: "top",
    });
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    setProfileIndex(0);
    setSwipeHistory([]);
    await Promise.all([refetch(), refetchPosts()]);
    setRefreshing(false);
  };

  if (isLoading && !loadTimedOut && profiles.length === 0) {
    return <Loading fullScreen text="Finding people near you..." />;
  }

  if ((recError || loadTimedOut) && profiles.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" }]}>
        <Ionicons name="cloud-offline-outline" size={56} color={isDark ? "#555" : "#ccc"} />
        <Text style={{ color: colors.text, fontSize: 17, fontWeight: "700", marginTop: 16 }}>
          Couldn&apos;t load feed
        </Text>
        <Text style={{ color: colors.subtext, fontSize: 14, marginTop: 8, textAlign: "center", paddingHorizontal: 32 }}>
          {(recErrorDetail as any)?.status === 401
            ? "Session expired — please log in again"
            : loadTimedOut
              ? "Server took too long to respond. Is the backend running?"
              : "Check your connection and try again"}
        </Text>
        <TouchableOpacity
          style={{ marginTop: 20, backgroundColor: accent, paddingHorizontal: 28, paddingVertical: 12, borderRadius: 24 }}
          onPress={() => refetch()}
        >
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toSwipeUser = (u: ExploreUser): SwipeCardUser => ({
    id: u.id,
    username: u.username,
    avatarUrl: u.avatarUrl,
    age: u.age,
    distance: u.distance,
    bio: u.bio,
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* ─── Top Header ─────────────────────────────────────────────── */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.border,
            paddingTop: insets.top,
          },
        ]}
      >
        <Text style={[styles.brandText, { color: accent }]}>perlme</Text>
        <TouchableOpacity onPress={() => router.push("/create-post" as any)}>
          <Ionicons name="create-outline" size={26} color={accent} />
        </TouchableOpacity>
      </View>

      {/* ─── Scrollable body ────────────────────────────────────────── */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={accent} />
        }
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* ─── Stories ──────────────────────────────────────────────── */}
        <View
          style={[
            styles.storiesContainer,
            {
              backgroundColor: colors.surface,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <StoryBar
            users={storyUsers}
            onPress={(id) => router.push(`/user/${id}` as any)}
            isDark={isDark}
          />
        </View>

        {/* ─── Hero Swipe Card ──────────────────────────────────────── */}
        <Animated.View
          style={{
            opacity: heroOpacity,
            transform: [{ scale: heroScale }, { translateY: heroTranslateY }],
          }}
        >
          {noMoreProfiles ? (
            <AllSeenCard isDark={isDark} accent={accent} onRefresh={onRefresh} />
          ) : currentProfile ? (
            <ProfileSwipeCard
              user={toSwipeUser(currentProfile)}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
              onRewind={handleRewind}
              onSuperlike={handleSuperlike}
              onSpotlight={handleSpotlight}
              onNope={handleSwipeLeft}
              onLike={handleSwipeRight}
              isDark={isDark}
              accent={accent}
              canRewind={swipeHistory.length > 0}
            />
          ) : (
            <AllSeenCard isDark={isDark} accent={accent} onRefresh={onRefresh} />
          )}
        </Animated.View>

        {/* ─── Instagram-style Post Feed ───────────────────────────── */}
        {posts.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Posts
              </Text>
            </View>

            <View>
              {posts.map((post) => (
                <FeedPostCard
                  key={post.id}
                  post={post}
                  currentUserId={currentUserId}
                  isDark={isDark}
                  accent={accent}
                  onPressUser={(id) => router.push(`/user/${id}` as any)}
                  onPressPost={(id) => router.push(`/post/${id}` as any)}
                />
              ))}
            </View>
          </>
        )}
      </Animated.ScrollView>
    </View>
  );
}

// ─── Instagram Feed Styles ─────────────────────────────────────────────────
const feedStyles = StyleSheet.create({
  card: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  username: {
    fontWeight: "700",
    fontSize: 14,
  },
  postImage: {
    width: SCREEN_W,
    height: SCREEN_W,
  },
  postImagePlaceholder: {
    width: SCREEN_W,
    height: SCREEN_W * 0.75,
    alignItems: "center",
    justifyContent: "center",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 4,
  },
  actionsLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  actionBtn: {
    padding: 2,
  },
  likeCount: {
    fontWeight: "700",
    fontSize: 14,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  captionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  captionUsername: {
    fontWeight: "700",
    fontSize: 14,
  },
  captionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  viewComments: {
    paddingHorizontal: 12,
    fontSize: 14,
    marginBottom: 4,
  },
  timestamp: {
    paddingHorizontal: 12,
    fontSize: 11,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
});

// ─── Styles ────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  brandText: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  storiesContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  sectionCount: {
    fontSize: 13,
  },
  allSeenCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    minHeight: Dimensions.get("window").height * 0.48,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  allSeenTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginTop: 16,
    textAlign: "center",
  },
  allSeenSub: {
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },
  refreshBtn: {
    marginTop: 22,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 30,
  },
  refreshBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});

