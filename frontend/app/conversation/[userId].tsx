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
import {
    type VibeType,
    VIBE_META,
    useCastVibeMutation,
    useGetVibePromptStatusQuery,
} from "@/src/store/Apis/VibesApi";
import { expoLogger as logger } from "@/src/utils/logger";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

export default function ConversationScreen() {
    const { userId } = useLocalSearchParams<{ userId: string }>();
    const router = useRouter();
    const flatListRef = useRef<FlatList>(null);
    const insets = useSafeAreaInsets();
    const currentUserId = useSelector((state: RootState) => state.auth.user?.id);
    const token = useSelector((state: RootState) => state.auth.token);
    const { colors, accent } = useAppTheme();

    // Vibe prompt visibility — local toggle so user can dismiss without re-querying
    const [vibePromptDismissed, setVibePromptDismissed] = useState(false);

    const { data: messages, isLoading, refetch } = useGetConversationQuery(userId || "", {
        skip: !userId,
    });

    const { data: otherUser } = useGetUserByIdQuery(userId || "", {
        skip: !userId,
    });

    const { data: promptStatus, refetch: refetchPromptStatus } = useGetVibePromptStatusQuery(userId || "", {
        skip: !userId,
        refetchOnMountOrArgChange: true,
    });

    const [castVibe] = useCastVibeMutation();
    const [sendMessage] = useSendMessageMutation();
    const [markAsRead] = useMarkConversationAsReadMutation();

    const showVibePrompt = !!promptStatus?.show && !vibePromptDismissed;

    const handleVibeSelect = async (vibeType: VibeType) => {
        if (!userId) return;
        try {
            await castVibe({ targetUserId: userId, vibeType }).unwrap();
            Toast.show({
                type: "success",
                text1: `Vibe saved! ${VIBE_META[vibeType].icon} ${VIBE_META[vibeType].label}`,
            });
        } catch (err) {
            logger.error("Failed to cast vibe", err);
            Toast.show({ type: "error", text1: "Failed to save vibe" });
        } finally {
            setVibePromptDismissed(true);
        }
    };

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

            // Re-check if vibe prompt should now appear (crosses 15-message threshold)
            if (!vibePromptDismissed) {
                refetchPromptStatus();
            }
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
            keyboardVerticalOffset={Platform.OS === "ios" ? insets.top + 60 : 0}
        >
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border, paddingTop: insets.top + 14 }]}>
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

            {/* Vibe Prompt Modal — shown after 15 messages */}
            <Modal
                visible={showVibePrompt}
                transparent
                animationType="slide"
                onRequestClose={() => setVibePromptDismissed(true)}
            >
                <View style={styles.vibeOverlay}>
                    <View style={[styles.vibeCard, { backgroundColor: colors.surface }]}>
                        <TouchableOpacity
                            style={styles.vibeDismiss}
                            onPress={() => setVibePromptDismissed(true)}
                        >
                            <Ionicons name="close" size={20} color={colors.text} />
                        </TouchableOpacity>

                        <Text style={[styles.vibeTitle, { color: colors.text }]}>
                            How&apos;s the chat? 👀
                        </Text>
                        <Text style={[styles.vibeSubtitle, { color: colors.subtext }]}>
                            Pick a Vibe for{" "}
                            <Text style={{ fontWeight: "700" }}>{otherUser?.username}</Text>
                        </Text>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {(
                                [
                                    { label: "Energy", vibes: ["SOCIAL_BUTTERFLY", "SOLO_ADVENTURER", "DEEP_DIVER"] },
                                    { label: "Reliability", vibes: ["INSTANT_MATCH", "SLOW_BURNER", "EVENING_STAR"] },
                                    { label: "Date Style", vibes: ["CAFFEINE_CRITIC", "NIGHT_OWL", "ACTIVITY_JUNKIE"] },
                                    { label: "Humor", vibes: ["WITTY_ONE", "WHOLESOME", "MEME_DEALER"] },
                                ] as { label: string; vibes: VibeType[] }[]
                            ).map((cat) => (
                                <View key={cat.label} style={styles.vibeCategory}>
                                    <Text style={[styles.vibeCatLabel, { color: colors.subtext }]}>
                                        {cat.label}
                                    </Text>
                                    <View style={styles.vibeRow}>
                                        {cat.vibes.map((v) => {
                                            const meta = VIBE_META[v];
                                            return (
                                                <TouchableOpacity
                                                    key={v}
                                                    style={[styles.vibeChip, { borderColor: accent }]}
                                                    onPress={() => handleVibeSelect(v)}
                                                >
                                                    <Text style={styles.vibeChipIcon}>{meta.icon}</Text>
                                                    <Text style={[styles.vibeChipLabel, { color: colors.text }]}>
                                                        {meta.label}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

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
    // ---- Vibe Prompt ----
    vibeOverlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.45)",
    },
    vibeCard: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
        maxHeight: "80%",
    },
    vibeDismiss: {
        position: "absolute",
        top: 16,
        right: 16,
        zIndex: 10,
    },
    vibeTitle: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 4,
    },
    vibeSubtitle: {
        fontSize: 14,
        marginBottom: 20,
    },
    vibeCategory: {
        marginBottom: 16,
    },
    vibeCatLabel: {
        fontSize: 11,
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 8,
    },
    vibeRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    vibeChip: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1.5,
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 8,
        gap: 6,
    },
    vibeChipIcon: {
        fontSize: 18,
    },
    vibeChipLabel: {
        fontSize: 13,
        fontWeight: "600",
    },
});
