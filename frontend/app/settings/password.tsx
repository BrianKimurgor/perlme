import { useAppTheme } from "@/src/hooks/useAppTheme";
import { RootState } from "@/src/store";
import { useRequestPasswordResetMutation } from "@/src/store/Apis/AuthApi";
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
import { useSelector } from "react-redux";

export default function ChangePasswordScreen() {
    const router = useRouter();
    const currentUser = useSelector((state: RootState) => state.auth.user);
    const { colors, accent } = useAppTheme();

    const [requestReset, { isLoading }] = useRequestPasswordResetMutation();

    const [email, setEmail] = useState(currentUser?.email ?? "");
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const handleSend = async () => {
        if (!email.trim()) return;
        setError("");
        try {
            await requestReset({ email: email.trim() }).unwrap();
            setSent(true);
        } catch (e: any) {
            setError(
                e?.data?.error ?? "Something went wrong. Please try again."
            );
        }
    };

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
                        <Text style={styles.header}>Change Password</Text>
                    </View>

                    {sent ? (
                        <View style={styles.successContainer}>
                            <Ionicons name="mail-open-outline" size={64} color="#ff3366" />
                            <Text style={styles.successTitle}>Check Your Email</Text>
                            <Text style={styles.successText}>
                                {"We've sent password reset instructions to"}{"\n"}
                                <Text style={{ fontWeight: "700", color: "#333" }}>{email}</Text>
                                {"\n\n"}
                                Click the link in the email to set a new password. The link expires in 1 hour.
                            </Text>
                            <Pressable style={styles.btn} onPress={() => router.back()}>
                                <Text style={styles.btnText}>Back to Settings</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.btn, styles.btnOutline]}
                                onPress={() => {
                                    setSent(false);
                                    setError("");
                                }}
                            >
                                <Text style={styles.btnOutlineText}>Resend Email</Text>
                            </Pressable>
                        </View>
                    ) : (
                        <View style={styles.form}>
                            {/* Info box */}
                            <View style={[styles.infoBox, { backgroundColor: colors.accentTint }]}>
                                <Ionicons name="information-circle-outline" size={20} color="#ff3366" />
                                <Text style={styles.infoText}>
                                    {"For security, we'll send a password reset link to your email address. Follow the link to set a new password."}
                                </Text>
                            </View>

                            {/* Email */}
                            <Text style={styles.label}>Email Address</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: colors.input, color: colors.text }]}
                                value={email}
                                onChangeText={setEmail}
                                placeholder="your@email.com"
                                placeholderTextColor="#bbb"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />

                            {error !== "" && (
                                <View style={styles.errorBox}>
                                    <Ionicons name="alert-circle-outline" size={16} color="#e11d48" />
                                    <Text style={styles.errorText}>{error}</Text>
                                </View>
                            )}

                            <Pressable
                                style={[styles.btn, !email.trim() && styles.btnDisabled]}
                                onPress={handleSend}
                                disabled={!email.trim() || isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.btnText}>Send Reset Link</Text>
                                )}
                            </Pressable>
                        </View>
                    )}
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
        paddingBottom: 12,
    },
    backBtn: { marginRight: 12, padding: 4 },
    header: { fontSize: 24, fontWeight: "700", color: "#ff3366" },
    form: { paddingHorizontal: 20, marginTop: 8 },
    infoBox: {
        flexDirection: "row",
        alignItems: "flex-start",
        backgroundColor: "#fff0f4",
        borderRadius: 12,
        padding: 14,
        marginBottom: 24,
        gap: 10,
    },
    infoText: { fontSize: 14, color: "#555", flex: 1, lineHeight: 20 },
    label: { fontSize: 13, fontWeight: "600", color: "#555", marginBottom: 6 },
    input: {
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 14,
        fontSize: 15,
        color: "#333",
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    errorBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff1f2",
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
        gap: 8,
    },
    errorText: { fontSize: 13, color: "#e11d48", flex: 1 },
    btn: {
        backgroundColor: "#ff3366",
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: "center",
        marginTop: 4,
    },
    btnDisabled: { backgroundColor: "#ffb3c6" },
    btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
    btnOutline: {
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: "#ff3366",
        marginTop: 12,
    },
    btnOutlineText: { color: "#ff3366", fontWeight: "700", fontSize: 16 },
    successContainer: {
        alignItems: "center",
        paddingHorizontal: 32,
        paddingTop: 48,
        gap: 0,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: "#333",
        marginTop: 20,
        marginBottom: 12,
    },
    successText: {
        fontSize: 15,
        color: "#666",
        textAlign: "center",
        lineHeight: 22,
        marginBottom: 32,
    },
});
