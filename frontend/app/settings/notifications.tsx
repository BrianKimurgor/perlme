import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const STORAGE_KEY = "@notification_prefs";

interface NotifPrefs {
    messages: boolean;
    likes: boolean;
    comments: boolean;
    follows: boolean;
    matches: boolean;
    reposts: boolean;
    tips: boolean;
    adminMessages: boolean;
    emailDigest: boolean;
    pushEnabled: boolean;
}

const DEFAULT_PREFS: NotifPrefs = {
    messages: true,
    likes: true,
    comments: true,
    follows: true,
    matches: true,
    reposts: false,
    tips: true,
    adminMessages: true,
    emailDigest: false,
    pushEnabled: true,
};

const sections = [
    {
        title: "Push Notifications",
        items: [
            { key: "pushEnabled", label: "Enable Push Notifications", icon: "notifications-outline", color: "#ff3366" },
        ],
    },
    {
        title: "Activity",
        items: [
            { key: "messages", label: "New Messages", icon: "chatbubble-outline", color: "#9333ea" },
            { key: "likes", label: "Likes on Posts", icon: "heart-outline", color: "#e11d48" },
            { key: "comments", label: "Comments", icon: "chatbubbles-outline", color: "#c026d3" },
            { key: "reposts", label: "Reposts", icon: "repeat-outline", color: "#0284c7" },
        ],
    },
    {
        title: "Connections",
        items: [
            { key: "follows", label: "New Followers", icon: "person-add-outline", color: "#16a34a" },
            { key: "matches", label: "New Matches", icon: "sparkles-outline", color: "#ff3366" },
        ],
    },
    {
        title: "Other",
        items: [
            { key: "tips", label: "Tips & Rewards", icon: "gift-outline", color: "#d97706" },
            { key: "adminMessages", label: "Admin Messages", icon: "megaphone-outline", color: "#6366f1" },
            { key: "emailDigest", label: "Weekly Email Digest", icon: "mail-outline", color: "#0891b2" },
        ],
    },
];

export default function NotificationSettingsScreen() {
    const router = useRouter();
    const { colors, accent } = useAppTheme();
    const [prefs, setPrefs] = useState<NotifPrefs>(DEFAULT_PREFS);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEY).then((val) => {
            if (val) setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(val) });
        });
    }, []);

    const toggle = async (key: keyof NotifPrefs) => {
        const updated = { ...prefs, [key]: !prefs[key] };
        setPrefs(updated);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setSaved(true);
        setTimeout(() => setSaved(false), 1800);
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Header */}
                <View style={styles.headerRow}>
                    <Pressable onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={24} color={accent} />
                    </Pressable>
                    <Text style={styles.header}>Notification Settings</Text>
                </View>

                {saved && (
                    <View style={styles.savedBanner}>
                        <Ionicons name="checkmark-circle-outline" size={16} color="#16a34a" />
                        <Text style={styles.savedText}>Preferences saved</Text>
                    </View>
                )}

                {sections.map((section) => (
                    <View key={section.title}>
                        <Text style={[styles.sectionLabel, { color: colors.sectionLabel }]}>{section.title}</Text>
                        <View style={[styles.card, { backgroundColor: colors.surface }]}>
                            {section.items.map((item, i) => {
                                const isDisabled = item.key !== "pushEnabled" && !prefs.pushEnabled;
                                return (
                                    <View
                                        key={item.key}
                                        style={[
                                            styles.row,
                                            i < section.items.length - 1 && [styles.rowBorder, { borderBottomColor: colors.border }],
                                        ]}
                                    >
                                        <View style={[styles.iconCircle, { backgroundColor: item.color + "18" }]}>
                                            <Ionicons name={item.icon as any} size={20} color={item.color} />
                                        </View>
                                        <Text style={[styles.rowLabel, { color: isDisabled ? colors.subtext : colors.text }]}>
                                            {item.label}
                                        </Text>
                                        <Switch
                                            value={Boolean(prefs[item.key as keyof NotifPrefs])}
                                            onValueChange={() => toggle(item.key as keyof NotifPrefs)}
                                            trackColor={{ false: "#e0e0e0", true: "#ffb3c6" }}
                                            thumbColor={prefs[item.key as keyof NotifPrefs] ? "#ff3366" : "#f0f0f0"}
                                            disabled={isDisabled}
                                        />
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                ))}
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
        paddingBottom: 12,
    },
    backBtn: { marginRight: 12, padding: 4 },
    header: { fontSize: 24, fontWeight: "700", color: "#ff3366" },
    savedBanner: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: "#f0fdf4",
        marginHorizontal: 20,
        borderRadius: 10,
        padding: 10,
        marginBottom: 8,
    },
    savedText: { fontSize: 13, color: "#16a34a" },
    sectionLabel: {
        fontSize: 13,
        fontWeight: "600",
        color: "#999",
        textTransform: "uppercase",
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 10,
    },
    card: {
        backgroundColor: "#fff",
        marginHorizontal: 20,
        borderRadius: 14,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        overflow: "hidden",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 16,
        gap: 12,
    },
    rowBorder: { borderBottomWidth: 1, borderBottomColor: "#f5f5f5" },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
    },
    rowLabel: { flex: 1, fontSize: 15, color: "#333", fontWeight: "500" },
});
