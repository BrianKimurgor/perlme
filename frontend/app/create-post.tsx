import { Button } from "@/components/ui";
import { useCreatePostMutation } from "@/src/store/Apis/PostsApi";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function CreatePostScreen() {
    const router = useRouter();
    const [content, setContent] = useState("");
    const [mediaUrls, setMediaUrls] = useState<string[]>([]);
    const [createPost, { isLoading }] = useCreatePostMutation();

    const handleCreatePost = async () => {
        if (!content.trim()) {
            Toast.show({
                type: "error",
                text1: "Content required",
                text2: "Please write something to post"
            });
            return;
        }

        try {
            await createPost({
                content: content.trim(),
                mediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
            }).unwrap();

            Toast.show({
                type: "success",
                text1: "Post created",
                text2: "Your post has been published"
            });
            router.back();
        } catch (error: any) {
            Toast.show({
                type: "error",
                text1: "Failed to create post",
                text2: error?.data?.message || "Please try again"
            });
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="close" size={28} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create Post</Text>
                <Button
                    title="Post"
                    onPress={handleCreatePost}
                    loading={isLoading}
                    disabled={!content.trim() || isLoading}
                    size="small"
                />
            </View>

            <ScrollView style={styles.content}>
                {/* Text Input */}
                <TextInput
                    style={styles.textInput}
                    placeholder="What's on your mind?"
                    placeholderTextColor="#9ca3af"
                    multiline
                    value={content}
                    onChangeText={setContent}
                    maxLength={5000}
                    autoFocus
                />

                {/* Media Preview */}
                {mediaUrls.length > 0 && (
                    <View style={styles.mediaContainer}>
                        {mediaUrls.map((url) => (
                            <View key={url} style={styles.mediaItem}>
                                <Image source={{ uri: url }} style={styles.mediaImage} />
                                <TouchableOpacity
                                    style={styles.removeMedia}
                                    onPress={() =>
                                        setMediaUrls(mediaUrls.filter((_, i) => i !== index))
                                    }
                                >
                                    <Ionicons name="close-circle" size={28} color="#ef4444" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}

                {/* Character Count */}
                <Text style={styles.charCount}>{content.length} / 5000</Text>
            </ScrollView>

            {/* Bottom Actions */}
            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="image-outline" size={28} color="#ff3366" />
                    <Text style={styles.actionText}>Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="videocam-outline" size={28} color="#ff3366" />
                    <Text style={styles.actionText}>Video</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="location-outline" size={28} color="#ff3366" />
                    <Text style={styles.actionText}>Location</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: "#e5e7eb",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#111827",
    },
    content: {
        flex: 1,
        padding: 16,
    },
    textInput: {
        fontSize: 16,
        color: "#111827",
        minHeight: 200,
        textAlignVertical: "top",
    },
    mediaContainer: {
        marginTop: 20,
    },
    mediaItem: {
        position: "relative",
        marginBottom: 12,
    },
    mediaImage: {
        width: "100%",
        height: 250,
        borderRadius: 12,
    },
    removeMedia: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "#fff",
        borderRadius: 14,
    },
    charCount: {
        textAlign: "right",
        fontSize: 12,
        color: "#9ca3af",
        marginTop: 8,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderTopWidth: 0.5,
        borderTopColor: "#e5e7eb",
    },
    actionButton: {
        alignItems: "center",
    },
    actionText: {
        fontSize: 12,
        color: "#6b7280",
        marginTop: 4,
    },
});
