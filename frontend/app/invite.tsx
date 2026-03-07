import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Pressable,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const INVITE_LINK = "https://perlme.com/join";

const shareChannels = [
    { label: "Share Link", icon: "share-social-outline", color: "#ff3366" },
    { label: "Copy Link", icon: "copy-outline", color: "#9333ea" },
    { label: "WhatsApp", icon: "logo-whatsapp", color: "#25d366" },
    { label: "Instagram", icon: "logo-instagram", color: "#e11d48" },
];

export default function InviteScreen() {
    const router = useRouter();
    const [copied, setCopied] = useState(false);
    const { colors, accent } = useAppTheme();

    const inviteMessage = `Hey! Join me on Perlme — a new way to connect authentically. Download the app and use my link to get started:\n\n${INVITE_LINK}`;

    const handleShare = async () => {
        try {
            await Share.share({ message: inviteMessage, url: INVITE_LINK });
        } catch {
            // ignore
        }
    };

    const handleCopy = () => {
        // Show copied state briefly — use Share as clipboard fallback
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        handleShare();
    };

    const handleAction = (label: string) => {
        if (label === "Share Link") return handleShare();
        if (label === "Copy Link") return handleCopy();
        // For social channels open Share sheet with pre-filled message
        handleShare();
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Header */}
                <View style={styles.headerRow}>
                    <Pressable onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={24} color={accent} />
                    </Pressable>
                    <Text style={styles.header}>Invite Friends</Text>
                </View>

                {/* Hero */}
                <View style={[styles.heroBox, { backgroundColor: colors.accentTint }]}>
                    <Text style={styles.heroEmoji}>🎉</Text>
                    <Text style={styles.heroTitle}>Share Perlme</Text>
                    <Text style={styles.heroSubtitle}>
                        Invite your friends to join Perlme and start connecting authentically.
                    </Text>
                </View>

                {/* Invite Link */}
                <Text style={styles.sectionLabel}>Your Invite Link</Text>
                <View style={[styles.linkBox, { backgroundColor: colors.surface }]}>
                    <TextInput
                        style={[styles.linkInput, { color: colors.text }]}
                        value={INVITE_LINK}
                        editable={false}
                        selectTextOnFocus
                    />
                    <Pressable style={styles.copyBtn} onPress={handleCopy}>
                        <Ionicons
                            name={copied ? "checkmark-outline" : "copy-outline"}
                            size={20}
                            color="#fff"
                        />
                        <Text style={styles.copyBtnText}>{copied ? "Copied!" : "Copy"}</Text>
                    </Pressable>
                </View>

                {/* Share Channels */}
                <Text style={styles.sectionLabel}>Share Via</Text>
                <View style={styles.channelsGrid}>
                    {shareChannels.map((ch) => (
                        <Pressable
                            key={ch.label}
                            style={styles.channelBtn}
                            onPress={() => handleAction(ch.label)}
                        >
                            <View style={[styles.channelIcon, { backgroundColor: ch.color + "18" }]}>
                                <Ionicons name={ch.icon as any} size={26} color={ch.color} />
                            </View>
                            <Text style={styles.channelLabel}>{ch.label}</Text>
                        </Pressable>
                    ))}
                </View>

                {/* Invite message preview */}
                <Text style={styles.sectionLabel}>Message Preview</Text>
                <View style={[styles.messagePreview, { backgroundColor: colors.input, borderLeftColor: accent }]}>
                    <Text style={[styles.messageText, { color: colors.text }]}>{inviteMessage}</Text>
                </View>

                {/* Main CTA */}
                <Pressable style={styles.shareBtn} onPress={handleShare}>
                    <Ionicons name="share-social-outline" size={20} color="#fff" />
                    <Text style={styles.shareBtnText}>Invite Friends</Text>
                </Pressable>
            </ScrollView>
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
        paddingBottom: 8,
    },
    backBtn: { marginRight: 12, padding: 4 },
    header: { fontSize: 24, fontWeight: "700", color: "#ff3366" },
    heroBox: {
        alignItems: "center",
        backgroundColor: "#fff0f4",
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 28,
        marginBottom: 8,
    },
    heroEmoji: { fontSize: 48, marginBottom: 12 },
    heroTitle: { fontSize: 22, fontWeight: "800", color: "#333" },
    heroSubtitle: {
        fontSize: 14,
        color: "#777",
        textAlign: "center",
        lineHeight: 20,
        marginTop: 6,
    },
    sectionLabel: {
        fontSize: 13,
        fontWeight: "600",
        color: "#999",
        textTransform: "uppercase",
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 10,
    },
    linkBox: {
        flexDirection: "row",
        marginHorizontal: 20,
        backgroundColor: "#fff",
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
        overflow: "hidden",
    },
    linkInput: {
        flex: 1,
        paddingHorizontal: 14,
        paddingVertical: 13,
        fontSize: 14,
        color: "#555",
    },
    copyBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ff3366",
        paddingHorizontal: 16,
        gap: 6,
    },
    copyBtnText: { color: "#fff", fontWeight: "600", fontSize: 14 },
    channelsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginHorizontal: 20,
        gap: 12,
    },
    channelBtn: {
        width: "22%",
        alignItems: "center",
        gap: 6,
    },
    channelIcon: {
        width: 54,
        height: 54,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    channelLabel: { fontSize: 11, color: "#555", textAlign: "center" },
    messagePreview: {
        marginHorizontal: 20,
        backgroundColor: "#f8f8f8",
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 3,
        borderLeftColor: "#ff3366",
    },
    messageText: { fontSize: 14, color: "#555", lineHeight: 22 },
    shareBtn: {
        flexDirection: "row",
        backgroundColor: "#ff3366",
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },
    shareBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
