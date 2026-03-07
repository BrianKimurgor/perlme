import { Avatar, CommentInput, CommentItem, LikeButton, Loading, ShareSheet } from "@/components/ui";
import { RootState } from "@/src/store";
import { expoLogger as logger } from "@/src/utils/logger";
import {
    Comment,
    useCommentOnPostMutation,
    useGetPostByIdQuery,
    useLikePostMutation,
    useUnlikePostMutation,
} from "@/src/store/Apis/PostsApi";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

export default function PostDetailScreen() {
    const { postId } = useLocalSearchParams<{ postId: string }>();
    const router = useRouter();
    const currentUserId = useSelector((state: RootState) => state.auth.user?.id);

    const { data: post, isLoading } = useGetPostByIdQuery(postId || "", {
        skip: !postId,
    });

    const [likePost] = useLikePostMutation();
    const [unlikePost] = useUnlikePostMutation();
    const [commentOnPost, { isLoading: isCommenting }] = useCommentOnPostMutation();
    const [showShareSheet, setShowShareSheet] = useState(false);

    const isLiked = (post as any)?.isLikedByCurrentUser
        ?? post?.likes?.some((like) => like.userId === currentUserId)
        ?? false;

    const likeCount = (post as any)?.likeCount ?? post?.likes?.length ?? 0;

    const handleLike = async () => {
        if (!postId) return;
        try {
            if (isLiked) {
                await unlikePost(postId).unwrap();
            } else {
                await likePost(postId).unwrap();
            }
        } catch (error: any) {
            logger.error("Failed to toggle like:", error);
        }
    };

    const handleComment = async (text: string) => {
        if (!postId) return;
        try {
            await commentOnPost({
                postId,
                data: { content: text },
            }).unwrap();
            Toast.show({ type: "success", text1: "Comment posted" });
        } catch {
            Toast.show({ type: "error", text1: "Failed to post comment" });
        }
    };

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

    if (isLoading) {
        return <Loading fullScreen text="Loading post..." />;
    }

    if (!post) {
        return (
            <View style={styles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={48} color="#e5c6f5" />
                <Text style={styles.errorText}>Post not found</Text>
            </View>
        );
    }

    const comments: Comment[] = post.comments || [];

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#8e44ad" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Post</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                {/* Post Header */}
                <TouchableOpacity
                    style={styles.postHeader}
                    onPress={() => router.push(`/user/${post.authorId}`)}
                >
                    <Avatar
                        uri={post.author?.avatarUrl}
                        name={post.author?.username}
                        size={48}
                    />
                    <View style={styles.postUserInfo}>
                        <Text style={styles.postUsername}>{post.author?.username}</Text>
                        <Text style={styles.postTime}>{formatTimeAgo(post.createdAt)}</Text>
                    </View>
                </TouchableOpacity>

                {/* Post Content */}
                <Text style={styles.postContent}>{post.content}</Text>

                {/* Post Actions */}
                <View style={styles.postActions}>
                    <LikeButton
                        isLiked={isLiked}
                        likeCount={likeCount}
                        onToggle={handleLike}
                        size="large"
                    />
                    <View style={styles.actionButton}>
                        <Ionicons name="chatbubble-outline" size={26} color="#6b7280" />
                        <Text style={styles.actionText}>
                            {comments.length} {comments.length === 1 ? "comment" : "comments"}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => setShowShareSheet(true)}
                    >
                        <Ionicons name="share-outline" size={26} color="#6b7280" />
                        <Text style={styles.actionText}>Share</Text>
                    </TouchableOpacity>
                </View>

                {/* Comments Section */}
                <View style={styles.commentsSection}>
                    <Text style={styles.commentsTitle}>Comments</Text>
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                onUserPress={(userId) => router.push(`/user/${userId}`)}
                            />
                        ))
                    ) : (
                        <View style={styles.noComments}>
                            <Ionicons
                                name="chatbubble-ellipses-outline"
                                size={40}
                                color="#e5c6f5"
                            />
                            <Text style={styles.noCommentsText}>
                                No comments yet. Be the first!
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Comment Input */}
            <CommentInput onSubmit={handleComment} isSubmitting={isCommenting} />

            {/* Share Sheet */}
            {post && (
                <ShareSheet
                    post={post}
                    visible={showShareSheet}
                    onClose={() => setShowShareSheet(false)}
                />
            )}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#fce4ec",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#8e44ad",
    },
    content: {
        flex: 1,
    },
    postHeader: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
    },
    postUserInfo: {
        marginLeft: 12,
    },
    postUsername: {
        fontSize: 16,
        fontWeight: "700",
        color: "#1f2937",
    },
    postTime: {
        fontSize: 12,
        color: "#8e44ad",
        marginTop: 2,
        fontWeight: "500",
    },
    postContent: {
        fontSize: 16,
        color: "#374151",
        lineHeight: 22,
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    postActions: {
        flexDirection: "row",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#fce4ec",
        gap: 24,
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    actionText: {
        fontSize: 14,
        color: "#6b7280",
        fontWeight: "500",
    },
    commentsSection: {
        padding: 16,
    },
    commentsTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#8e44ad",
        marginBottom: 16,
    },
    noComments: {
        paddingVertical: 40,
        alignItems: "center",
    },
    noCommentsText: {
        fontSize: 14,
        color: "#b0b0b0",
        marginTop: 10,
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        fontSize: 18,
        color: "#8e44ad",
        marginTop: 12,
        fontWeight: "600",
    },
});
