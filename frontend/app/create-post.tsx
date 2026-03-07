import { Button } from "@/components/ui";
import {
    useCreatePostMutation,
    useUploadMediaMutation,
} from "@/src/store/Apis/PostsApi";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Toast from "react-native-toast-message";
import { expoLogger as logger } from "@/src/utils/logger";

type LocalMedia = {
    uri: string;
    type: "image" | "video";
    fileName: string;
    mimeType: string;
};

export default function CreatePostScreen() {
    const router = useRouter();
    const [content, setContent] = useState("");
    const [localMedia, setLocalMedia] = useState<LocalMedia[]>([]);
    const [createPost, { isLoading: isCreating }] = useCreatePostMutation();
    const [uploadMedia, { isLoading: isUploading }] = useUploadMediaMutation();

    const isLoading = isCreating || isUploading;

    // ─── Request permissions ───────────────────────────────────────
    const requestPermission = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Toast.show({
                type: "error",
                text1: "Permission required",
                text2: "Please allow access to your media library",
            });
            return false;
        }
        return true;
    };

    // ─── Pick images ───────────────────────────────────────────────
    const pickImages = async () => {
        const granted = await requestPermission();
        if (!granted) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsMultipleSelection: true,
            quality: 0.8,
            selectionLimit: 5 - localMedia.length,
        });

        if (!result.canceled && result.assets.length > 0) {
            const newMedia: LocalMedia[] = result.assets.map((asset) => ({
                uri: asset.uri,
                type: "image" as const,
                fileName: asset.fileName || `photo_${Date.now()}.jpg`,
                mimeType: asset.mimeType || "image/jpeg",
            }));
            setLocalMedia((prev) => [...prev, ...newMedia].slice(0, 5));
        }
    };

    // ─── Pick videos ───────────────────────────────────────────────
    const pickVideo = async () => {
        const granted = await requestPermission();
        if (!granted) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["videos"],
            allowsMultipleSelection: false,
            quality: 0.8,
            videoMaxDuration: 60,
        });

        if (!result.canceled && result.assets.length > 0) {
            const asset = result.assets[0];
            const newMedia: LocalMedia = {
                uri: asset.uri,
                type: "video",
                fileName: asset.fileName || `video_${Date.now()}.mp4`,
                mimeType: asset.mimeType || "video/mp4",
            };
            setLocalMedia((prev) => [...prev, newMedia].slice(0, 5));
        }
    };

    // ─── Remove media ──────────────────────────────────────────────
    const removeMedia = (index: number) => {
        setLocalMedia((prev) => prev.filter((_, i) => i !== index));
    };

    // ─── Upload files and create post ──────────────────────────────
    const handleCreatePost = async () => {
        if (!content.trim()) {
            Toast.show({
                type: "error",
                text1: "Content required",
                text2: "Please write something to post",
            });
            return;
        }

        try {
            let mediaPayload: { url: string; type: string }[] | undefined;

            // Upload media files if any
            if (localMedia.length > 0) {
                const formData = new FormData();

                for (const item of localMedia) {
                    const fileObj = {
                        uri: Platform.OS === "android" ? item.uri : item.uri.replace("file://", ""),
                        name: item.fileName,
                        type: item.mimeType,
                    } as any;
                    formData.append("files", fileObj);
                }

                const uploadResult = await uploadMedia(formData).unwrap();

                mediaPayload = uploadResult.map((file) => ({
                    url: file.url,
                    type: file.type,
                }));
            }

            await createPost({
                content: content.trim(),
                media: mediaPayload,
            }).unwrap();

            Toast.show({
                type: "success",
                text1: "Post created",
                text2: "Your post has been published",
            });
            router.back();
        } catch (error: any) {
            logger.error("Post creation error:", error);
            Toast.show({
                type: "error",
                text1: "Failed to create post",
                text2: error?.data?.message || "Please try again",
            });
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="close" size={28} color="#8e44ad" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create Post</Text>
                <Button
                    title={isUploading ? "Uploading..." : "Post"}
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
                    placeholderTextColor="#b0b0b0"
                    multiline
                    value={content}
                    onChangeText={setContent}
                    maxLength={5000}
                    autoFocus
                />

                {/* Media Preview */}
                {localMedia.length > 0 && (
                    <View style={styles.mediaContainer}>
                        {localMedia.map((item, index) => (
                            <View key={`${item.uri}-${index}`} style={styles.mediaItem}>
                                <Image source={{ uri: item.uri }} style={styles.mediaImage} />
                                {item.type === "video" && (
                                    <View style={styles.videoBadge}>
                                        <Ionicons name="videocam" size={16} color="#fff" />
                                        <Text style={styles.videoBadgeText}>Video</Text>
                                    </View>
                                )}
                                <TouchableOpacity
                                    style={styles.removeMedia}
                                    onPress={() => removeMedia(index)}
                                >
                                    <Ionicons name="close-circle" size={28} color="#ef4444" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}

                {/* Upload Progress */}
                {isUploading && (
                    <View style={styles.uploadingContainer}>
                        <ActivityIndicator size="small" color="#ff3366" />
                        <Text style={styles.uploadingText}>Uploading media...</Text>
                    </View>
                )}

                {/* Character Count */}
                <Text style={styles.charCount}>{content.length} / 5000</Text>
            </ScrollView>

            {/* Bottom Actions */}
            <View style={styles.actions}>
                <TouchableOpacity
                    style={[styles.actionButton, localMedia.length >= 5 && styles.actionDisabled]}
                    onPress={pickImages}
                    disabled={localMedia.length >= 5 || isLoading}
                >
                    <Ionicons
                        name="image-outline"
                        size={28}
                        color={localMedia.length >= 5 ? "#d1d5db" : "#ff3366"}
                    />
                    <Text
                        style={[
                            styles.actionText,
                            localMedia.length >= 5 && styles.actionTextDisabled,
                        ]}
                    >
                        Photo
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, localMedia.length >= 5 && styles.actionDisabled]}
                    onPress={pickVideo}
                    disabled={localMedia.length >= 5 || isLoading}
                >
                    <Ionicons
                        name="videocam-outline"
                        size={28}
                        color={localMedia.length >= 5 ? "#d1d5db" : "#ff3366"}
                    />
                    <Text
                        style={[
                            styles.actionText,
                            localMedia.length >= 5 && styles.actionTextDisabled,
                        ]}
                    >
                        Video
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="location-outline" size={28} color="#ff3366" />
                    <Text style={styles.actionText}>Location</Text>
                </TouchableOpacity>

                {localMedia.length > 0 && (
                    <Text style={styles.mediaCount}>{localMedia.length}/5</Text>
                )}
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
        borderBottomWidth: 1,
        borderBottomColor: "#fce4ec",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#8e44ad",
    },
    content: {
        flex: 1,
        padding: 16,
    },
    textInput: {
        fontSize: 16,
        color: "#1f2937",
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
        borderRadius: 16,
        backgroundColor: "#f3f4f6",
    },
    videoBadge: {
        position: "absolute",
        bottom: 12,
        left: 12,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.6)",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    videoBadgeText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
        marginLeft: 4,
    },
    removeMedia: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "#fff",
        borderRadius: 14,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    uploadingContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
    },
    uploadingText: {
        marginLeft: 8,
        color: "#ff3366",
        fontSize: 14,
        fontWeight: "500",
    },
    charCount: {
        textAlign: "right",
        fontSize: 12,
        color: "#b0b0b0",
        marginTop: 8,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        borderTopColor: "#fce4ec",
    },
    actionButton: {
        alignItems: "center",
    },
    actionDisabled: {
        opacity: 0.4,
    },
    actionText: {
        fontSize: 12,
        color: "#6b7280",
        marginTop: 4,
    },
    actionTextDisabled: {
        color: "#d1d5db",
    },
    mediaCount: {
        fontSize: 14,
        fontWeight: "700",
        color: "#ff3366",
    },
});

