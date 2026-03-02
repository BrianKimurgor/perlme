import { Loading, PostCard } from "@/components/ui";
import { RootState } from "@/src/store";
import { Post, useGetAllPostsQuery, useLikePostMutation, useUnlikePostMutation } from "@/src/store/Apis/PostsApi";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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
  const { data: posts, isLoading, error, refetch } = useGetAllPostsQuery();
  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();
  const [refreshing, setRefreshing] = useState(false);
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);

  // Debug logging
  React.useEffect(() => {
    console.log("Posts data:", posts);
    console.log("Loading:", isLoading);
    console.log("Error:", error);
  }, [posts, isLoading, error]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleLike = async (postId: string, isLiked: boolean) => {
    try {
      if (isLiked) {
        await unlikePost(postId).unwrap();
      } else {
        await likePost(postId).unwrap();
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  const checkIfLiked = (post: Post): boolean => {
    if (!currentUserId || !post.likes) return false;
    return post.likes.some((like) => like.userId === currentUserId);
  };

  const renderPost = ({ item }: { item: Post }) => (
    <PostCard
      post={item}
      isLiked={checkIfLiked(item)}
      onLike={() => handleLike(item.id, checkIfLiked(item))}
      onComment={() => router.push(`/post/${item.id}`)}
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
            <Ionicons name="documents-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyText}>No posts yet</Text>
            <Text style={styles.emptySubtext}>
              Follow some users to see their posts
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
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
    fontWeight: "600",
    color: "#6b7280",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 8,
  },
});
