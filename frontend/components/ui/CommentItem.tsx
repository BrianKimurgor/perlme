import { Comment } from "@/src/store/Apis/PostsApi";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Avatar } from "./Avatar";

interface CommentItemProps {
    comment: Comment;
    onUserPress?: (userId: string) => void;
}

const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
    return date.toLocaleDateString();
};

export const CommentItem: React.FC<CommentItemProps> = ({
    comment,
    onUserPress,
}) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => onUserPress?.(comment.userId)}
                activeOpacity={0.7}
            >
                <Avatar
                    uri={comment.user?.avatarUrl}
                    name={comment.user?.username}
                    size={34}
                />
            </TouchableOpacity>

            <View style={styles.bubble}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => onUserPress?.(comment.userId)}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.username}>
                            {comment.user?.username || "User"}
                        </Text>
                    </TouchableOpacity>
                    <Text style={styles.time}>{formatTimeAgo(comment.createdAt)}</Text>
                </View>
                <Text style={styles.content}>{comment.content}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        marginBottom: 12,
        paddingHorizontal: 16,
    },
    bubble: {
        flex: 1,
        marginLeft: 10,
        backgroundColor: "#fdf2f8",
        borderRadius: 16,
        borderTopLeftRadius: 4,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },
    username: {
        fontSize: 13,
        fontWeight: "700",
        color: "#8e44ad",
    },
    time: {
        fontSize: 11,
        color: "#b0b0b0",
    },
    content: {
        fontSize: 14,
        color: "#1f2937",
        lineHeight: 19,
    },
});
