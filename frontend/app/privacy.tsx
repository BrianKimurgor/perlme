import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    Linking,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const sections = [
    {
        title: "1. Introduction",
        content:
            'Perlme ("we", "us", "our", or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application and services.',
    },
    {
        title: "2. Information We Collect",
        content:
            "We may collect information about you in a variety of ways:\n\n• Personal Data: Personally identifiable information, such as your name, email address, and telephone number, that you voluntarily give to us when you register.\n\n• Financial Data: Financial information, such as data related to your payment method, that we may collect when you purchase products or services.\n\n• Data From Social Networks: User information from social media platforms, including your name and any publicly available information.\n\n• Mobile Device Data: Device information, such as your mobile device ID, model, and manufacturer, and information about the location of your device.",
    },
    {
        title: "3. Use of Your Information",
        content:
            "Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected to:\n\n• Email you regarding your account or order.\n\n• Fulfill and manage purchases, orders, payments, and other transactions.\n\n• Generate a personal profile about you in order to improve the content of the App for you.\n\n• Monitor and analyze usage and trends to improve your experience.\n\n• Notify you of updates to the App.\n\n• Offer new products, services, and/or recommendations to you.",
    },
    {
        title: "4. Disclosure of Your Information",
        content:
            "We may share information we have collected about you in certain situations:\n\n• By Law or to Protect Rights: If we believe the release of information about you is necessary to comply with the law, enforce our App policies, or protect ours or others' rights, property, or safety.\n\n• Third-Party Service Providers: We may share your information with third parties that perform services for us, including payment processing, data analysis, email delivery, and hosting.\n\n• Business Transfers: If Perlme is involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.",
    },
    {
        title: "5. Security of Your Information",
        content:
            "We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.",
    },
    {
        title: "6. Contact Us",
        content:
            "If you have questions or comments about this Privacy Policy, please contact us at:\n\nPerlme\nEmail: privacy@perlme.com\nWebsite: www.perlme.com",
    },
];

export default function PrivacyScreen() {
    const router = useRouter();
    const { colors, accent } = useAppTheme();

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Header */}
                <View style={styles.headerRow}>
                    <Pressable onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={24} color={accent} />
                    </Pressable>
                    <View>
                        <Text style={styles.header}>Privacy Policy</Text>
                        <Text style={styles.subheader}>Last updated: January 19, 2026</Text>
                    </View>
                </View>

                {sections.map((section, i) => (
                    <View key={i} style={[styles.card, { backgroundColor: colors.surface }]}>
                        <Text style={styles.cardTitle}>{section.title}</Text>
                        <Text style={[styles.cardContent, { color: colors.text }]}>{section.content}</Text>
                    </View>
                ))}

                {/* CTA */}
                <View style={[styles.ctaBox, { backgroundColor: colors.accentTint }]}>
                    <Text style={[styles.ctaText, { color: colors.text }]}>Have questions about our privacy practices?</Text>
                    <Pressable
                        style={styles.ctaBtn}
                        onPress={() => Linking.openURL("mailto:privacy@perlme.com")}
                    >
                        <Text style={styles.ctaBtnText}>Contact Us</Text>
                    </Pressable>
                </View>
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
        paddingBottom: 16,
    },
    backBtn: { marginRight: 12, padding: 4 },
    header: { fontSize: 24, fontWeight: "700", color: "#ff3366" },
    subheader: { fontSize: 13, color: "#999", marginTop: 2 },
    card: {
        backgroundColor: "#fff",
        marginHorizontal: 20,
        marginBottom: 14,
        borderRadius: 14,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    cardTitle: { fontSize: 15, fontWeight: "700", color: "#ff3366", marginBottom: 10 },
    cardContent: { fontSize: 14, color: "#555", lineHeight: 22 },
    ctaBox: {
        backgroundColor: "#fff0f4",
        marginHorizontal: 20,
        borderRadius: 14,
        padding: 24,
        alignItems: "center",
        marginTop: 4,
    },
    ctaText: { fontSize: 15, color: "#555", marginBottom: 16, textAlign: "center" },
    ctaBtn: {
        backgroundColor: "#ff3366",
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 10,
    },
    ctaBtnText: { color: "#fff", fontWeight: "600", fontSize: 15 },
});
