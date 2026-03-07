import { Post } from "@/src/store/Apis/PostsApi";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Avatar } from "./Avatar";
import { LikeButton } from "./LikeButton";
import { useAppTheme } from "@/src/hooks/useAppTheme";

const { width } = Dimensions.get("window");

interface PostCardProps {
    post: Post;
    onLike: () => void;
    onComment: () => void;
    onUserPress: () => void;
    onShare?: () => void;
    onSave?: () => void;
    isLiked?: boolean;
    isSaved?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
    post,
    onLike,
    onComment,
    onUserPress,
    onShare,
    onSave,
    isLiked = false,
    isSaved = false,
}) => {
    const formatTimeAgo = (dateString: string): string => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return "just now";
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
        return date.toLocaleDateString();
    };

    const likeCount =
        (post as any).likeCount ?? post._count?.likes ?? post.likes?.length ?? 0;
    const commentCount =
        (post as any).commentCount ?? post._count?.comments ?? post.comments?.length ?? 0;
    const { colors, accent } = useAppTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
            {/* Header */}
            <TouchableOpacity style={styles.header} onPress={onUserPress}>
                <Avatar
                    uri={post.author?.avatarUrl}
                    name={post.author?.username}
                    size={42}
                />
                <View style={styles.userInfo}>
                    <Text style={[styles.username, { color: colors.text }]}>{post.author?.username}</Text>
                    <Text style={[styles.time, { color: accent }]}>{formatTimeAgo(post.createdAt)}</Text>
                </View>
                <TouchableOpacity style={styles.moreButton}>
                    <Ionicons name="ellipsis-horizontal" size={20} color={colors.subtext} />
                </TouchableOpacity>
            </TouchableOpacity>

            {/* Content */}
            <Text style={[styles.content, { color: colors.text }]}>{post.content}</Text>

            {/* Media */}
            {post.media && post.media.length > 0 && (
                <View style={styles.mediaContainer}>
                    {post.media.length === 1 ? (
                        <Image
                            source={{ uri: post.media[0].url }}
                            style={styles.singleImage}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={styles.mediaGrid}>
                            {post.media.slice(0, 4).map((item, index) => (
                                <View
                                    key={item.id}
                                    style={[
                                        styles.gridItem,
                                        post.media!.length === 2 && styles.gridItemHalf,
                                        post.media!.length >= 3 && styles.gridItemThird,
                                    ]}
                                >
                                    <Image
                                        source={{ uri: item.url }}
                                        style={styles.gridImage}
                                        resizeMode="cover"
                                    />
                                    {index === 3 && post.media!.length > 4 && (
                                        <View style={styles.moreOverlay}>
                                            <Text style={styles.moreOverlayText}>
                                                +{post.media!.length - 4}
                                            </Text>
                                        </View>
                                    )}
                                    {item.type === "video" && (
                                        <View style={styles.videoIndicator}>
                                            <Ionicons name="play-circle" size={28} color="#fff" />
                                        </View>
                                    )}
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            )}

            {/* Stats Row */}
            {(likeCount > 0 || commentCount > 0) && (
                <View style={styles.statsRow}>
                    {likeCount > 0 && (
                        <Text style={[styles.statsText, { color: colors.subtext }]}>
                            <Ionicons name="heart" size={13} color="#ff3366" /> {likeCount}{" "}
                            {likeCount === 1 ? "like" : "likes"}
                        </Text>
                    )}
                    {commentCount > 0 && (
                        <TouchableOpacity onPress={onComment}>
                            <Text style={[styles.statsText, { color: colors.subtext }]}>
                                <Ionicons name="chatbubble" size={13} color={accent} /> {commentCount}{" "}
                                {commentCount === 1 ? "comment" : "comments"}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {/* Actions */}
            <View style={[styles.actions, { borderTopColor: colors.border }]}>
                <LikeButton
                    isLiked={isLiked}
                    likeCount={likeCount}
                    onToggle={onLike}
                />

                <TouchableOpacity style={styles.actionButton} onPress={onComment}>
                    <Ionicons name="chatbubble-outline" size={22} color={colors.subtext} />
                    <Text style={[styles.actionLabel, { color: colors.subtext }]}>{commentCount}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={onShare}>
                    <Ionicons name="share-outline" size={22} color={colors.subtext} />
                    <Text style={[styles.actionLabel, { color: colors.subtext }]}>Share</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={onSave}>
                    <Ionicons
                        name={isSaved ? "bookmark" : "bookmark-outline"}
                        size={22}
                        color={isSaved ? "#ff3366" : colors.subtext}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        marginBottom: 8,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#fce4ec",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    userInfo: {
        marginLeft: 12,
        flex: 1,
    },
    username: {
        fontSize: 15,
        fontWeight: "700",
        color: "#1f2937",
    },
    time: {
        fontSize: 12,
        color: "#8e44ad",
        marginTop: 2,
        fontWeight: "500",
    },
    moreButton: {
        padding: 4,
    },
    content: {
        fontSize: 15,
        color: "#374151",
        lineHeight: 21,
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    mediaContainer: {
        marginBottom: 10,
    },
    singleImage: {
        width: width,
        height: width * 0.75,
    },
    mediaGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    gridItem: {
        position: "relative",
    },
    gridItemHalf: {
        width: width / 2,
        height: width / 2,
    },
    gridItemThird: {
        width: width / 2,
        height: width * 0.38,
    },
    gridImage: {
        width: "100%",
        height: "100%",
        borderWidth: 1,
        borderColor: "#fff",
    },
    moreOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "center",
        alignItems: "center",
    },
    moreOverlayText: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "700",
    },
    videoIndicator: {
        position: "absolute",
        top: "50%",
        left: "50%",
        marginTop: -14,
        marginLeft: -14,
    },
    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingBottom: 10,
    },
    statsText: {
        fontSize: 13,
        color: "#9ca3af",
        fontWeight: "500",
    },
    actions: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        paddingHorizontal: 16,
        paddingTop: 10,
        borderTopWidth: 0.5,
        borderTopColor: "#fce4ec",
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
    },
    actionLabel: {
        fontSize: 13,
        color: "#6b7280",
        marginLeft: 6,
        fontWeight: "500",
    },
});
