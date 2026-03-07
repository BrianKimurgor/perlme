import { Loading, UserCard } from "@/components/ui";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { ExploreUser, useGetRecommendationsQuery } from "@/src/store/Apis/ExploreApi";
import {
  useCheckIfFollowingQuery,
  useFollowUserMutation,
  useUnfollowUserMutation
} from "@/src/store/Apis/UsersApi";
import { expoLogger as logger } from "@/src/utils/logger";
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

// Separate component to handle follow status for each user
const UserCardWithFollow: React.FC<{
  item: ExploreUser;
  onRefetch: () => void;
}> = ({ item, onRefetch }) => {
  const router = useRouter();
  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();
  const { data: followData, refetch: refetchFollowStatus } = useCheckIfFollowingQuery(item.id);

  const isFollowing = followData?.isFollowing || false;

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(item.id).unwrap();
        logger.info("Unfollowed user:", item.id);
      } else {
        await followUser(item.id).unwrap();
        logger.info("Followed user:", item.id);
      }
      // Refetch follow status to update the button
      await refetchFollowStatus();
      // Refetch to update the list
      onRefetch();
    } catch (error: any) {
      // Handle "not following" error gracefully - might be stale data
      if (error?.status === 404 && error?.data?.message === "Follow relationship not found") {
        logger.info("Already unfollowed, refreshing status...");
        await refetchFollowStatus();
        onRefetch();
      } else if (error?.status === 400 && error?.data?.message === "Already following this user") {
        logger.info("Already following, refreshing status...");
        await refetchFollowStatus();
        onRefetch();
      } else {
        logger.error("Failed to toggle follow:", error);
      }
    }
  };

  return (
    <UserCard
      userId={item.id}
      username={item.username}
      bio={item.bio}
      avatarUrl={item.avatarUrl}
      followersCount={item._count?.followers}
      postsCount={item._count?.posts}
      onPress={() => router.push(`/user/${item.id}`)}
      onFollow={handleFollow}
      isFollowing={isFollowing}
      showFollowButton={true}
    />
  );
};

export default function MatchesScreen() {
  const { data, isLoading, error, refetch } = useGetRecommendationsQuery();
  const [refreshing, setRefreshing] = useState(false);
  const { colors, accent } = useAppTheme();

  // Debug logging
  React.useEffect(() => {
    logger.info("=== MATCHES DEBUG ===");
    logger.info("Recommendations data:", JSON.stringify(data, null, 2));
    logger.info("Users array:", data?.users);
    logger.info("Users count:", data?.users?.length);
    logger.info("Loading:", isLoading);
    logger.info("Error:", JSON.stringify(error, null, 2));
    logger.info("===================");
  }, [data, isLoading, error]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderUser = ({ item }: { item: ExploreUser }) => (
    <UserCardWithFollow item={item} onRefetch={refetch} />
  );

  if (isLoading && !data) {
    return <Loading fullScreen text="Finding matches..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface2 }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Discover</Text>
        <TouchableOpacity>
          <Ionicons name="filter" size={24} color={accent} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={data?.users || []}
        renderItem={renderUser}
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
            <Ionicons name="people-outline" size={64} color="#d1d5db" />
            <Text style={[styles.emptyText, { color: colors.subtext }]}>No recommendations yet</Text>
            <Text style={[styles.emptySubtext, { color: colors.subtext }]}>
              Update your profile to get better matches
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
    padding: 16,
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

