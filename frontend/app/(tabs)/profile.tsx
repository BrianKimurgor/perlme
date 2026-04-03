import { Avatar, Loading } from "@/components/ui";
import { persistor, RootState } from "@/src/store";
import { authApi } from "@/src/store/Apis/AuthApi";
import { blocksApi } from "@/src/store/Apis/BlocksApi";
import { exploreApi } from "@/src/store/Apis/ExploreApi";
import { groupsApi } from "@/src/store/Apis/GroupsApi";
import { messagesApi } from "@/src/store/Apis/MessagesApi";
import { postsApi, useDeletePostMutation, useGetPostsByUserQuery } from "@/src/store/Apis/PostsApi";
import { useGetUserByIdQuery, usersApi } from "@/src/store/Apis/UsersApi";
import { useGetVibesQuery } from "@/src/store/Apis/VibesApi";

import { useAppTheme } from "@/src/hooks/useAppTheme";
import { logout } from "@/src/store/AuthSlice";
import { expoLogger as logger } from "@/src/utils/logger";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

export default function ProfileScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const { colors, accent } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { data: userProfile, isLoading } = useGetUserByIdQuery(
    currentUser?.id || "",
    { skip: !currentUser?.id }
  );

  // Fetch own vibes to compute vibe score (total votes received)
  const { data: vibeData } = useGetVibesQuery(currentUser?.id || "", {
    skip: !currentUser?.id,
  });
  const vibeScore = vibeData?.allCounts?.reduce((sum, v) => sum + v.count, 0) ?? 0;
  const milestoneScore = Math.min(100, Math.round((vibeScore / 10) * 100) / 10 + (userProfile?._count?.posts ?? 0) * 5);
  const badgeScore = Math.min(99, Math.max(0, milestoneScore));
  let responseSpeedLabel = "—";
  if (vibeScore > 20) responseSpeedLabel = "Fast";
  else if (vibeScore > 5) responseSpeedLabel = "OK";

  // Own posts via dedicated endpoint
  const { data: myPosts = [] } = useGetPostsByUserQuery(currentUser?.id || "", {
    skip: !currentUser?.id,
  });
  const [deletePost] = useDeletePostMutation();

  const handleLogout = async () => {
    try {
      logger.info("🚪 Starting logout process...");

      // 1. Dispatch logout action first to clear Redux state
      dispatch(logout());

      // 2. Reset all RTK Query caches
      dispatch(authApi.util.resetApiState());
      dispatch(postsApi.util.resetApiState());
      dispatch(messagesApi.util.resetApiState());
      dispatch(usersApi.util.resetApiState());
      dispatch(exploreApi.util.resetApiState());
      dispatch(blocksApi.util.resetApiState());
      dispatch(groupsApi.util.resetApiState());

      // 3. Clear persisted Redux state
      await persistor.purge();
      await persistor.flush();

      // 4. Clear all AsyncStorage
      await AsyncStorage.clear();

      logger.info("✅ Logout completed successfully");

      // 5. Navigate to login screen
      router.replace("/Auth/Login");
    } catch (error) {
      logger.error("❌ Logout error:", error);
    }
  };

  if (isLoading) {
    return <Loading fullScreen text="Loading profile..." />;
  }

  const profile = userProfile || currentUser;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.surface2 }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border, paddingTop: insets.top }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
        <TouchableOpacity onPress={() => router.push("/settings/manage")}>
          <Ionicons name="settings-outline" size={24} color={accent} />
        </TouchableOpacity>
      </View>

      {/* Cover Photo */}
      {profile?.coverPhotoUrl ? (
        <Image
          source={{ uri: profile.coverPhotoUrl }}
          style={styles.coverPhoto}
        />
      ) : (
        <View style={styles.coverPhotoPlaceholder} />
      )}

      {/* Profile Info */}
      <View style={[styles.profileInfo, { backgroundColor: colors.surface }]}>
        <View style={styles.avatarContainer}>
          <Avatar
            uri={profile?.avatarUrl}
            name={profile?.username}
            size={100}
          />
          {profile?.isVerified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={24} color="#0a7ea4" />
            </View>
          )}
        </View>

        <Text style={[styles.username, { color: colors.text }]}>{profile?.username}</Text>
        {profile?.bio && <Text style={[styles.bio, { color: colors.subtext }]}>{profile.bio}</Text>}

        {/* Stats */}
        <View style={styles.stats}>
          {/* Posts */}
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {profile?._count?.posts || 0}
            </Text>
            <Text style={[styles.statLabel, { color: colors.subtext }]}>Posts</Text>
          </View>

          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />

          {/* Response Speed */}
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {responseSpeedLabel}
            </Text>
            <Text style={[styles.statLabel, { color: colors.subtext }]}>Resp. Speed</Text>
          </View>

          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />

          {/* Vibe Score */}
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: accent }]}>
              {vibeScore}
            </Text>
            <Text style={[styles.statLabel, { color: colors.subtext }]}>Vibe Score</Text>
          </View>

          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />

          {/* Milestone Badge */}
          <View style={[styles.statItem, styles.badgeItem]}>
            <View style={[styles.badgeChip, { borderColor: accent }]}>
              <MaterialCommunityIcons name="medal-outline" size={16} color={accent} />
              <Text style={[styles.badgeScore, { color: accent }]}>{badgeScore}</Text>
            </View>
            <Text style={[styles.statLabel, { color: colors.subtext }]}>Badge</Text>
          </View>
        </View>

        {/* NO Edit Profile button — use the ⚙️ gear icon in the header */}
      </View>

      {/* ── Profile Preview ─────────────────────────────────────────────── */}
      <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Profile Preview</Text>
        <Text style={[styles.sectionNote, { color: colors.subtext }]}>
          This is a preview of how your profile looks to other users. It is non-editable.
        </Text>
        <TouchableOpacity
          style={[styles.previewBtn, { borderColor: colors.border }]}
          onPress={() => router.push(`/user/${currentUser?.id}?preview=true` as any)}
          activeOpacity={0.8}
        >
          <Text style={[styles.previewBtnTxt, { color: accent }]}>View Preview →</Text>
        </TouchableOpacity>
      </View>

      {/* ── YOUR POSTS ───────────────────────────────────────────────────── */}
      <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>YOUR POSTS</Text>
          <TouchableOpacity onPress={() => router.push("/create-post" as any)}>
            <Ionicons name="add-circle-outline" size={22} color={accent} />
          </TouchableOpacity>
        </View>

        {myPosts.length === 0 ? (
          <Text style={[styles.sectionNote, { color: colors.subtext }]}>No posts yet.</Text>
        ) : (
          myPosts.map((post) => (
            <View key={post.id} style={[styles.postRow, { borderBottomColor: colors.border }]}>
              <Text style={[styles.postContent, { color: colors.text }]} numberOfLines={2}>
                {post.content}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  Alert.alert("Post options", undefined, [
                    {
                      text: "Edit",
                      onPress: () => router.push(`/post/${post.id}` as any),
                    },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: () =>
                        Alert.alert("Delete post?", "This cannot be undone.", [
                          { text: "Cancel", style: "cancel" },
                          {
                            text: "Delete",
                            style: "destructive",
                            onPress: async () => {
                              try {
                                await deletePost(post.id).unwrap();
                              } catch (e) {
                                logger.error("Delete post failed:", e);
                              }
                            },
                          },
                        ]),
                    },
                    { text: "Cancel", style: "cancel" },
                  ])
                }
              >
                <Ionicons name="ellipsis-horizontal" size={20} color={colors.subtext} />
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      {/* ── Account Management ──────────────────────────────────────────── */}
      <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Account Management</Text>

        <TouchableOpacity
          style={[styles.menuItem, { borderBottomColor: colors.border }]}
          onPress={() => router.push("/settings/manage" as any)}
        >
          <Ionicons name="person-circle-outline" size={24} color={colors.subtext} />
          <Text style={[styles.menuText, { color: colors.text }]}>Account Edit</Text>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, { borderBottomColor: colors.border }]}
          onPress={() => router.push("/settings" as any)}
        >
          <Ionicons name="settings-outline" size={24} color={colors.subtext} />
          <Text style={[styles.menuText, { color: colors.text }]}>Settings Controls</Text>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>
      </View>

      {/* Menu Items */}
      <View style={[styles.menu, { backgroundColor: colors.surface }]}>
        <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]} onPress={() => router.push("/saved-posts")}>
          <Ionicons name="bookmark-outline" size={24} color={colors.subtext} />
          <Text style={[styles.menuText, { color: colors.text }]}>Saved Posts</Text>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]} onPress={() => router.push("/blocked")}>
          <Ionicons name="ban-outline" size={24} color={colors.subtext} />
          <Text style={[styles.menuText, { color: colors.text }]}>Blocked Users</Text>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]} onPress={() => router.push("/privacy")}>
          <Ionicons name="shield-checkmark-outline" size={24} color={colors.subtext} />
          <Text style={[styles.menuText, { color: colors.text }]}>Privacy</Text>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]} onPress={() => router.push("/help")}>
          <Ionicons name="help-circle-outline" size={24} color={colors.subtext} />
          <Text style={[styles.menuText, { color: colors.text }]}>Help & Support</Text>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, styles.logoutItem]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#ef4444" />
          <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  coverPhoto: {
    width: "100%",
    height: 150,
  },
  coverPhotoPlaceholder: {
    width: "100%",
    height: 150,
    backgroundColor: "#e5e7eb",
  },
  profileInfo: {
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    marginTop: -50,
  },
  avatarContainer: {
    position: "relative",
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  username: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginTop: 12,
  },
  bio: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 20,
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingHorizontal: 16,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  statLabel: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 3,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 8,
  },
  badgeItem: {
    alignItems: "center",
  },
  badgeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeScore: {
    fontSize: 14,
    fontWeight: "700",
  },
  // ── Profile Preview / Posts / Account Management ──────────────────────
  section: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  sectionNote: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  previewBtn: {
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 20,
    borderWidth: 1,
  },
  previewBtnTxt: {
    fontSize: 14,
    fontWeight: "600",
  },
  postRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    gap: 8,
  },
  postContent: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  // ── Menu ──────────────────────────────────────────────────────────────
  menu: {
    backgroundColor: "#fff",
    marginTop: 12,
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f3f4f6",
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: "#374151",
    marginLeft: 16,
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: "#ef4444",
  },
});

