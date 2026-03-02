import { Post, useRepostMutation } from "@/src/store/Apis/PostsApi";
import { useSendMessageMutation } from "@/src/store/Apis/MessagesApi";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Toast from "react-native-toast-message";
import { SHARE_OPTIONS, ShareOption } from "./shareOptions";
import { UserPickerSheet } from "./UserPickerSheet";

interface ShareSheetProps {
    post: Post;
    visible: boolean;
    onClose: () => void;
}

export const ShareSheet: React.FC<ShareSheetProps> = ({
    post,
    visible,
    onClose,
}) => {
    const [repostPost, { isLoading: isReposting }] = useRepostMutation();
    const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
    const [showUserPicker, setShowUserPicker] = useState(false);
    const isBusy = isReposting || isSending;

    const handleOptionPress = async (option: ShareOption) => {
        if (isBusy) return;

        switch (option.id) {
            case "repost":
                await handleRepost();
                break;
            case "send_to_user":
                setShowUserPicker(true);
                break;
            default:
                // Future share targets (WhatsApp, SMS, etc.) go here
                Toast.show({ type: "info", text1: `${option.label} coming soon!` });
                break;
        }
    };

    const handleRepost = async () => {
        try {
            await repostPost(post.id).unwrap();
            Toast.show({ type: "success", text1: "Shared to your feed!" });
            onClose();
        } catch (err: any) {
            const msg = err?.data?.message || "Failed to repost";
            Toast.show({ type: "error", text1: msg });
        }
    };

    const handleSendToUser = async (user: { id: string; username: string }) => {
        try {
            const postPreview = post.content.length > 100
                ? `${post.content.substring(0, 100)}...`
                : post.content;
            const shareText = `📌 Shared a post:\n\n"${postPreview}"\n\n— @${post.author?.username || "someone"}`;

            await sendMessage({
                receiverId: user.id,
                content: shareText,
            }).unwrap();

            setShowUserPicker(false);
            Toast.show({ type: "success", text1: `Sent to ${user.username}!` });
            onClose();
        } catch {
            Toast.show({ type: "error", text1: "Failed to send" });
        }
    };

    const renderOption = (option: ShareOption) => (
        <TouchableOpacity
            key={option.id}
            style={styles.optionRow}
            onPress={() => handleOptionPress(option)}
            disabled={isBusy}
            activeOpacity={0.7}
        >
            <View style={[styles.optionIcon, { backgroundColor: `${option.iconColor}15` }]}>
                <Ionicons name={option.icon} size={24} color={option.iconColor} />
            </View>
            <View style={styles.optionText}>
                <Text style={styles.optionLabel}>{option.label}</Text>
                <Text style={styles.optionDesc}>{option.description}</Text>
            </View>
            {isBusy && option.id === "repost" && isReposting && (
                <ActivityIndicator size="small" color={option.iconColor} />
            )}
            {!isBusy && (
                <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
            )}
        </TouchableOpacity>
    );

    return (
        <>
            <Modal
                visible={visible && !showUserPicker}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={onClose}
            >
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.handle} />
                        <View style={styles.headerRow}>
                            <Text style={styles.title}>Share</Text>
                            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                                <Ionicons name="close" size={24} color="#8e44ad" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Post Preview */}
                    <View style={styles.postPreview}>
                        <Text style={styles.previewAuthor}>
                            @{post.author?.username || "user"}
                        </Text>
                        <Text style={styles.previewContent} numberOfLines={3}>
                            {post.content}
                        </Text>
                    </View>

                    {/* Share Options */}
                    <View style={styles.optionsContainer}>
                        {SHARE_OPTIONS.map(renderOption)}
                    </View>

                    {/* Cancel */}
                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            {/* User Picker (opens on top when "Send to a Friend" is selected) */}
            <UserPickerSheet
                visible={showUserPicker}
                onClose={() => setShowUserPicker(false)}
                onSelect={(user) => handleSendToUser(user)}
                title="Send post to..."
            />
        </>
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
    postPreview: {
        margin: 16,
        padding: 14,
        backgroundColor: "#fdf2f8",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#f9d4e8",
    },
    previewAuthor: {
        fontSize: 13,
        fontWeight: "700",
        color: "#8e44ad",
        marginBottom: 4,
    },
    previewContent: {
        fontSize: 14,
        color: "#374151",
        lineHeight: 20,
    },
    optionsContainer: {
        paddingHorizontal: 16,
    },
    optionRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        borderBottomWidth: 0.5,
        borderBottomColor: "#fce4ec",
    },
    optionIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
    },
    optionText: {
        flex: 1,
        marginLeft: 14,
    },
    optionLabel: {
        fontSize: 15,
        fontWeight: "600",
        color: "#1f2937",
    },
    optionDesc: {
        fontSize: 12,
        color: "#9ca3af",
        marginTop: 2,
    },
    cancelButton: {
        alignItems: "center",
        paddingVertical: 16,
        marginTop: 12,
        marginHorizontal: 16,
        borderRadius: 12,
        backgroundColor: "#fdf2f8",
    },
    cancelText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#6b7280",
    },
});
