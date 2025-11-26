import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useVerifyEmailMutation, useResendVerificationMutation } from "@/src/store/Apis/AuthApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function VerifyEmailScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const [resendVerification, { isLoading: isResending }] = useResendVerificationMutation();
  const [resendCooldown, setResendCooldown] = useState(0);
  const [email, setEmail] = useState<string | null>(null);
  const [loadingEmail, setLoadingEmail] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  const inputsRef = useRef<TextInput[]>([]);
  const otpAnim = useRef(Array(6).fill(0).map(() => new Animated.Value(1))).current;

  // Load email from AsyncStorage
  useEffect(() => {
    AsyncStorage.getItem("userEmail").then((storedEmail) => {
      setEmail(storedEmail);
      setLoadingEmail(false);
    });
  }, []);

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

    // Auto-verify when all 6 digits entered
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
    if (!email) {
      Toast.show({ type: "error", text1: "Email not found" });
      return;
    }

    try {
      await verifyEmail({ email, confirmationCode }).unwrap();
      Toast.show({ type: "success", text1: "✅ Email verified!" });
      setIsSuccess(true);
      setTimeout(() => router.replace("/(tabs)"), 1500);
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: err?.data?.error || "❌ Invalid or expired code.",
      });
      setOtp(["", "", "", "", "", ""]);
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
  Enter the 6-digit code sent to{" "}
  <Text style={styles.email}>{email}</Text>. This code ensures that your account is secure 
  and helps us verify your identity so you can access all features of the PERL Me app, 
  including personalized content, exclusive updates, and seamless app experience. 
  Please check your inbox or spam folder, and make sure to enter the code accurately.
</Text>


            <View style={styles.otpContainer}>
              {otp.map((digit, i) => (
                <Animated.View key={i} style={{ transform: [{ scale: otpAnim[i] }] }}>
                  <TextInput
                    ref={(ref) => (inputsRef.current[i] = ref!)}
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
    padding: 30,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 7,
    alignItems: "center",
  },
  title: { fontSize: 26, fontWeight: "800", color: "#8e44ad", textAlign: "center", marginBottom: 8 },
  subtitle: { fontSize: 14, color: "#555", textAlign: "center", marginBottom: 20 },
  email: { fontWeight: "600", color: "#8e44ad" },
  otpContainer: { flexDirection: "row", justifyContent: "center", gap: 12, marginBottom: 15 },
  otpInput: {
    width: 55,
    height: 60,
    borderRadius: 12,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    shadowColor: "#8e44ad",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  otpInputFilled: { backgroundColor: "#f3f3f3", borderWidth: 2, borderColor: "#8e44ad", color: "#8e44ad" },
  otpInputEmpty: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#ccc", color: "#333" },
  otpSuccess: { borderColor: "green", backgroundColor: "#d4fcd4" },
  statusText: { textAlign: "center", marginBottom: 15, fontSize: 14, color: "#555" },
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
