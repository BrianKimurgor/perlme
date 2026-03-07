import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Linking,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const supportCategories = [
    {
        icon: "help-circle-outline",
        title: "General Help",
        description: "Questions about using Perlme, navigating features, or getting started.",
        color: "#db2777",
    },
    {
        icon: "shield-checkmark-outline",
        title: "Safety & Privacy",
        description: "Report abuse, harassment, or privacy concerns. Your safety is our priority.",
        color: "#e11d48",
    },
    {
        icon: "chatbubbles-outline",
        title: "Account Issues",
        description: "Problems with login, password reset, email verification, or account settings.",
        color: "#9333ea",
    },
    {
        icon: "mail-outline",
        title: "Feedback & Suggestions",
        description: "Share ideas for new features or improvements to make Perlme better.",
        color: "#c026d3",
    },
];

const faqs = [
    {
        question: "How do I reset my password?",
        answer:
            "Go to the login page and tap \"Forgot Password\". Enter your email address and we'll send you a password reset link.",
    },
    {
        question: "How do I verify my email address?",
        answer:
            "After registering, check your email for a verification code from Perlme. Enter this code in the app to verify your account.",
    },
    {
        question: "How do I delete my account?",
        answer:
            "You can delete your account from Settings in the app. Account deletion permanently removes all your data.",
    },
    {
        question: "How do I report a user or inappropriate content?",
        answer:
            "Tap the three dots (⋯) on any profile, post, or message, then select \"Report\". Choose the reason and submit. Our moderation team reviews all reports.",
    },
    {
        question: "How do I block someone?",
        answer:
            "Visit the user's profile, tap the three dots (⋯) menu, and select \"Block\". They will no longer be able to see your profile or contact you.",
    },
    {
        question: "Is my data secure?",
        answer:
            "Yes. We use industry-standard encryption, secure authentication (JWT with bcrypt hashing), and follow best security practices. Read our Privacy Policy for full details.",
    },
    {
        question: "How do I change my privacy settings?",
        answer:
            "Go to Profile → Settings → Privacy. You can control profile visibility, location sharing, and who can message you.",
    },
    {
        question: "What happens when I delete my account?",
        answer:
            "Account deletion permanently removes all your data including your profile, posts, messages, and connections. There is a 30-day grace period to cancel.",
    },
];

export default function HelpScreen() {
    const router = useRouter();
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const { colors, accent } = useAppTheme();

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Header */}
                <View style={styles.headerRow}>
                    <Pressable onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={24} color={accent} />
                    </Pressable>
                    <Text style={styles.header}>Help & FAQ</Text>
                </View>

                {/* Support Categories */}
                <Text style={[styles.sectionLabel, { color: colors.sectionLabel }]}>How Can We Help?</Text>
                {supportCategories.map((cat, i) => (
                    <View key={i} style={[styles.categoryCard, { backgroundColor: colors.surface }]}>
                        <View style={[styles.iconCircle, { backgroundColor: cat.color + "20" }]}>
                            <Ionicons name={cat.icon as any} size={22} color={cat.color} />
                        </View>
                        <View style={{ flex: 1, marginLeft: 14 }}>
                            <Text style={[styles.categoryTitle, { color: colors.text }]}>{cat.title}</Text>
                            <Text style={[styles.categoryDesc, { color: colors.subtext }]}>{cat.description}</Text>
                        </View>
                    </View>
                ))}

                {/* Contact Info */}
                <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
                    <Pressable
                        style={styles.infoRow}
                        onPress={() => Linking.openURL("mailto:support@perlme.com")}
                    >
                        <Ionicons name="mail-outline" size={20} color="#ff3366" />
                        <Text style={styles.infoText}>support@perlme.com</Text>
                        <Ionicons name="open-outline" size={16} color="#aaa" style={{ marginLeft: 4 }} />
                    </Pressable>
                    <View style={[styles.infoRow, { borderTopWidth: 1, borderTopColor: "#f0f0f0", marginTop: 8, paddingTop: 8 }]}>
                        <Ionicons name="time-outline" size={20} color="#ff3366" />
                        <Text style={styles.infoText}>Response time: 24–48 hours</Text>
                    </View>
                    <View style={[styles.infoRow, { borderTopWidth: 1, borderTopColor: "#f0f0f0", marginTop: 8, paddingTop: 8 }]}>
                        <Ionicons name="shield-outline" size={20} color="#e11d48" />
                        <Text style={styles.infoText}>Urgent safety concerns are prioritized</Text>
                    </View>
                </View>

                {/* FAQ */}
                <Text style={[styles.sectionLabel, { color: colors.sectionLabel }]}>Frequently Asked Questions</Text>
                {faqs.map((faq, i) => (
                    <Pressable
                        key={i}
                        style={[styles.faqItem, { backgroundColor: colors.surface }]}
                        onPress={() => setOpenIndex(openIndex === i ? null : i)}
                    >
                        <View style={styles.faqHeader}>
                            <Text style={[styles.faqQuestion, { color: colors.text }]}>{faq.question}</Text>
                            <Ionicons
                                name={openIndex === i ? "chevron-up" : "chevron-down"}
                                size={18}
                                color="#aaa"
                            />
                        </View>
                        {openIndex === i && (
                            <Text style={[styles.faqAnswer, { color: colors.subtext }]}>{faq.answer}</Text>
                        )}
                    </Pressable>
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
    sectionLabel: {
        fontSize: 13,
        fontWeight: "600",
        color: "#999",
        textTransform: "uppercase",
        marginHorizontal: 20,
        marginBottom: 12,
        marginTop: 20,
    },
    categoryCard: {
        flexDirection: "row",
        alignItems: "flex-start",
        backgroundColor: "#fff",
        marginHorizontal: 20,
        marginBottom: 10,
        borderRadius: 14,
        padding: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
    },
    categoryTitle: { fontSize: 15, fontWeight: "600", color: "#333", marginBottom: 4 },
    categoryDesc: { fontSize: 13, color: "#777", lineHeight: 18 },
    infoCard: {
        backgroundColor: "#fff",
        marginHorizontal: 20,
        borderRadius: 14,
        padding: 16,
        marginTop: 4,
        marginBottom: 4,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    infoRow: { flexDirection: "row", alignItems: "center" },
    infoText: { fontSize: 14, color: "#555", marginLeft: 10, flex: 1 },
    faqItem: {
        backgroundColor: "#fff",
        marginHorizontal: 20,
        marginBottom: 10,
        borderRadius: 14,
        padding: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    faqHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    faqQuestion: { fontSize: 15, fontWeight: "600", color: "#333", flex: 1, marginRight: 8 },
    faqAnswer: { fontSize: 14, color: "#666", lineHeight: 20, marginTop: 10 },
});
