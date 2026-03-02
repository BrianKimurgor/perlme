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

const { width } = Dimensions.get("window");

interface PostCardProps {
    post: Post;
    onLike: () => void;
    onComment: () => void;
    onUserPress: () => void;
    isLiked?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
    post,
    onLike,
    onComment,
    onUserPress,
    isLiked = false,
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

    return (
        <View style={styles.container}>
            {/* Header */}
            <TouchableOpacity style={styles.header} onPress={onUserPress}>
                <Avatar
                    uri={post.author?.avatarUrl}
                    name={post.author?.username}
                    size={40}
                />
                <View style={styles.userInfo}>
                    <Text style={styles.username}>{post.author?.username}</Text>
                    <Text style={styles.time}>{formatTimeAgo(post.createdAt)}</Text>
                </View>
            </TouchableOpacity>

            {/* Content */}
            <Text style={styles.content}>{post.content}</Text>

            {/* Media */}
            {post.media && post.media.length > 0 && (
                <View style={styles.mediaContainer}>
                    {post.media[0].type.startsWith("image") && (
                        <Image
                            source={{ uri: post.media[0].url }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    )}
                </View>
            )}

            {/* Actions */}
            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton} onPress={onLike}>
                    <Ionicons
                        name={isLiked ? "heart" : "heart-outline"}
                        size={24}
                        color={isLiked ? "#ff3366" : "#6b7280"}
                    />
                    <Text style={styles.actionText}>{post._count?.likes || 0}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={onComment}>
                    <Ionicons name="chatbubble-outline" size={22} color="#6b7280" />
                    <Text style={styles.actionText}>{post._count?.comments || 0}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="share-outline" size={24} color="#6b7280" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        marginBottom: 8,
        paddingVertical: 12,
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
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
    },
    time: {
        fontSize: 12,
        color: "#9ca3af",
        marginTop: 2,
    },
    content: {
        fontSize: 15,
        color: "#374151",
        lineHeight: 20,
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    mediaContainer: {
        marginBottom: 12,
    },
    image: {
        width: width,
        height: width * 0.75,
    },
    actions: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 8,
        borderTopWidth: 0.5,
        borderTopColor: "#e5e7eb",
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 24,
    },
    actionText: {
        fontSize: 14,
        color: "#6b7280",
        marginLeft: 6,
        fontWeight: "500",
    },
});
