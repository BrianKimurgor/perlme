import { useGetConversationListQuery } from "@/src/store/Apis/MessagesApi";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Avatar } from "../Avatar";

interface UserPickerUser {
    id: string;
    username: string;
    avatarUrl: string | null;
}

interface UserPickerSheetProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (user: UserPickerUser) => void;
    title?: string;
}

export const UserPickerSheet: React.FC<UserPickerSheetProps> = ({
    visible,
    onClose,
    onSelect,
    title = "Send to...",
}) => {
    const { data: conversations, isLoading } = useGetConversationListQuery(undefined, {
        skip: !visible,
    });
    const [search, setSearch] = useState("");

    // Build user list from conversations (people user has chatted with)
    const users = useMemo<UserPickerUser[]>(() => {
        if (!conversations) return [];
        return conversations.map((c) => ({
            id: c.otherUser.id,
            username: c.otherUser.username,
            avatarUrl: c.otherUser.avatarUrl,
        }));
    }, [conversations]);

    const filtered = useMemo(() => {
        if (!search.trim()) return users;
        const q = search.toLowerCase();
        return users.filter((u) => u.username.toLowerCase().includes(q));
    }, [users, search]);

    const renderUser = ({ item }: { item: UserPickerUser }) => (
        <TouchableOpacity
            style={styles.userRow}
            onPress={() => onSelect(item)}
            activeOpacity={0.7}
        >
            <Avatar uri={item.avatarUrl} name={item.username} size={42} />
            <Text style={styles.username}>{item.username}</Text>
            <Ionicons name="paper-plane" size={20} color="#ff3366" />
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.handle} />
                    <View style={styles.headerRow}>
                        <Text style={styles.title}>{title}</Text>
                        <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                            <Ionicons name="close" size={24} color="#8e44ad" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Search */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={18} color="#b0b0b0" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search people..."
                        placeholderTextColor="#b0b0b0"
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>

                {/* Users List */}
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#ff3366" />
                        <Text style={styles.loadingText}>Loading contacts...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={filtered}
                        renderItem={renderUser}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Ionicons name="people-outline" size={48} color="#e5c6f5" />
                                <Text style={styles.emptyTitle}>
                                    {search ? "No matches found" : "No conversations yet"}
                                </Text>
                                <Text style={styles.emptySubtext}>
                                    {search
                                        ? "Try a different search"
                                        : "Start chatting to share posts with friends"}
                                </Text>
                            </View>
                        }
                    />
                )}
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
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        margin: 12,
        backgroundColor: "#fdf2f8",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#f9d4e8",
        paddingHorizontal: 12,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: "#1f2937",
        paddingVertical: 10,
    },
    userRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: "#fce4ec",
    },
    username: {
        flex: 1,
        fontSize: 15,
        fontWeight: "600",
        color: "#1f2937",
        marginLeft: 12,
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
    listContent: {
        flexGrow: 1,
    },
    emptyContainer: {
        alignItems: "center",
        paddingVertical: 60,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#8e44ad",
        marginTop: 12,
    },
    emptySubtext: {
        fontSize: 13,
        color: "#b0b0b0",
        marginTop: 6,
        textAlign: "center",
        paddingHorizontal: 40,
    },
});
