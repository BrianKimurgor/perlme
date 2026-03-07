import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const categories = [
    "General Help",
    "Safety & Privacy",
    "Account Issues",
    "Feedback & Suggestions",
    "Bug Report",
    "Other",
];

export default function FeedbackScreen() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [category, setCategory] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const { colors, accent } = useAppTheme();

    const handleSubmit = async () => {
        if (!name.trim() || !email.trim() || !message.trim()) return;
        setLoading(true);
        // Simulate submission — in production connect to backend feedback endpoint
        await new Promise((resolve) => setTimeout(resolve, 800));
        setLoading(false);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
                <View style={styles.headerRow}>
                    <Pressable onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={24} color={accent} />
                    </Pressable>
                    <Text style={styles.header}>Feedback</Text>
                </View>
                <View style={styles.successBox}>
                    <Ionicons name="checkmark-circle" size={64} color="#ff3366" />
                    <Text style={styles.successTitle}>Message Sent!</Text>
                    <Text style={styles.successText}>
                        {"Thank you for reaching out. We'll get back to you within 24\u201348 hours."}
                    </Text>
                    <Pressable style={styles.submitBtn} onPress={() => router.back()}>
                        <Text style={styles.submitBtnText}>Back to More</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={{ paddingBottom: 40 }}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View style={styles.headerRow}>
                        <Pressable onPress={() => router.back()} style={styles.backBtn}>
                            <Ionicons name="chevron-back" size={24} color={accent} />
                        </Pressable>
                        <Text style={styles.header}>Feedback</Text>
                    </View>

                    <Text style={styles.subtitle}>
                        Share ideas, report issues, or get in touch with our team.
                    </Text>

                    <View style={styles.form}>
                        {/* Name */}
                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: colors.input, color: colors.text }]}
                            placeholder="Your name"
                            placeholderTextColor="#bbb"
                            value={name}
                            onChangeText={setName}
                        />

                        {/* Email */}
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: colors.input, color: colors.text }]}
                            placeholder="your@email.com"
                            placeholderTextColor="#bbb"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />

                        {/* Category */}
                        <Text style={styles.label}>Category</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{ marginBottom: 16 }}
                        >
                            {categories.map((cat) => (
                                <Pressable
                                    key={cat}
                                    style={[
                                        styles.chip,
                                        { backgroundColor: colors.surface },
                                        category === cat && styles.chipActive,
                                    ]}
                                    onPress={() => setCategory(cat)}
                                >
                                    <Text
                                        style={[
                                            styles.chipText,
                                            category === cat && styles.chipTextActive,
                                        ]}
                                    >
                                        {cat}
                                    </Text>
                                </Pressable>
                            ))}
                        </ScrollView>

                        {/* Subject */}
                        <Text style={styles.label}>Subject</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: colors.input, color: colors.text }]}
                            placeholder="Brief summary"
                            placeholderTextColor="#bbb"
                            value={subject}
                            onChangeText={setSubject}
                        />

                        {/* Message */}
                        <Text style={styles.label}>Message</Text>
                        <TextInput
                            style={[styles.input, styles.textarea]}
                            placeholder="Describe your issue or suggestion in detail..."
                            placeholderTextColor="#bbb"
                            multiline
                            numberOfLines={6}
                            textAlignVertical="top"
                            value={message}
                            onChangeText={setMessage}
                        />

                        {/* Submit */}
                        <Pressable
                            style={[
                                styles.submitBtn,
                                (!name.trim() || !email.trim() || !message.trim()) && styles.submitBtnDisabled,
                            ]}
                            onPress={handleSubmit}
                            disabled={!name.trim() || !email.trim() || !message.trim() || loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.submitBtnText}>Send Message</Text>
                            )}
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
    subtitle: {
        fontSize: 14,
        color: "#888",
        paddingHorizontal: 20,
        marginBottom: 20,
        lineHeight: 20,
    },
    form: { paddingHorizontal: 20 },
    label: { fontSize: 13, fontWeight: "600", color: "#555", marginBottom: 6 },
    input: {
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 14,
        fontSize: 15,
        color: "#333",
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    textarea: { height: 130 },
    chip: {
        paddingVertical: 7,
        paddingHorizontal: 14,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        backgroundColor: "#fff",
        marginRight: 8,
    },
    chipActive: { backgroundColor: "#ff3366", borderColor: "#ff3366" },
    chipText: { fontSize: 13, color: "#666" },
    chipTextActive: { color: "#fff", fontWeight: "600" },
    submitBtn: {
        backgroundColor: "#ff3366",
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: "center",
        marginTop: 8,
    },
    submitBtnDisabled: { backgroundColor: "#ffb3c6" },
    submitBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
    successBox: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 40,
    },
    successTitle: { fontSize: 24, fontWeight: "700", color: "#333", marginTop: 20, marginBottom: 12 },
    successText: {
        fontSize: 15,
        color: "#666",
        textAlign: "center",
        lineHeight: 22,
        marginBottom: 32,
    },
});
