// app/auth/login.tsx
import { AuthResponse, useLoginMutation } from "@/src/store/Apis/AuthApi";
import { setCredentials } from "@/src/store/AuthSlice";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";

// Types
interface User {
  id: string;
  email: string;
  username: string;
  role: "REGULAR" | "ADMIN";
  avatarUrl: string | null;
}

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({ type: "error", text1: "Fill in all fields" });
      return;
    }

    console.log("📤 [FRONTEND] Initiating login for email:", email);

    try {
      const apiRes: AuthResponse = await login({ email, password }).unwrap();

      console.log("📥 [FRONTEND] Login response:", apiRes);

      // Handle optional token/message
      const token = apiRes.accessToken || "";
      const refreshToken = apiRes.refreshToken || "";
      const message = apiRes.message || "Login successful";
      const user = apiRes.user;

      if (!token) {
        console.error("❌ [FRONTEND] No accessToken in response");
        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: "No token returned from server",
        });
        return;
      }

      console.log("✅ [FRONTEND] Token received, saving to Redux and AsyncStorage");

      // Save Redux
      dispatch(setCredentials({ token, user }));

      // Save AsyncStorage
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("refreshToken", refreshToken);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      // Show message from backend
      Toast.show({ type: "success", text1: message });

      // Navigate to main tabs
      router.replace("/(tabs)");
    } catch (err: any) {
      console.error("Login failed:", err);
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: err?.data?.error || "Unknown error",
      });
    }
  };

  return (
    <LinearGradient colors={["#8e44ad", "#ff5fa2"]} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1, justifyContent: "center", padding: 25 }}
      >
        <Text style={styles.logo}>❤️</Text>
        <Text style={styles.title}>PerlMe Admin</Text>

        <View style={styles.inputWrapper}>
          <MaterialIcons name="email" size={24} color="#fff" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed" size={24} color="#fff" style={styles.icon} />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Password"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color="#fff"
              style={{ marginLeft: 10 }}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#1abc9c" /> : <Text style={styles.buttonText}>Login</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={{ marginTop: 20 }} onPress={() => router.push("/Auth/Register")}>
          <Text style={styles.registerLink}>Don't have an account? Register</Text>
        </TouchableOpacity>

        <Toast />
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  logo: { fontSize: 60, textAlign: "center", marginBottom: 10, color: "#fff" },
  title: { fontSize: 28, fontWeight: "700", color: "#fff", textAlign: "center", marginBottom: 40 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 50,
  },
  icon: { marginRight: 10 },
  input: { paddingVertical: 12, fontSize: 16, color: "#fff", flex: 1 },
  button: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: { color: "#1abc9c", fontWeight: "700", fontSize: 18 },
  registerLink: { color: "#fff", textAlign: "center", textDecorationLine: "underline", fontWeight: "500", fontSize: 16 },
});
