import { Avatar, Button, Loading, PostCard } from "@/components/ui";
import { RootState } from "@/src/store";
import { useBlockUserMutation } from "@/src/store/Apis/BlocksApi";
import { useGetAllPostsQuery } from "@/src/store/Apis/PostsApi";
import {
    useCheckIfFollowingQuery,
    useFollowUserMutation,
    useGetUserByIdQuery,
    useUnfollowUserMutation
} from "@/src/store/Apis/UsersApi";
import { VIBE_META, useGetVibesQuery } from "@/src/store/Apis/VibesApi";
import { API_BASE_URL } from "@/src/utils/config";
import { expoLogger as logger } from "@/src/utils/logger";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

export default function UserProfileScreen() {
    const { userId } = useLocalSearchParams<{ userId: string }>();
    const router = useRouter();
    const currentUserId = useSelector((state: RootState) => state.auth.user?.id);
    const token = useSelector((state: RootState) => state.auth.token);

    const { data: userProfile, isLoading } = useGetUserByIdQuery(userId || "", {
        skip: !userId,
    });

    const { data: followData, refetch: refetchFollowStatus } = useCheckIfFollowingQuery(userId || "", {
        skip: !userId,
    });

    const { data: allPosts } = useGetAllPostsQuery();
    const { data: vibeData } = useGetVibesQuery(userId || "", { skip: !userId });
    const [blockUser] = useBlockUserMutation();
    const [followUser] = useFollowUserMutation();
    const [unfollowUser] = useUnfollowUserMutation();

    const isFollowing = followData?.isFollowing || false;

    // Filter posts by this user
    const userPosts = allPosts?.filter((post) => post.authorId === userId) || [];

    const handleMessage = () => {
        router.push(`/conversation/${userId}` as any);
    };

    const handleFollow = async () => {
        if (!userId) return;
        try {
            if (isFollowing) {
                await unfollowUser(userId).unwrap();
                Toast.show({
                    type: "success",
                    text1: "Unfollowed user",
                });
            } else {
                await followUser(userId).unwrap();
                Toast.show({
                    type: "success",
                    text1: "Followed user",
                });
            }
            refetchFollowStatus();
        } catch (error: any) {
            // Handle "not following" error gracefully - might be stale data
            if (error?.status === 404 && error?.data?.message === "Follow relationship not found") {
                logger.info("Already unfollowed, refreshing status...");
                await refetchFollowStatus();
            } else if (error?.status === 400 && error?.data?.message === "Already following this user") {
                logger.info("Already following, refreshing status...");
                await refetchFollowStatus();
            } else {
                Toast.show({
                    type: "error",
                    text1: "Failed to update follow status",
                });
            }
        }
    };

    const handleBlock = async () => {
        if (!userId) return;
        try {
            await blockUser({ targetUserId: userId }).unwrap();
            Toast.show({
                type: "success",
                text1: "User blocked",
            });
            router.back();
        } catch (error) {
            logger.error("Failed to block user", error);
            Toast.show({
                type: "error",
                text1: "Failed to block user",
            });
        }
    };

    const handleReport = async () => {
        if (!userId || !token) return;
        try {
            const response = await fetch(`${API_BASE_URL}reports`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    reportedUserId: userId,
                    reason: "User profile reported",
                    description: "Reported from profile screen",
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to submit report");
            }

            Toast.show({
                type: "success",
                text1: "Report submitted",
            });
        } catch (error) {
            logger.error("Failed to report user", error);
            Toast.show({
                type: "error",
                text1: "Failed to report user",
            });
        }
    };

    if (isLoading) {
        return <Loading fullScreen text="Loading profile..." />;
    }

    if (!userProfile) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>User not found</Text>
            </View>
        );
    }

    // Don't show if this is the current user
    if (userId === currentUserId) {
        router.replace("/(tabs)/profile");
        return null;
    }

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{userProfile.username}</Text>
                <TouchableOpacity>
                    <Ionicons name="ellipsis-horizontal" size={24} color="#111827" />
                </TouchableOpacity>
            </View>

            {/* Cover Photo */}
            {userProfile.coverPhotoUrl ? (
                <Image
                    source={{ uri: userProfile.coverPhotoUrl }}
                    style={styles.coverPhoto}
                />
            ) : (
                <View style={styles.coverPhotoPlaceholder} />
            )}

            {/* Profile Info */}
            <View style={styles.profileInfo}>
                <View style={styles.avatarContainer}>
                    <Avatar
                        uri={userProfile.avatarUrl}
                        name={userProfile.username}
                        size={100}
                    />
                    {userProfile.isVerified && (
                        <View style={styles.verifiedBadge}>
                            <Ionicons name="checkmark-circle" size={24} color="#0a7ea4" />
                        </View>
                    )}
                </View>

                <Text style={styles.username}>{userProfile.username}</Text>
                {userProfile.bio && <Text style={styles.bio}>{userProfile.bio}</Text>}

                {/* Stats */}
                <View style={styles.stats}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>
                            {userProfile._count?.posts || 0}
                        </Text>
                        <Text style={styles.statLabel}>Posts</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>
                            {userProfile._count?.followers || 0}
                        </Text>
                        <Text style={styles.statLabel}>Followers</Text>
                    </View>
                    <View style={styles.statDivider} />
                    {/* Vibe badge replaces the old "Following" count */}
                    <View style={styles.statItem}>
                        {vibeData?.topVibe ? (
                            <>
                                <Text style={styles.vibeBadgeIcon}>
                                    {VIBE_META[vibeData.topVibe.vibeType].icon}
                                </Text>
                                <Text style={styles.vibeBadgeLabel} numberOfLines={1}>
                                    {VIBE_META[vibeData.topVibe.vibeType].label}
                                </Text>
                                <Text style={styles.statLabel}>Vibe</Text>
                            </>
                        ) : (
                            <>
                                <Text style={styles.vibeBadgeIcon}>✨</Text>
                                <Text style={styles.statLabel}>Vibe</Text>
                            </>
                        )}
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actions}>
                    <Button
                        title={isFollowing ? "Following" : "Follow"}
                        onPress={handleFollow}
                        variant={isFollowing ? "outline" : "primary"}
                        style={styles.followButton}
                    />
                    <Button
                        title="Message"
                        onPress={handleMessage}
                        variant="outline"
                        style={styles.messageButton}
                    />
                </View>
            </View>

            {/* Posts */}
            <View style={styles.postsSection}>
                <Text style={styles.sectionTitle}>Posts</Text>
                {userPosts.length > 0 ? (
                    userPosts.map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            onLike={() => { }}
                            onComment={() => router.push(`/post/${post.id}` as any)}
                            onUserPress={() => { }}
                        />
                    ))
                ) : (
                    <View style={styles.noPosts}>
                        <Ionicons name="document-outline" size={48} color="#d1d5db" />
                        <Text style={styles.noPostsText}>No posts yet</Text>
                    </View>
                )}
            </View>

            {/* Danger Zone */}
            <View style={styles.dangerZone}>
                <TouchableOpacity style={styles.dangerButton} onPress={handleBlock}>
                    <Ionicons name="ban-outline" size={20} color="#ef4444" />
                    <Text style={styles.dangerText}>Block User</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dangerButton} onPress={handleReport}>
                    <Ionicons name="flag-outline" size={20} color="#ef4444" />
                    <Text style={styles.dangerText}>Report User</Text>
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
        fontSize: 18,
        fontWeight: "600",
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
    vibeBadgeIcon: {
        fontSize: 22,
    },
    vibeBadgeLabel: {
        fontSize: 11,
        fontWeight: "700",
        color: "#111827",
        marginTop: 2,
        textAlign: "center",
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: "#e5e7eb",
        marginHorizontal: 20,
    },
    actions: {
        flexDirection: "row",
        width: "100%",
        marginTop: 20,
        gap: 12,
    },
    followButton: {
        flex: 1,
    },
    messageButton: {
        flex: 1,
    },
    postsSection: {
        backgroundColor: "#fff",
        marginTop: 12,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 16,
    },
    noPosts: {
        alignItems: "center",
        paddingVertical: 40,
    },
    noPostsText: {
        fontSize: 16,
        color: "#9ca3af",
        marginTop: 12,
    },
    dangerZone: {
        backgroundColor: "#fff",
        marginTop: 12,
        padding: 16,
        marginBottom: 20,
    },
    dangerButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
    },
    dangerText: {
        fontSize: 16,
        color: "#ef4444",
        marginLeft: 12,
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        fontSize: 18,
        color: "#6b7280",
    },
});
