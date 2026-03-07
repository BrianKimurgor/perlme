import { CommentsSheet, Loading, PostCard, ShareSheet } from "@/components/ui";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { RootState } from "@/src/store";
import { Post, useGetAllPostsQuery, useLikePostMutation, useUnlikePostMutation } from "@/src/store/Apis/PostsApi";
import { expoLogger as logger } from "@/src/utils/logger";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";

export default function HomeScreen() {
  const router = useRouter();
  const { data: posts, isLoading, refetch } = useGetAllPostsQuery();
  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();
  const [refreshing, setRefreshing] = useState(false);
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);
  const { colors, accent } = useAppTheme();

  // ─── Comments Sheet State ───────────────────────────────────
  const [commentsPostId, setCommentsPostId] = useState<string | null>(null);

  // ─── Share Sheet State ──────────────────────────────────────
  const [sharePost, setSharePost] = useState<Post | null>(null);

  // ─── Saved Posts State ─────────────────────────────────────
  const SAVED_KEY = "@saved_posts";
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    AsyncStorage.getItem(SAVED_KEY).then((val) => {
      if (val) setSavedIds(new Set(JSON.parse(val)));
    });
  }, []);

  const handleSave = useCallback(async (postId: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      AsyncStorage.setItem(SAVED_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleLike = useCallback(async (postId: string, isLiked: boolean) => {
    try {
      if (isLiked) {
        await unlikePost(postId).unwrap();
      } else {
        await likePost(postId).unwrap();
      }
    } catch (error) {
      logger.error("Failed to toggle like:", error);
    }
  }, [likePost, unlikePost]);

  const checkIfLiked = (post: Post): boolean => {
    if (!currentUserId) return false;
    // Support both backend shapes
    if ((post as any).isLikedByCurrentUser !== undefined) {
      return (post as any).isLikedByCurrentUser;
    }
    if (post.likes) {
      return post.likes.some((like) => like.userId === currentUserId);
    }
    return false;
  };

  const renderPost = ({ item }: { item: Post }) => (
    <PostCard
      post={item}
      isLiked={checkIfLiked(item)}
      isSaved={savedIds.has(item.id)}
      onLike={() => handleLike(item.id, checkIfLiked(item))}
      onComment={() => setCommentsPostId(item.id)}
      onShare={() => setSharePost(item)}
      onSave={() => handleSave(item.id)}
      onUserPress={() => router.push(`/user/${item.authorId}`)}
    />
  );

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
      <Text style={[styles.headerTitle, { color: accent }]}>Feed</Text>
      <TouchableOpacity onPress={() => router.push("/create-post")}>
        <Ionicons name="add-circle" size={32} color={accent} />
      </TouchableOpacity>
    </View>
  );

  if (isLoading && !posts) {
    return <Loading fullScreen text="Loading feed..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface2 }]}>
      {renderHeader()}
      <FlatList
        data={posts || []}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={accent}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="documents-outline" size={64} color="#e5c6f5" />
            <Text style={[styles.emptyText, { color: accent }]}>No posts yet</Text>
            <Text style={[styles.emptySubtext, { color: colors.subtext }]}>
              Follow some users to see their posts
            </Text>
          </View>
        }
      />

      {/* Comments Sheet (opens as modal from feed) */}
      {commentsPostId && (
        <CommentsSheet
          postId={commentsPostId}
          visible={!!commentsPostId}
          onClose={() => setCommentsPostId(null)}
          onUserPress={(userId) => {
            setCommentsPostId(null);
            router.push(`/user/${userId}`);
          }}
        />
      )}

      {/* Share Sheet */}
      {sharePost && (
        <ShareSheet
          post={sharePost}
          visible={!!sharePost}
          onClose={() => setSharePost(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdf2f8",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#fce4ec",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#8e44ad",
  },
  listContent: {
    paddingVertical: 8,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#8e44ad",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#b0b0b0",
    marginTop: 8,
  },
});

