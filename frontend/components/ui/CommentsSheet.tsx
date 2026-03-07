import {
    Comment,
    useCommentOnPostMutation,
    useGetPostByIdQuery,
} from "@/src/store/Apis/PostsApi";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    ActivityIndicator,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Toast from "react-native-toast-message";
import { CommentInput } from "./CommentInput";
import { CommentItem } from "./CommentItem";

interface CommentsSheetProps {
    postId: string;
    visible: boolean;
    onClose: () => void;
    onUserPress?: (userId: string) => void;
}

export const CommentsSheet: React.FC<CommentsSheetProps> = ({
    postId,
    visible,
    onClose,
    onUserPress,
}) => {
    const { data: post, isLoading } = useGetPostByIdQuery(postId, {
        skip: !visible || !postId,
    });
    const [commentOnPost, { isLoading: isCommenting }] =
        useCommentOnPostMutation();
    const { colors, accent } = useAppTheme();

    const comments: Comment[] = post?.comments || [];

    const handleSubmitComment = async (text: string) => {
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

    const renderComment = ({ item }: { item: Comment }) => (
        <CommentItem comment={item} onUserPress={onUserPress} />
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={[styles.container, { backgroundColor: colors.surface }]}>
                {/* Header */}
                <View style={[styles.header, { borderBottomColor: colors.border }]}>
                    <View style={[styles.handle, { backgroundColor: colors.border }]} />
                    <View style={styles.headerRow}>
                        <Text style={[styles.title, { color: colors.text }]}>
                            Comments{" "}
                            <Text style={styles.commentCount}>
                                ({comments.length})
                            </Text>
                        </Text>
                        <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                            <Ionicons name="close" size={24} color="#8e44ad" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Comments List */}
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={accent} />
                        <Text style={[styles.loadingText, { color: accent }]}>Loading comments...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={comments}
                        renderItem={renderComment}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Ionicons
                                    name="chatbubble-ellipses-outline"
                                    size={48}
                                    color="#e5c6f5"
                                />
                                <Text style={[styles.emptyTitle, { color: colors.text }]}>No comments yet</Text>
                                <Text style={[styles.emptySubtext, { color: colors.subtext }]}>
                                    Be the first to share your thoughts!
                                </Text>
                            </View>
                        }
                    />
                )}

                {/* Comment Input */}
                <CommentInput
                    onSubmit={handleSubmitComment}
                    isSubmitting={isCommenting}
                />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        alignItems: "center",
        paddingTop: 8,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#fce4ec",
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: "#e5c6f5",
        borderRadius: 2,
        marginBottom: 12,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1f2937",
    },
    commentCount: {
        color: "#8e44ad",
        fontWeight: "600",
    },
    listContent: {
        paddingTop: 16,
        paddingBottom: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: "#8e44ad",
    },
    emptyContainer: {
        alignItems: "center",
        paddingVertical: 60,
    },
    emptyTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: "#8e44ad",
        marginTop: 14,
    },
    emptySubtext: {
        fontSize: 14,
        color: "#b0b0b0",
        marginTop: 6,
    },
});
