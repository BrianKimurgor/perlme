import ChatInput from "@/components/ChatInput";
import MessageBubble from "@/components/MessageBubble";
import { Avatar, Loading } from "@/components/ui";
import { RootState } from "@/src/store";
import {
    Message,
    useGetConversationQuery,
    useMarkConversationAsReadMutation,
    useSendMessageMutation,
} from "@/src/store/Apis/MessagesApi";
import { useGetUserByIdQuery } from "@/src/store/Apis/UsersApi";
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

    const { data: messages, isLoading } = useGetConversationQuery(userId || "", {
        skip: !userId,
        pollingInterval: 3000, // Poll every 3 seconds for new messages
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
            console.error("Failed to send message:", error);
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
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={100}
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#8e44ad" />
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
                        <Text style={styles.username}>{otherUser?.username}</Text>
                        <Text style={styles.status}>Active</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="ellipsis-vertical" size={20} color="#8e44ad" />
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
            <ChatInput onSendMessage={handleSendMessage} />
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
