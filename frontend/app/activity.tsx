import { useAppTheme } from "@/src/hooks/useAppTheme";
import { RootState } from "@/src/store";
import { Post, useGetAllPostsQuery } from "@/src/store/Apis/PostsApi";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

type ActivityItem = {
    id: string;
    type: "post" | "like" | "comment" | "repost";
    icon: string;
    iconColor: string;
    title: string;
    subtitle: string;
    timestamp: string;
};

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const s = Math.floor(diff / 1000);
    if (s < 60) return `${s}s ago`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    if (d < 7) return `${d}d ago`;
    return new Date(dateStr).toLocaleDateString();
}

const Separator = () => {
    const { colors } = useAppTheme();
    return <View style={[styles.separator, { backgroundColor: colors.border }]} />;
};

function ActivityRow({ item }: Readonly<{ item: ActivityItem }>) {
    const { colors } = useAppTheme();
    return (
        <View style={[styles.row, { backgroundColor: colors.surface }]}>
            <View style={[styles.iconBox, { backgroundColor: item.iconColor + "18" }]}>
                <Ionicons name={item.icon as any} size={22} color={item.iconColor} />
            </View>
            <View style={styles.rowContent}>
                <Text style={[styles.rowTitle, { color: colors.text }]}>{item.title}</Text>
                {item.subtitle ? (
                    <Text style={[styles.rowSubtitle, { color: colors.subtext }]} numberOfLines={2}>
                        {item.subtitle}
                    </Text>
                ) : null}
            </View>
            <Text style={styles.rowTime}>{item.timestamp}</Text>
        </View>
    );
}

export default function ActivityScreen() {
    const router = useRouter();
    const currentUser = useSelector((state: RootState) => state.auth.user);
    const { data: allPosts, isLoading, isError, refetch } = useGetAllPostsQuery();
    const { colors, accent } = useAppTheme();

    const activities = useMemo<ActivityItem[]>(() => {
        if (!allPosts || !currentUser) return [];

        const myPosts = allPosts.filter((p: Post) => p.authorId === currentUser.id);

        const items: ActivityItem[] = myPosts.map((post: Post) => ({
            id: `post-${post.id}`,
            type: "post",
            icon: "document-text-outline",
            iconColor: "#ff3366",
            title: "You posted",
            subtitle: post.content ?? "",
            timestamp: timeAgo(post.createdAt),
        }));

        // Sort newest first
        items.sort(
            (a, b) =>
                new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        return items;
    }, [allPosts, currentUser]);

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
    } else if (activities.length === 0) {
        content = (
            <View style={styles.centered}>
                <Ionicons name="pulse-outline" size={64} color="#ff3366" />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>No Activity Yet</Text>
                <Text style={[styles.emptySubtitle, { color: colors.subtext }]}>
                    Your posts and interactions will appear here once you start engaging.
                </Text>
            </View>
        );
    } else {
        content = (
            <>
                <Text style={[styles.countLabel, { color: colors.sectionLabel }]}>
                    {activities.length} {activities.length === 1 ? "activity" : "activities"}
                </Text>
                <FlatList
                    data={activities}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <ActivityRow item={item} />}
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
                <Text style={styles.header}>My Activity</Text>
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
        alignItems: "flex-start",
        paddingHorizontal: 20,
        paddingVertical: 14,
        backgroundColor: "#fff",
        gap: 14,
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    },
    rowContent: { flex: 1 },
    rowTitle: { fontSize: 14, fontWeight: "600", color: "#222" },
    rowSubtitle: { fontSize: 13, color: "#777", marginTop: 2, lineHeight: 18 },
    rowTime: { fontSize: 11, color: "#bbb", flexShrink: 0, paddingTop: 2 },
    separator: { height: 1, backgroundColor: "#f0f0f0", marginLeft: 78 },
});
