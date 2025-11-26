// app/auth/register.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import { useRegisterMutation, RegisterRequest } from "@/src/store/Apis/AuthApi";

export const orientationEnum = [
  "STRAIGHT",
  "GAY",
  "LESBIAN",
  "BISEXUAL",
  "ASEXUAL",
  "PANSEXUAL",
  "OTHER",
] as const;

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [passwordHash, setPasswordHash] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState<"MALE" | "FEMALE">("MALE");
  const [orientation, setOrientation] = useState<typeof orientationEnum[number]>("STRAIGHT");
  const [bio, setBio] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [orientationOpen, setOrientationOpen] = useState(false);
  const [genderOpen, setGenderOpen] = useState(false);

  const [register, { isLoading }] = useRegisterMutation();
  const router = useRouter();

  const handleRegister = async () => {
    if (!username || !email || !passwordHash || !dateOfBirth || !gender || !orientation) {
      Toast.show({ type: "error", text1: "Please fill in all required fields" });
      return;
    }

    try {
      const payload: RegisterRequest = {
        username,
        email,
        passwordHash,
        dateOfBirth: dateOfBirth.toISOString(),
        gender,
        orientation,
        bio,
      };

      const res = await register(payload).unwrap();

      Toast.show({ type: "success", text1: res.message || "Registration Successful!" });

      // Automatically navigate to VerifyEmail page after registration
      router.replace({
        pathname: "/Auth/verifyEmail",
        params: { email }, // pass email if needed
      });

    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Registration Failed",
        text2: err?.data?.error || err.message || "Unknown error",
      });
    }
  };

  return (
    <LinearGradient colors={["#8e44ad", "#ff5fa2"]} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 25 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.logo}>❤️</Text>
          <Text style={styles.title}>PerlMe Register</Text>

          {/* Username */}
          <View style={styles.inputWrapper}>
            <MaterialIcons name="person" size={24} color="#fff" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          {/* Email */}
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

          {/* Password */}
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed" size={24} color="#fff" style={styles.icon} />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Password"
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={passwordHash}
              onChangeText={setPasswordHash}
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

          {/* Date of Birth */}
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={[styles.inputWrapper, { justifyContent: "space-between" }]}
          >
            <MaterialIcons name="calendar-today" size={24} color="#fff" style={styles.icon} />
            <Text style={{ color: "#fff", fontSize: 16 }}>
              {dateOfBirth.toDateString()}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dateOfBirth}
              mode="date"
              display="default"
              maximumDate={new Date()}
              onChange={(_, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDateOfBirth(selectedDate);
              }}
            />
          )}

          {/* Dropdowns */}
          <View style={{ zIndex: 2000 }}>
            <DropDownPicker
              open={genderOpen}
              value={gender}
              items={[
                { label: "Male", value: "MALE" },
                { label: "Female", value: "FEMALE" },
              ]}
              setOpen={setGenderOpen}
              setValue={setGender}
              containerStyle={{ marginBottom: 15 }}
              style={{ backgroundColor: "#ffffffaa" }}
              dropDownContainerStyle={{ backgroundColor: "#ffffffcc" }}
              zIndex={3000}
            />
            <DropDownPicker
              open={orientationOpen}
              value={orientation}
              items={orientationEnum.map((o) => ({ label: o, value: o }))}
              setOpen={setOrientationOpen}
              setValue={setOrientation}
              containerStyle={{ marginBottom: 15 }}
              style={{ backgroundColor: "#ffffffaa" }}
              dropDownContainerStyle={{ backgroundColor: "#ffffffcc" }}
              zIndex={2000}
            />
          </View>

          {/* Bio */}
          <View style={[styles.inputWrapper, { paddingVertical: 10 }]}>
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Bio (optional)"
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={bio}
              onChangeText={setBio}
              multiline
            />
          </View>

          {/* Register Button */}
          <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#8e44ad" />
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
          </TouchableOpacity>

          {/* Links */}
          <TouchableOpacity
            style={{ marginTop: 20 }}
            onPress={() => router.push("/Auth/Login")}
          >
            <Text style={styles.registerLink}>Already have an account? Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ marginTop: 10 }}
            onPress={() => router.push("/Auth/verifyEmail")}
          >
            <Text style={[styles.registerLink, { fontSize: 14 }]}>
              Didn't receive verification email? Verify here
            </Text>
          </TouchableOpacity>

          <Toast />
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  logo: { fontSize: 60, textAlign: "center", marginBottom: 10, color: "#fff" },
  title: { fontSize: 28, fontWeight: "700", color: "#fff", textAlign: "center", marginBottom: 30 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 50,
  },
  icon: { marginRight: 10 },
  input: { fontSize: 16, color: "#fff", flex: 1 },
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
  buttonText: { color: "#8e44ad", fontWeight: "700", fontSize: 18 },
  registerLink: { color: "#fff", textAlign: "center", textDecorationLine: "underline", fontWeight: "500", fontSize: 16 },
});
