import ChatInput from "@/components/ChatInput";
import MessageBubble from "@/components/MessageBubble";
import { Avatar, Loading } from "@/components/ui";
// eslint-disable-next-line import/no-named-as-default
import socketService from "@/services/socketService";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { RootState } from "@/src/store";
import {
    Message,
    useGetConversationQuery,
    useMarkConversationAsReadMutation,
    useSendMessageMutation,
} from "@/src/store/Apis/MessagesApi";
import { useGetUserByIdQuery } from "@/src/store/Apis/UsersApi";
import { expoLogger as logger } from "@/src/utils/logger";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSelector } from "react-redux";

export default function ConversationScreen() {
    const { userId } = useLocalSearchParams<{ userId: string }>();
    const router = useRouter();
    const flatListRef = useRef<FlatList>(null);
    const currentUserId = useSelector((state: RootState) => state.auth.user?.id);
    const token = useSelector((state: RootState) => state.auth.token);
    const { colors, accent } = useAppTheme();

    const { data: messages, isLoading, refetch } = useGetConversationQuery(userId || "", {
        skip: !userId,
    });

    const { data: otherUser } = useGetUserByIdQuery(userId || "", {
        skip: !userId,
    });

    const [sendMessage] = useSendMessageMutation();
    const [markAsRead] = useMarkConversationAsReadMutation();

    useEffect(() => {
        if (userId) {
            markAsRead(userId);
        }
    }, [userId, markAsRead]);

    useEffect(() => {
        if (!token || !userId) return;

        socketService.connect(token);

        const handleRealtimeUpdate = () => {
            refetch();
        };

        socketService.on("new_message", handleRealtimeUpdate);
        socketService.on("message_sent", handleRealtimeUpdate);
        socketService.on("message_delivered", handleRealtimeUpdate);
        socketService.on("message_read", handleRealtimeUpdate);
        socketService.on("messages_read", handleRealtimeUpdate);

        return () => {
            socketService.off("new_message", handleRealtimeUpdate);
            socketService.off("message_sent", handleRealtimeUpdate);
            socketService.off("message_delivered", handleRealtimeUpdate);
            socketService.off("message_read", handleRealtimeUpdate);
            socketService.off("messages_read", handleRealtimeUpdate);
            socketService.disconnect();
        };
    }, [token, userId, refetch]);

    const handleSendMessage = async (text: string) => {
        if (!text.trim() || !userId) return;

        try {
            await sendMessage({
                receiverId: userId,
                content: text.trim(),
            }).unwrap();

            // Scroll to bottom after sending
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        } catch (error) {
            logger.error("Failed to send message:", error);
        }
    };

    const renderMessage = ({ item }: { item: Message }) => (
        <MessageBubble
            message={{
                id: item.id,
                text: item.content,
                sender: item.sender?.username || "Unknown",
                senderId: item.senderId,
                timestamp: item.createdAt,
                isOwnMessage: item.senderId === currentUserId,
            }}
        />
    );

    if (isLoading) {
        return <Loading fullScreen text="Loading conversation..." />;
    }

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: colors.bg }]}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={100}
        >
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={accent} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.userInfo}
                    onPress={() => userId && router.push(`/user/${userId}` as any)}
                >
                    <Avatar
                        uri={otherUser?.avatarUrl}
                        name={otherUser?.username}
                        size={36}
                    />
                    <View style={styles.userDetails}>
                        <Text style={[styles.username, { color: colors.text }]}>{otherUser?.username}</Text>
                        <Text style={styles.status}>Active</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="ellipsis-vertical" size={20} color={accent} />
                </TouchableOpacity>
            </View>

            {/* Messages */}
            <FlatList
                ref={flatListRef}
                data={messages || []}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.messagesList}
                inverted={false}
                onContentSizeChange={() =>
                    flatListRef.current?.scrollToEnd({ animated: false })
                }
            />

            {/* Input */}
            <ChatInput
                onSendMessage={handleSendMessage}
                onTyping={(isTyping) => {
                    if (!userId) return;
                    if (isTyping) {
                        socketService.emitTyping(userId);
                        return;
                    }
                    socketService.emitStopTyping(userId);
                }}
            />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fdf2f8",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#fce4ec",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    userInfo: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 12,
    },
    userDetails: {
        marginLeft: 12,
    },
    username: {
        fontSize: 16,
        fontWeight: "700",
        color: "#1f2937",
    },
    status: {
        fontSize: 12,
        color: "#10b981",
        fontWeight: "500",
    },
    messagesList: {
        padding: 16,
    },
});
