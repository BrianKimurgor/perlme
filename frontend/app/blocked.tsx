import { useAppTheme } from "@/src/hooks/useAppTheme";
import {
    BlockedUser,
    useGetBlockedUsersQuery,
    useUnblockUserMutation,
} from "@/src/store/Apis/BlocksApi";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Separator = () => {
    const { colors } = useAppTheme();
    return <View style={[styles.separator, { backgroundColor: colors.border }]} />;
};

function BlockedUserRow({
    item,
    onUnblock,
    unblocking,
}: Readonly<{
    item: BlockedUser;
    onUnblock: (id: string) => void;
    unblocking: boolean;
}>) {
    const { colors, accent } = useAppTheme();
    const user = item.blocked;
    const displayName = user?.username ?? "Unknown User";
    const avatarUri = user?.avatarUrl ?? null;
    const avatarInitial = displayName.charAt(0).toUpperCase();

    return (
        <View style={[styles.row, { backgroundColor: colors.surface }]}>
            {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatar} />
            ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                    <Text style={styles.avatarInitial}>{avatarInitial}</Text>
                </View>
            )}
            <View style={styles.rowInfo}>
                <Text style={[styles.username, { color: colors.text }]}>@{displayName}</Text>
                <Text style={[styles.blockedDate, { color: colors.subtext }]}>
                    Blocked {new Date(item.createdAt).toLocaleDateString()}
                </Text>
            </View>
            <Pressable
                style={[styles.unblockBtn, unblocking && styles.unblockBtnDisabled]}
                onPress={() => onUnblock(user?.id ?? item.blockedId)}
                disabled={unblocking}
            >
                {unblocking ? (
                    <ActivityIndicator size="small" color="#ff3366" />
                ) : (
                    <Text style={[styles.unblockBtnText, { color: accent }]}>Unblock</Text>
                )}
            </Pressable>
        </View>
    );
}

export default function BlockedScreen() {
    const router = useRouter();
    const { data: blockedUsers, isLoading, isError, refetch } = useGetBlockedUsersQuery();
    const [unblockUser] = useUnblockUserMutation();
    const [unblockingIds, setUnblockingIds] = useState<Set<string>>(new Set());
    const { colors, accent } = useAppTheme();

    const removeUnblocking = (id: string) =>
        setUnblockingIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });

    const doUnblock = (targetUserId: string) => {
        setUnblockingIds((prev) => new Set(prev).add(targetUserId));
        unblockUser({ targetUserId })
            .unwrap()
            .catch(() => Alert.alert("Error", "Failed to unblock user. Please try again."))
            .finally(() => removeUnblocking(targetUserId));
    };

    const handleUnblock = (targetUserId: string) => {
        Alert.alert("Unblock User", "Are you sure you want to unblock this user?", [
            { text: "Cancel", style: "cancel" },
            { text: "Unblock", style: "destructive", onPress: () => doUnblock(targetUserId) },
        ]);
    };

    let content: React.ReactNode;
    if (isLoading) {
        content = (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#ff3366" />
            </View>
        );
    } else if (isError) {
        content = (
            <View style={styles.centered}>
                <Ionicons name="alert-circle-outline" size={48} color="#f87171" />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>Something went wrong</Text>
                <Pressable style={styles.retryBtn} onPress={refetch}>
                    <Text style={styles.retryText}>Try Again</Text>
                </Pressable>
            </View>
        );
    } else if (!blockedUsers || blockedUsers.length === 0) {
        content = (
            <View style={styles.centered}>
                <Ionicons name="shield-checkmark-outline" size={64} color="#ff3366" />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>No Blocked Users</Text>
                <Text style={styles.emptySubtitle}>
                    Users you block will appear here. You can unblock them at any time.
                </Text>
            </View>
        );
    } else {
        content = (
            <>
                <Text style={styles.countLabel}>
                    {blockedUsers.length} blocked {blockedUsers.length === 1 ? "user" : "users"}
                </Text>
                <FlatList
                    data={blockedUsers}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <BlockedUserRow
                            item={item}
                            onUnblock={handleUnblock}
                            unblocking={unblockingIds.has(item.blocked?.id ?? item.blockedId)}
                        />
                    )}
                    contentContainerStyle={{ paddingBottom: 40 }}
                    ItemSeparatorComponent={Separator}
                />
            </>
        );
    }

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
            {/* Header */}
            <View style={styles.headerRow}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color={accent} />
                </Pressable>
                <Text style={styles.header}>Blocked Users</Text>
            </View>
            {content}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#fefefe" },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 12,
    },
    backBtn: { marginRight: 12, padding: 4 },
    header: { fontSize: 24, fontWeight: "700", color: "#ff3366" },
    centered: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 40,
        gap: 12,
    },
    emptyTitle: { fontSize: 18, fontWeight: "700", color: "#333", textAlign: "center" },
    emptySubtitle: {
        fontSize: 14,
        color: "#888",
        textAlign: "center",
        lineHeight: 20,
    },
    retryBtn: {
        marginTop: 8,
        paddingHorizontal: 24,
        paddingVertical: 10,
        backgroundColor: "#ff3366",
        borderRadius: 10,
    },
    retryText: { color: "#fff", fontWeight: "600" },
    countLabel: {
        fontSize: 13,
        color: "#999",
        marginHorizontal: 20,
        marginBottom: 8,
        fontWeight: "500",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 14,
        backgroundColor: "#fff",
    },
    avatar: { width: 48, height: 48, borderRadius: 24 },
    avatarPlaceholder: {
        backgroundColor: "#ffd6e2",
        alignItems: "center",
        justifyContent: "center",
    },
    avatarInitial: { fontSize: 20, fontWeight: "700", color: "#ff3366" },
    rowInfo: { flex: 1, marginHorizontal: 14 },
    username: { fontSize: 15, fontWeight: "600", color: "#222" },
    blockedDate: { fontSize: 12, color: "#aaa", marginTop: 2 },
    unblockBtn: {
        borderWidth: 1.5,
        borderColor: "#ff3366",
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 7,
        minWidth: 76,
        alignItems: "center",
    },
    unblockBtnDisabled: { opacity: 0.5 },
    unblockBtnText: { color: "#ff3366", fontWeight: "600", fontSize: 13 },
    separator: { height: 1, backgroundColor: "#f0f0f0", marginLeft: 82 },
});
