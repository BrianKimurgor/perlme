import { CommentsSheet, PostCard, ShareSheet } from "@/components/ui";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { RootState } from "@/src/store";
import { Post, useGetAllPostsQuery } from "@/src/store/Apis/PostsApi";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
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

const SAVED_KEY = "@saved_posts";

export default function SavedPostsScreen() {
    const router = useRouter();
    const currentUserId = useSelector((state: RootState) => state.auth.user?.id);
    const { colors, accent } = useAppTheme();
    const { data: allPosts, isLoading } = useGetAllPostsQuery();

    const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
    const [commentsPostId, setCommentsPostId] = useState<string | null>(null);
    const [sharePost, setSharePost] = useState<Post | null>(null);

    useEffect(() => {
        AsyncStorage.getItem(SAVED_KEY).then((val) => {
            if (val) setSavedIds(new Set(JSON.parse(val)));
        });
    }, []);

    const handleSave = useCallback(async (postId: string) => {
        setSavedIds((prev) => {
            const next = new Set(prev);
            if (next.has(postId)) {
                next.delete(postId);
            } else {
                next.add(postId);
            }
            AsyncStorage.setItem(SAVED_KEY, JSON.stringify([...next]));
            return next;
        });
    }, []);

    const checkIfLiked = (post: Post): boolean => {
        if (!currentUserId) return false;
        if ((post as any).isLikedByCurrentUser !== undefined)
            return (post as any).isLikedByCurrentUser;
        if (post.likes) return post.likes.some((l) => l.userId === currentUserId);
        return false;
    };

    const savedPosts = (allPosts ?? []).filter((p) => savedIds.has(p.id));

    let content: React.ReactNode;
    if (isLoading) {
        content = (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#ff3366" />
            </View>
        );
    } else if (savedPosts.length === 0) {
        content = (
            <View style={styles.centered}>
                <Ionicons name="bookmark-outline" size={64} color="#ff3366" />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>No Saved Posts</Text>
                <Text style={[styles.emptySubtitle, { color: colors.subtext }]}>
                    Tap the bookmark icon on any post to save it here.
                </Text>
                <Pressable style={styles.browseBtn} onPress={() => router.replace("/(tabs)")}>
                    <Text style={styles.browseBtnText}>Browse Feed</Text>
                </Pressable>
            </View>
        );
    } else {
        content = (
            <FlatList
                data={savedPosts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <PostCard
                        post={item}
                        isLiked={checkIfLiked(item)}
                        isSaved={savedIds.has(item.id)}
                        onLike={() => { }}
                        onComment={() => setCommentsPostId(item.id)}
                        onShare={() => setSharePost(item)}
                        onSave={() => handleSave(item.id)}
                        onUserPress={() => router.push(`/user/${item.authorId}`)}
                    />
                )}
                contentContainerStyle={{ paddingBottom: 40 }}
            />
        );
    }

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.surface2 }]}>
            <View style={[styles.headerRow, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color={accent} />
                </Pressable>
                <Text style={styles.header}>Saved Posts</Text>
                {savedPosts.length > 0 && (
                    <Text style={[styles.count, { backgroundColor: accent }]}>{savedPosts.length}</Text>
                )}
            </View>
            {content}
            {!!commentsPostId && (
                <CommentsSheet
                    postId={commentsPostId}
                    visible={!!commentsPostId}
                    onClose={() => setCommentsPostId(null)}
                    onUserPress={(userId) => {
                        setCommentsPostId(null);
                        router.push(`/user/${userId}`);
                    }}
                />
            )}
            {!!sharePost && (
                <ShareSheet
                    post={sharePost}
                    visible={!!sharePost}
                    onClose={() => setSharePost(null)}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#f9fafb" },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 12,
        backgroundColor: "#fff",
        borderBottomWidth: 0.5,
        borderBottomColor: "#e5e7eb",
    },
    backBtn: { marginRight: 12, padding: 4 },
    header: { fontSize: 22, fontWeight: "700", color: "#ff3366", flex: 1 },
    count: {
        backgroundColor: "#ff3366",
        color: "#fff",
        fontSize: 13,
        fontWeight: "700",
        paddingHorizontal: 9,
        paddingVertical: 3,
        borderRadius: 12,
        overflow: "hidden",
    },
    centered: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 40,
        gap: 12,
    },
    emptyTitle: { fontSize: 20, fontWeight: "700", color: "#333", textAlign: "center" },
    emptySubtitle: {
        fontSize: 14,
        color: "#888",
        textAlign: "center",
        lineHeight: 20,
    },
    browseBtn: {
        marginTop: 8,
        backgroundColor: "#ff3366",
        paddingHorizontal: 28,
        paddingVertical: 12,
        borderRadius: 12,
    },
    browseBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
