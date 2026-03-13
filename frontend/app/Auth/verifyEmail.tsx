import { useResendVerificationMutation, useVerifyEmailMutation } from "@/src/store/Apis/AuthApi";
import { expoLogger as logger } from "@/src/utils/logger";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function VerifyEmailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [otp, setOtp] = useState(["", "", "", "", "", "", "", ""]);
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const [resendVerification, { isLoading: isResending }] = useResendVerificationMutation();
  const [resendCooldown, setResendCooldown] = useState(0);
  const [email, setEmail] = useState<string | null>(null);
  const [loadingEmail, setLoadingEmail] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  const inputsRef = useRef<(TextInput | null)[]>([]);
  const otpAnim = useRef(Array(8).fill(0).map(() => new Animated.Value(1))).current;

  // Load email from route params or AsyncStorage
  useEffect(() => {
    const loadEmail = async () => {
      // First try to get from route params
      const routeEmail = params.email as string;
      logger.info("🔍 [FRONTEND] Route params email:", routeEmail);

      if (routeEmail) {
        logger.info("✅ [FRONTEND] Email found in route params:", routeEmail);
        setEmail(routeEmail);
        // Save to AsyncStorage for future use
        await AsyncStorage.setItem("userEmail", routeEmail);
        setLoadingEmail(false);
        return;
      }

      // Fall back to AsyncStorage
      const storedEmail = await AsyncStorage.getItem("userEmail");
      logger.info("🔍 [FRONTEND] AsyncStorage email:", storedEmail);
      setEmail(storedEmail);
      setLoadingEmail(false);
    };

    loadEmail();
  }, [params.email]);

  // Countdown for resend button
  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleChange = (text: string, index: number) => {
    if (!/^[0-9a-zA-Z]?$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text.toUpperCase();
    setOtp(newOtp);

    Animated.sequence([
      Animated.timing(otpAnim[index], { toValue: 1.2, duration: 100, useNativeDriver: true }),
      Animated.timing(otpAnim[index], { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    // Focus next box
    if (text && index < otp.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    // Auto-verify when all 8 digits entered
    if (newOtp.every((d) => d !== "")) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleKeyDown = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (confirmationCode: string) => {
    logger.info("🔍 [FRONTEND] Attempting to verify email:", email);
    logger.info("🔍 [FRONTEND] Confirmation code:", confirmationCode);

    if (!email) {
      logger.error("❌ [FRONTEND] Email is null or undefined");
      Toast.show({ type: "error", text1: "Email not found" });
      return;
    }

    try {
      logger.info("📤 [FRONTEND] Sending verification request...");
      await verifyEmail({ email, confirmationCode }).unwrap();
      logger.info("✅ [FRONTEND] Email verified successfully!");
      Toast.show({ type: "success", text1: "✅ Email verified! Please log in." });
      setIsSuccess(true);
      setTimeout(() => router.replace("/Auth/Login"), 1500);
    } catch (err: any) {
      logger.error("❌ [FRONTEND] Verification failed:", err);
      Toast.show({
        type: "error",
        text1: err?.data?.error || "❌ Invalid or expired code.",
      });
      setOtp(["", "", "", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    if (!email || resendCooldown > 0) return;

    try {
      await resendVerification({ email }).unwrap();
      Toast.show({ type: "success", text1: "✅ Verification code resent!" });
      setResendCooldown(30);
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: err?.data?.error || "❌ Failed to resend code.",
      });
    }
  };

  if (loadingEmail) {
    return (
      <LinearGradient colors={["#8e44ad", "#ff5fa2"]} style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#fff" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#8e44ad", "#ff5fa2"]} style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 25 }}>
          <View style={styles.card}>
            <Text style={styles.title}>Verify Your Email</Text>
            <Text style={styles.subtitle}>
              Enter the 8-digit code sent to{" "}
              <Text style={styles.email}>{email}</Text>
              {". "}This code ensures your account is secure and helps us verify your identity.
              Please check your inbox or spam folder.
            </Text>


            <View style={styles.otpContainer}>
              {otp.map((digit, i) => (
                <Animated.View key={i} style={{ transform: [{ scale: otpAnim[i] }] }}>
                  <TextInput
                    ref={(ref) => { inputsRef.current[i] = ref; }}
                    value={digit}
                    onChangeText={(text) => handleChange(text, i)}
                    onKeyPress={(e) => handleKeyDown(e, i)}
                    keyboardType="number-pad"
                    maxLength={1}
                    style={[
                      styles.otpInput,
                      digit ? styles.otpInputFilled : styles.otpInputEmpty,
                      isSuccess && styles.otpSuccess,
                    ]}
                  />
                </Animated.View>
              ))}
            </View>

            <Text style={styles.statusText}>
              {isSuccess
                ? "✅ Email Verified! Redirecting..."
                : isLoading
                  ? "🔄 Verifying your code..."
                  : `⏳ Auto-verifying once you enter all digits...`}
            </Text>

            {/* Resend button */}
            <TouchableOpacity
              onPress={handleResend}
              disabled={isResending || resendCooldown > 0}
              style={[styles.resendButton, resendCooldown > 0 && styles.resendDisabled]}
            >
              <Text style={styles.resendText}>
                {isResending
                  ? "🔁 Resending..."
                  : resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : "🔁 Resend Code"}
              </Text>
            </TouchableOpacity>

            {/* Back to Login */}
            <TouchableOpacity onPress={() => router.push("/Auth/Login")} style={styles.backButton}>
              <Text style={styles.backText}>← Back to Login</Text>
            </TouchableOpacity>
          </View>
          <Toast />
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 20,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 7,
    alignItems: "center",
  },
  title: { fontSize: 24, fontWeight: "800", color: "#8e44ad", textAlign: "center", marginBottom: 8 },
  subtitle: { fontSize: 13, color: "#555", textAlign: "center", marginBottom: 20, lineHeight: 18 },
  email: { fontWeight: "600", color: "#8e44ad" },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 15,
    maxWidth: "100%",
  },
  otpInput: {
    width: 42,
    height: 52,
    borderRadius: 12,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    shadowColor: "#8e44ad",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  otpInputFilled: { backgroundColor: "#f3f3f3", borderWidth: 2, borderColor: "#8e44ad", color: "#8e44ad" },
  otpInputEmpty: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#ccc", color: "#333" },
  otpSuccess: { borderColor: "green", backgroundColor: "#d4fcd4" },
  statusText: { textAlign: "center", marginBottom: 15, fontSize: 13, color: "#555", paddingHorizontal: 10 },
  resendButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#8e44ad",
    marginBottom: 15,
  },
  resendDisabled: { opacity: 0.5 },
  resendText: { color: "#8e44ad", fontWeight: "600" },
  backButton: { marginTop: 5 },
  backText: { color: "#8e44ad", fontWeight: "600", textDecorationLine: "underline" },
});

