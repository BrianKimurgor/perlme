import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const teamMembers = [
    {
        name: "Gakenye Ndiritu",
        role: "Founder & CEO",
        emoji: "👨‍💼",
        bio: "Passionate about building platforms that foster meaningful human connections.",
    },
    {
        name: "Mwangaza",
        role: "CTO & Lead Developer",
        emoji: "👨‍💻",
        bio: "Full-stack engineer with expertise in real-time applications and scalable systems.",
    },
    {
        name: "Enock",
        role: "Product Lead",
        emoji: "👨‍💼",
        bio: "User-focused product strategist dedicated to creating intuitive, delightful experiences.",
    },
];

const milestones = [
    {
        year: "2023",
        title: "Perlme Founded",
        description: "Started with a vision to revolutionize how people connect online.",
        color: "#db2777",
        icon: "heart-outline",
    },
    {
        year: "2024",
        title: "Mobile App Launch",
        description: "Released iOS and Android apps, reaching 100K+ downloads.",
        color: "#9333ea",
        icon: "flash-outline",
    },
    {
        year: "2024",
        title: "Web Platform Launch",
        description: "Launched web version for seamless cross-device experience.",
        color: "#c026d3",
        icon: "globe-outline",
    },
    {
        year: "2025",
        title: "Expanding Global",
        description: "Growing presence in 50+ countries with localized experiences.",
        color: "#e11d48",
        icon: "trending-up-outline",
    },
];

const values = [
    {
        title: "Authenticity",
        description:
            "We believe in genuine connections between real people. No bots, no fake profiles, just authentic interactions.",
        icon: "heart-outline",
        color: "#db2777",
    },
    {
        title: "Privacy First",
        description:
            "Your data is yours. We use industry-leading encryption and never share personal information without consent.",
        icon: "lock-closed-outline",
        color: "#9333ea",
    },
    {
        title: "Inclusivity",
        description:
            "Everyone deserves to feel welcome. We celebrate diversity and foster an inclusive community for all.",
        icon: "people-outline",
        color: "#c026d3",
    },
    {
        title: "Innovation",
        description:
            "We continuously improve and innovate to provide the best connection experience possible.",
        icon: "flash-outline",
        color: "#e11d48",
    },
];

const stats = [
    { number: "100K+", label: "Active Users" },
    { number: "50+", label: "Countries" },
    { number: "10M+", label: "Messages Daily" },
    { number: "98%", label: "Satisfaction" },
];

export default function AboutScreen() {
    const router = useRouter();
    const { colors, accent } = useAppTheme();

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
            <ScrollView contentContainerStyle={{ paddingBottom: 48 }}>
                {/* Header */}
                <View style={styles.headerRow}>
                    <Pressable onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={24} color={accent} />
                    </Pressable>
                    <Text style={styles.header}>About PerlMe</Text>
                </View>

                {/* Hero */}
                <View style={[styles.heroBox, { backgroundColor: colors.accentTint }]}>
                    <Text style={styles.heroTitle}>
                        About{" "}
                        <Text style={{ color: "#ff3366" }}>Perlme</Text>
                    </Text>
                    <Text style={styles.heroSubtitle}>
                        {"We're on a mission to revolutionize how people connect, one meaningful relationship at a time."}
                    </Text>
                </View>

                {/* Mission & Vision */}
                <Text style={styles.sectionLabel}>Mission & Vision</Text>
                <View style={[styles.card, { backgroundColor: colors.surface }]}>
                    <View style={[styles.iconCircle, { backgroundColor: "#ff3366" }]}>
                        <Ionicons name="heart-outline" size={22} color="#fff" />
                    </View>
                    <Text style={styles.cardTitle}>Our Mission</Text>
                    <Text style={styles.cardContent}>
                        To create a safe, inclusive, and authentic platform where people from all walks of life can connect, build meaningful relationships, and grow together as a global community.
                    </Text>
                    <Text style={[styles.cardContent, { marginTop: 10, opacity: 0.7 }]}>
                        We believe that genuine human connection is fundamental to a fulfilling life, and technology should facilitate, not complicate, that connection.
                    </Text>
                </View>
                <View style={[styles.card, { backgroundColor: colors.surface }]}>
                    <View style={[styles.iconCircle, { backgroundColor: "#9333ea" }]}>
                        <Ionicons name="globe-outline" size={22} color="#fff" />
                    </View>
                    <Text style={styles.cardTitle}>Our Vision</Text>
                    <Text style={styles.cardContent}>
                        {"To become the world's most trusted and beloved connection platform, recognized for putting people first and fostering authentic human relationships at scale."}
                    </Text>
                    <Text style={[styles.cardContent, { marginTop: 10, opacity: 0.7 }]}>
                        {"A world where geographical boundaries don't limit connection, where everyone can find their tribe, and where technology empowers rather than replaces human interaction."}
                    </Text>
                </View>

                {/* Our Story */}
                <Text style={styles.sectionLabel}>Our Story</Text>
                {[
                    {
                        title: "The Beginning",
                        text: "Perlme was born from a simple observation: existing social and dating platforms had become overcomplicated, filled with fake profiles, and often felt unsafe. We believed there had to be a better way—a platform built on authenticity, transparency, and genuine human connection.",
                    },
                    {
                        title: "The Development",
                        text: "We spent over a year researching, prototyping, and iterating based on feedback from thousands of potential users. We built Perlme with cutting-edge technology, privacy-first architecture, and a user experience centered on what actually matters to people.",
                    },
                    {
                        title: "Today & Beyond",
                        text: "Today, Perlme is a rapidly growing community connecting authentically across the globe. Our roadmap includes advanced matching algorithms, more community features, and expansion into new markets—all while maintaining our commitment to safety, privacy, and authenticity.",
                    },
                ].map((s) => (
                    <View key={s.title} style={[styles.card, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.cardTitle, { color: colors.text }]}>{s.title}</Text>
                        <Text style={[styles.cardContent, { color: colors.subtext }]}>{s.text}</Text>
                    </View>
                ))}

                {/* Core Values */}
                <Text style={styles.sectionLabel}>Our Values</Text>
                {values.map((v) => (
                    <View key={v.title} style={[styles.valueRow, { backgroundColor: colors.surface }]}>
                        <View style={[styles.iconCircle, { backgroundColor: v.color }]}>
                            <Ionicons name={v.icon as any} size={20} color="#fff" />
                        </View>
                        <View style={{ flex: 1, marginLeft: 14 }}>
                            <Text style={[styles.valueTitle, { color: colors.text }]}>{v.title}</Text>
                            <Text style={[styles.valueDesc, { color: colors.subtext }]}>{v.description}</Text>
                        </View>
                    </View>
                ))}

                {/* Journey */}
                <Text style={styles.sectionLabel}>Our Journey</Text>
                {milestones.map((m) => (
                    <View key={m.year} style={styles.milestoneRow}>
                        <View style={[styles.milestoneDot, { backgroundColor: m.color }]}>
                            <Ionicons name={m.icon as any} size={16} color="#fff" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={styles.milestoneHeader}>
                                <View style={[styles.yearBadge, { backgroundColor: m.color }]}>
                                    <Text style={styles.yearText}>{m.year}</Text>
                                </View>
                                <Text style={[styles.milestoneTitle, { color: colors.text }]}>{m.title}</Text>
                            </View>
                            <Text style={[styles.milestoneDesc, { color: colors.subtext }]}>{m.description}</Text>
                        </View>
                    </View>
                ))}

                {/* Stats */}
                <Text style={styles.sectionLabel}>By the Numbers</Text>
                <View style={styles.statsGrid}>
                    {stats.map((s) => (
                        <View key={s.label} style={[styles.statBox, { backgroundColor: colors.surface }]}>
                            <Text style={styles.statNumber}>{s.number}</Text>
                            <Text style={styles.statLabel}>{s.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Team */}
                <Text style={styles.sectionLabel}>Meet the Team</Text>
                {teamMembers.map((m) => (
                    <View key={m.name} style={[styles.card, { backgroundColor: colors.surface }]}>
                        <Text style={styles.teamEmoji}>{m.emoji}</Text>
                        <Text style={[styles.teamName, { color: colors.text }]}>{m.name}</Text>
                        <Text style={styles.teamRole}>{m.role}</Text>
                        <Text style={[styles.cardContent, { color: colors.subtext }]}>{m.bio}</Text>
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
        paddingBottom: 8,
    },
    backBtn: { marginRight: 12, padding: 4 },
    header: { fontSize: 24, fontWeight: "700", color: "#ff3366" },
    heroBox: {
        backgroundColor: "#fff0f4",
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 24,
        marginBottom: 8,
        alignItems: "center",
    },
    heroTitle: { fontSize: 28, fontWeight: "800", color: "#333", textAlign: "center" },
    heroSubtitle: {
        fontSize: 14,
        color: "#777",
        lineHeight: 22,
        textAlign: "center",
        marginTop: 10,
    },
    sectionLabel: {
        fontSize: 13,
        fontWeight: "600",
        color: "#999",
        textTransform: "uppercase",
        marginHorizontal: 20,
        marginTop: 24,
        marginBottom: 12,
    },
    card: {
        backgroundColor: "#fff",
        marginHorizontal: 20,
        marginBottom: 12,
        borderRadius: 14,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    iconCircle: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },
    cardTitle: { fontSize: 16, fontWeight: "700", color: "#333", marginBottom: 8 },
    cardContent: { fontSize: 14, color: "#555", lineHeight: 22 },
    valueRow: {
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
    valueTitle: { fontSize: 15, fontWeight: "600", color: "#333", marginBottom: 4 },
    valueDesc: { fontSize: 13, color: "#777", lineHeight: 18 },
    milestoneRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginHorizontal: 20,
        marginBottom: 16,
        gap: 14,
    },
    milestoneDot: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 4,
        flexShrink: 0,
    },
    milestoneHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 4 },
    yearBadge: {
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 20,
    },
    yearText: { color: "#fff", fontSize: 12, fontWeight: "700" },
    milestoneTitle: { fontSize: 15, fontWeight: "600", color: "#333" },
    milestoneDesc: { fontSize: 13, color: "#777", lineHeight: 18 },
    statsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginHorizontal: 20,
        gap: 12,
        marginBottom: 8,
    },
    statBox: {
        flex: 1,
        minWidth: "44%",
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    statNumber: { fontSize: 28, fontWeight: "800", color: "#ff3366" },
    statLabel: { fontSize: 13, color: "#888", marginTop: 4 },
    teamEmoji: { fontSize: 40, textAlign: "center", marginBottom: 8 },
    teamName: { fontSize: 18, fontWeight: "700", color: "#333", textAlign: "center" },
    teamRole: {
        fontSize: 13,
        fontWeight: "600",
        color: "#ff3366",
        textAlign: "center",
        marginBottom: 8,
    },
});
