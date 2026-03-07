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
        title: "1. Acceptance of Terms",
        content:
            'By accessing or using the Perlme application ("App"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the App.\n\nThese Terms constitute a legally binding agreement between you and Perlme. We reserve the right to update or modify these Terms at any time. Your continued use of the App after any changes constitutes acceptance of the updated Terms.',
    },
    {
        title: "2. Eligibility",
        content:
            "You must be at least 18 years of age to create an account and use Perlme. By using the App, you represent and warrant that:\n\n• You are at least 18 years old.\n• You have the legal capacity to enter into a binding agreement.\n• You are not prohibited from using the App under applicable laws.\n• You have not been previously banned or removed from the platform.",
    },
    {
        title: "3. Account Registration & Security",
        content:
            "To use certain features of Perlme, you must register for an account. When registering, you agree to:\n\n• Provide accurate, current, and complete information.\n• Maintain and promptly update your account information.\n• Keep your password secure and confidential.\n• Accept responsibility for all activity that occurs under your account.\n• Notify us immediately of any unauthorized use of your account.",
    },
    {
        title: "4. User Conduct",
        content:
            "You agree to use Perlme responsibly and in compliance with all applicable laws. You agree NOT to:\n\n• Post or share content that is illegal, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable.\n• Engage in any form of harassment, bullying, or stalking.\n• Impersonate any person or entity, or falsely state your identity.\n• Upload or transmit viruses, malware, or any other malicious code.\n• Attempt to access other users' accounts without authorization.\n• Use the App for any commercial purpose without our written consent.\n• Scrape, crawl, or use automated means to collect data from the App.\n• Solicit personal information from minors.",
    },
    {
        title: "5. User-Generated Content",
        content:
            "Perlme allows users to create, post, share, and interact with content (\"User Content\"). By posting User Content, you:\n\n• Retain ownership of your content.\n• Grant Perlme a non-exclusive, worldwide, royalty-free, transferable license to use, display, reproduce, modify, and distribute your User Content in connection with operating and improving the App.\n• Represent that you have all rights necessary to grant this license.\n• Acknowledge that User Content may be visible to other users based on your privacy settings.",
    },
    {
        title: "6. Privacy & Data Protection",
        content:
            "Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.\n\nBy using Perlme, you consent to the collection and processing of your personal data as described in our Privacy Policy.",
    },
    {
        title: "7. Messaging & Communication",
        content:
            "Perlme provides messaging features including direct messages and group chats. When using these features:\n\n• You are solely responsible for the content of your messages.\n• Messages may be stored on our servers as described in our Privacy Policy.\n• We may monitor messages to enforce our Terms and Community Guidelines.\n• You agree not to send spam, unsolicited messages, or automated messages.",
    },
    {
        title: "8. Reporting & Moderation",
        content:
            "Perlme maintains a moderation system to ensure a safe community. You may report users, posts, comments, or messages that violate our Terms.\n\n• Reports are reviewed by our moderation team.\n• We may take action including content removal, account suspension, or permanent bans.\n• False or malicious reporting may result in action against the reporting account.\n• Moderation decisions are at our sole discretion and are final.",
    },
    {
        title: "9. Account Suspension & Termination",
        content:
            "We reserve the right to suspend or terminate your account at any time, with or without notice, for any reason, including but not limited to:\n\n• Violation of these Terms or Community Guidelines.\n• Fraudulent, illegal, or harmful activity.\n• Extended period of inactivity.\n• Request by law enforcement or government agencies.\n\nYou may delete your account at any time through the App settings.",
    },
    {
        title: "10. Intellectual Property",
        content:
            "The Perlme App, including its design, logos, trademarks, graphics, software, and all related content (excluding User Content), are owned by or licensed to Perlme and are protected by copyright, trademark, and other intellectual property laws.\n\nYou may not copy, modify, distribute, reverse engineer, or create derivative works based on the App without written permission.",
    },
    {
        title: "11. Disclaimers",
        content:
            'THE APP IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.\n\nPerlme does not guarantee that:\n\n• The App will be available at all times or without interruption.\n• The App will be free from errors, bugs, or security vulnerabilities.\n• Any content on the App is accurate, reliable, or complete.\n\nYour use of the App is at your sole risk.',
    },
    {
        title: "12. Limitation of Liability",
        content:
            "TO THE MAXIMUM EXTENT PERMITTED BY LAW, PERLME AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF THE APP.\n\nOur total liability for any claims arising from or related to these Terms or the App shall not exceed the amount you paid to us, if any, in the 12 months preceding the claim.",
    },
    {
        title: "13. Indemnification",
        content:
            "You agree to indemnify, defend, and hold harmless Perlme and its officers, directors, employees, contractors, and agents from and against any claims, liabilities, damages, losses, costs, or expenses arising out of or related to:\n\n• Your use of the App.\n• Your violation of these Terms.\n• Your violation of any third-party rights.\n• Any User Content you post or share.",
    },
    {
        title: "14. Governing Law",
        content:
            "These Terms shall be governed by and construed in accordance with the laws of Kenya, without regard to conflict of law principles.\n\nAny disputes arising from these Terms or your use of the App shall be resolved through binding arbitration. You agree to submit to the personal jurisdiction of the courts located in Nairobi, Kenya for any actions not subject to arbitration.",
    },
    {
        title: "15. Changes to Terms",
        content:
            "We may revise these Terms at any time by posting the updated version on our Site. Changes are effective immediately upon posting. We will notify you of material changes through the App or via email.\n\nYour continued use of the App after the revised Terms are posted constitutes your acceptance of the changes.",
    },
    {
        title: "16. Contact Us",
        content:
            "If you have any questions about these Terms of Service, please contact us at:\n\nPerlme\nEmail: legal@perlme.com\nSupport: support@perlme.com\nWebsite: www.perlme.com",
    },
];

export default function TermsScreen() {
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
                        <Text style={styles.header}>Terms of Service</Text>
                        <Text style={styles.subheader}>Last updated: March 2, 2026</Text>
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
                    <Text style={[styles.ctaText, { color: colors.text }]}>Have questions about our Terms of Service?</Text>
                    <Pressable
                        style={styles.ctaBtn}
                        onPress={() => Linking.openURL("mailto:legal@perlme.com")}
                    >
                        <Text style={styles.ctaBtnText}>Contact Legal Team</Text>
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
