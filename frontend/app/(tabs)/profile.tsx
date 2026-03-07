import { Avatar, Button, Loading } from "@/components/ui";
import { persistor, RootState } from "@/src/store";
import { authApi } from "@/src/store/Apis/AuthApi";
import { blocksApi } from "@/src/store/Apis/BlocksApi";
import { exploreApi } from "@/src/store/Apis/ExploreApi";
import { groupsApi } from "@/src/store/Apis/GroupsApi";
import { messagesApi } from "@/src/store/Apis/MessagesApi";
import { postsApi } from "@/src/store/Apis/PostsApi";
import { useGetUserByIdQuery, usersApi } from "@/src/store/Apis/UsersApi";

import { useAppTheme } from "@/src/hooks/useAppTheme";
import { logout } from "@/src/store/AuthSlice";
import { expoLogger as logger } from "@/src/utils/logger";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function ProfileScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const { colors, accent } = useAppTheme();
  const { data: userProfile, isLoading } = useGetUserByIdQuery(
    currentUser?.id || "",
    { skip: !currentUser?.id }
  );

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
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
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
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {profile?._count?.posts || 0}
            </Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {profile?._count?.followers || 0}
            </Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {profile?._count?.following || 0}
            </Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            title="Edit Profile"
            onPress={() => router.push("/settings/manage")}
            variant="outline"
            style={styles.actionButton}
          />
        </View>
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
    paddingHorizontal: 40,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  statLabel: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 20,
  },
  actions: {
    width: "100%",
    marginTop: 20,
  },
  actionButton: {
    width: "100%",
  },
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

