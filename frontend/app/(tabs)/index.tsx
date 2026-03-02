import { CommentsSheet, Loading, PostCard, ShareSheet } from "@/components/ui";
import { RootState } from "@/src/store";
import { Post, useGetAllPostsQuery, useLikePostMutation, useUnlikePostMutation } from "@/src/store/Apis/PostsApi";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
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

  // ─── Comments Sheet State ───────────────────────────────────
  const [commentsPostId, setCommentsPostId] = useState<string | null>(null);

  // ─── Share Sheet State ──────────────────────────────────────
  const [sharePost, setSharePost] = useState<Post | null>(null);

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
      console.error("Failed to toggle like:", error);
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
      onLike={() => handleLike(item.id, checkIfLiked(item))}
      onComment={() => setCommentsPostId(item.id)}
      onShare={() => setSharePost(item)}
      onUserPress={() => router.push(`/user/${item.authorId}`)}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Feed</Text>
      <TouchableOpacity onPress={() => router.push("/create-post")}>
        <Ionicons name="add-circle" size={32} color="#ff3366" />
      </TouchableOpacity>
    </View>
  );

  if (isLoading && !posts) {
    return <Loading fullScreen text="Loading feed..." />;
  }

  return (
    <View style={styles.container}>
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
            tintColor="#ff3366"
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="documents-outline" size={64} color="#e5c6f5" />
            <Text style={styles.emptyText}>No posts yet</Text>
            <Text style={styles.emptySubtext}>
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
