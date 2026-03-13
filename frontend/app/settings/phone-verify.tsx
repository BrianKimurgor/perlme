import { useAppTheme } from "@/src/hooks/useAppTheme";
import {
    useRequestPhoneOtpMutation,
    useVerifyPhoneOtpMutation,
} from "@/src/store/Apis/ProfileApi";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
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
import Toast from "react-native-toast-message";

type Step = "phone" | "otp";

export default function PhoneVerifyScreen() {
    const router = useRouter();
    const { colors, accent } = useAppTheme();

    const [requestOtp, { isLoading: requesting }] = useRequestPhoneOtpMutation();
    const [verifyOtp, { isLoading: verifying }] = useVerifyPhoneOtpMutation();

    const [currentStep, setCurrentStep] = useState<Step>("phone");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [devCode, setDevCode] = useState<string | undefined>();

    const otpRefs = useRef<(TextInput | null)[]>([]);

    const handleRequestOtp = async () => {
        const trimmed = phoneNumber.trim();
        if (!trimmed) {
            Toast.show({ type: "error", text1: "Enter your phone number" });
            return;
        }
        try {
            const res = await requestOtp({ phoneNumber: trimmed }).unwrap();
            setDevCode(res.devCode);
            setCurrentStep("otp");
            Toast.show({ type: "success", text1: "OTP sent!", text2: res.devCode ? `Dev code: ${res.devCode}` : "Check your messages" });
        } catch (err: any) {
            Toast.show({ type: "error", text1: "Failed to send OTP", text2: err?.data?.error || "Try again" });
        }
    };

    const handleOtpChange = (value: string, index: number) => {
        const digit = value.replace(/[^0-9]/g, "").slice(-1);
        const next = [...otp];
        next[index] = digit;
        setOtp(next);
        if (digit && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyPress = (key: string, index: number) => {
        if (key === "Backspace" && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const code = otp.join("");
        if (code.length < 6) {
            Toast.show({ type: "error", text1: "Enter the 6-digit code" });
            return;
        }
        try {
            await verifyOtp({ code }).unwrap();
            Toast.show({ type: "success", text1: "Phone verified! ✅" });
            router.back();
        } catch (err: any) {
            Toast.show({ type: "error", text1: "Verification failed", text2: err?.data?.error || "Invalid or expired code" });
        }
    };

    const handleResend = async () => {
        setOtp(["", "", "", "", "", ""]);
        setCurrentStep("phone");
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                    {/* Header */}
                    <View style={styles.header}>
                        <Pressable onPress={() => router.back()} style={styles.backBtn}>
                            <Ionicons name="chevron-back" size={24} color={accent} />
                        </Pressable>
                        <Text style={[styles.title, { color: colors.text }]}>Phone Verification</Text>
                    </View>

                    <View style={styles.body}>
                        {/* Icon */}
                        <View style={[styles.iconWrap, { backgroundColor: `${accent}20` }]}>
                            <Ionicons name="phone-portrait-outline" size={40} color={accent} />
                        </View>

                        {currentStep === "phone" ? (
                            <>
                                <Text style={[styles.heading, { color: colors.text }]}>
                                    Verify your phone
                                </Text>
                                <Text style={[styles.sub, { color: colors.subtext }]}>
                                    Enter your phone number. We'll send a 6-digit code to confirm it's you.
                                </Text>

                                <Text style={[styles.label, { color: colors.text }]}>Phone number</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border }]}
                                    placeholder="+254 7XX XXX XXX"
                                    placeholderTextColor={colors.subtext}
                                    value={phoneNumber}
                                    onChangeText={setPhoneNumber}
                                    keyboardType="phone-pad"
                                    autoComplete="tel"
                                    maxLength={20}
                                />

                                <Pressable
                                    style={[styles.btn, { backgroundColor: accent, opacity: requesting ? 0.7 : 1 }]}
                                    onPress={handleRequestOtp}
                                    disabled={requesting}
                                >
                                    {requesting ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text style={styles.btnText}>Send Code</Text>
                                    )}
                                </Pressable>
                            </>
                        ) : (
                            <>
                                <Text style={[styles.heading, { color: colors.text }]}>
                                    Enter the code
                                </Text>
                                <Text style={[styles.sub, { color: colors.subtext }]}>
                                    We sent a 6-digit code to{"\n"}
                                    <Text style={{ color: accent, fontWeight: "600" }}>{phoneNumber}</Text>
                                </Text>

                                {/* OTP boxes */}
                                <View style={styles.otpRow}>
                                    {otp.map((digit, i) => (
                                        <TextInput
                                            key={i}
                                            ref={(ref) => { otpRefs.current[i] = ref; }}
                                            style={[
                                                styles.otpBox,
                                                {
                                                    backgroundColor: colors.input,
                                                    color: colors.text,
                                                    borderColor: digit ? accent : colors.border,
                                                },
                                            ]}
                                            value={digit}
                                            onChangeText={(v) => handleOtpChange(v, i)}
                                            onKeyPress={({ nativeEvent }) => handleOtpKeyPress(nativeEvent.key, i)}
                                            keyboardType="number-pad"
                                            maxLength={1}
                                            textAlign="center"
                                            selectTextOnFocus
                                        />
                                    ))}
                                </View>

                                {devCode && (
                                    <View style={[styles.devBanner, { backgroundColor: `${accent}15` }]}>
                                        <Ionicons name="code-working-outline" size={14} color={accent} />
                                        <Text style={[styles.devText, { color: accent }]}>
                                            Dev mode — code: {devCode}
                                        </Text>
                                    </View>
                                )}

                                <Pressable
                                    style={[styles.btn, { backgroundColor: accent, opacity: verifying ? 0.7 : 1 }]}
                                    onPress={handleVerify}
                                    disabled={verifying}
                                >
                                    {verifying ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text style={styles.btnText}>Verify</Text>
                                    )}
                                </Pressable>

                                <Pressable style={styles.resendBtn} onPress={handleResend}>
                                    <Text style={[styles.resendText, { color: colors.subtext }]}>
                                        Didn't receive it? <Text style={{ color: accent }}>Change number</Text>
                                    </Text>
                                </Pressable>
                            </>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            <Toast />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scroll: { flexGrow: 1, paddingBottom: 40 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 8,
        gap: 8,
    },
    backBtn: { padding: 4 },
    title: { fontSize: 18, fontWeight: "700" },
    body: {
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 28,
        paddingTop: 32,
    },
    iconWrap: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24,
    },
    heading: { fontSize: 22, fontWeight: "700", marginBottom: 8, textAlign: "center" },
    sub: { fontSize: 14, textAlign: "center", lineHeight: 20, marginBottom: 28 },
    label: { alignSelf: "flex-start", fontSize: 13, fontWeight: "600", marginBottom: 6 },
    input: {
        width: "100%",
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 13,
        paddingHorizontal: 14,
        fontSize: 16,
        marginBottom: 20,
    },
    btn: {
        width: "100%",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 4,
    },
    btnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
    otpRow: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 24,
    },
    otpBox: {
        width: 46,
        height: 54,
        borderWidth: 1.5,
        borderRadius: 10,
        fontSize: 22,
        fontWeight: "700",
    },
    devBanner: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginBottom: 16,
    },
    devText: { fontSize: 13, fontWeight: "500" },
    resendBtn: { marginTop: 20 },
    resendText: { fontSize: 14, textAlign: "center" },
});
