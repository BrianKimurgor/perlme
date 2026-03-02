import { Avatar, Loading } from "@/components/ui";
import { RootState } from "@/src/store";
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
    TextInput,
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

    const [commentText, setCommentText] = useState("");

    const isLiked = post?.likes?.some((like) => like.userId === currentUserId) || false;

    const handleLike = async () => {
        if (!postId) return;
        try {
            if (isLiked) {
                await unlikePost(postId).unwrap();
            } else {
                await likePost(postId).unwrap();
            }
        } catch (error: any) {
            console.error("Failed to toggle like:", error);
        }
    };

    const handleComment = async () => {
        if (!commentText.trim() || !postId) return;

        try {
            await commentOnPost({
                postId,
                data: { content: commentText.trim() },
            }).unwrap();

            setCommentText("");
            Toast.show({
                type: "success",
                text1: "Comment posted",
            });
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Failed to post comment",
            });
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

    const renderComment = ({ item }: { item: Comment }) => (
        <View style={styles.commentItem}>
            <Avatar uri={item.user?.avatarUrl} name={item.user?.username} size={36} />
            <View style={styles.commentContent}>
                <View style={styles.commentHeader}>
                    <Text style={styles.commentUsername}>{item.user?.username}</Text>
                    <Text style={styles.commentTime}>{formatTimeAgo(item.createdAt)}</Text>
                </View>
                <Text style={styles.commentText}>{item.content}</Text>
            </View>
        </View>
    );

    if (isLoading) {
        return <Loading fullScreen text="Loading post..." />;
    }

    if (!post) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Post not found</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#111827" />
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
                    <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
                        <Ionicons
                            name={isLiked ? "heart" : "heart-outline"}
                            size={28}
                            color={isLiked ? "#ff3366" : "#6b7280"}
                        />
                        <Text style={styles.actionText}>{post._count?.likes || 0} likes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="chatbubble-outline" size={26} color="#6b7280" />
                        <Text style={styles.actionText}>
                            {post._count?.comments || 0} comments
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Comments Section */}
                <View style={styles.commentsSection}>
                    <Text style={styles.commentsTitle}>Comments</Text>
                    {post.comments && post.comments.length > 0 ? (
                        post.comments.map((comment) => (
                            <View key={comment.id}>{renderComment({ item: comment })}</View>
                        ))
                    ) : (
                        <View style={styles.noComments}>
                            <Text style={styles.noCommentsText}>
                                No comments yet. Be the first!
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Comment Input */}
            <View style={styles.commentInputContainer}>
                <Avatar uri={currentUserId} name="You" size={36} />
                <TextInput
                    style={styles.commentInput}
                    placeholder="Add a comment..."
                    value={commentText}
                    onChangeText={setCommentText}
                    multiline
                />
                <TouchableOpacity
                    onPress={handleComment}
                    disabled={!commentText.trim() || isCommenting}
                >
                    <Ionicons
                        name="send"
                        size={24}
                        color={commentText.trim() ? "#ff3366" : "#d1d5db"}
                    />
                </TouchableOpacity>
            </View>
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
        borderBottomWidth: 0.5,
        borderBottomColor: "#e5e7eb",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#111827",
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
        fontWeight: "600",
        color: "#111827",
    },
    postTime: {
        fontSize: 12,
        color: "#9ca3af",
        marginTop: 2,
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
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderColor: "#e5e7eb",
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
        color: "#111827",
        marginBottom: 16,
    },
    commentItem: {
        flexDirection: "row",
        marginBottom: 16,
    },
    commentContent: {
        flex: 1,
        marginLeft: 12,
    },
    commentHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4,
    },
    commentUsername: {
        fontSize: 14,
        fontWeight: "600",
        color: "#111827",
    },
    commentTime: {
        fontSize: 12,
        color: "#9ca3af",
    },
    commentText: {
        fontSize: 14,
        color: "#374151",
        lineHeight: 20,
    },
    noComments: {
        paddingVertical: 40,
        alignItems: "center",
    },
    noCommentsText: {
        fontSize: 14,
        color: "#9ca3af",
    },
    commentInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 0.5,
        borderTopColor: "#e5e7eb",
        gap: 12,
    },
    commentInput: {
        flex: 1,
        fontSize: 14,
        color: "#111827",
        maxHeight: 100,
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
