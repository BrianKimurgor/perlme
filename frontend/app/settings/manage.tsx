import { useAppTheme } from "@/src/hooks/useAppTheme";
import { RootState } from "@/src/store";
import {
    UpdateUserRequest,
    useGetUserByIdQuery,
    useUpdateUserMutation,
} from "@/src/store/Apis/UsersApi";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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

const GENDER_OPTIONS = ["MALE", "FEMALE", "NON_BINARY", "OTHER"] as const;
const ORIENTATION_OPTIONS = [
    "STRAIGHT",
    "GAY",
    "LESBIAN",
    "BISEXUAL",
    "ASEXUAL",
    "PANSEXUAL",
    "OTHER",
] as const;
const VISIBILITY_OPTIONS = ["PUBLIC", "PRIVATE", "FRIENDS_ONLY"] as const;

function labelOf(val: string) {
    return val.replaceAll("_", " ");
}

function visibilityIconName(opt: string) {
    if (opt === "PUBLIC") return "globe-outline";
    if (opt === "PRIVATE") return "lock-closed-outline";
    return "people-outline";
}

export default function ManageAccountScreen() {
    const router = useRouter();
    const currentUser = useSelector((state: RootState) => state.auth.user);
    const { colors, accent } = useAppTheme();

    const { data: profile, isLoading: loadingProfile } = useGetUserByIdQuery(
        currentUser?.id ?? "",
        { skip: !currentUser?.id }
    );

    const [updateUser, { isLoading: saving }] = useUpdateUserMutation();

    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [gender, setGender] = useState<UpdateUserRequest["gender"] | "">("");
    const [orientation, setOrientation] = useState<
        UpdateUserRequest["orientation"] | ""
    >("");
    const [visibility, setVisibility] = useState<
        UpdateUserRequest["visibility"] | ""
    >("");
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (profile) {
            setUsername(profile.username ?? "");
            setBio(profile.bio ?? "");
            setGender((profile.gender as any) ?? "");
            setOrientation((profile.orientation as any) ?? "");
            setVisibility((profile.visibility as any) ?? "");
        }
    }, [profile]);

    const handleSave = async () => {
        if (!currentUser?.id) return;
        setError("");
        setSuccess(false);
        const data: UpdateUserRequest = {};
        if (username.trim()) data.username = username.trim();
        if (bio.trim() !== (profile?.bio ?? "")) data.bio = bio.trim();
        if (gender) data.gender = gender as UpdateUserRequest["gender"];
        if (orientation)
            data.orientation = orientation as UpdateUserRequest["orientation"];
        if (visibility)
            data.visibility = visibility as UpdateUserRequest["visibility"];

        try {
            await updateUser({ userId: currentUser.id, data }).unwrap();
            setSuccess(true);
        } catch (e: any) {
            setError(e?.data?.error ?? "Failed to save changes. Please try again.");
        }
    };

    if (loadingProfile) {
        return (
            <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
                <View style={styles.center}>
                    <ActivityIndicator color="#ff3366" size="large" />
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
                        <Text style={styles.header}>Manage Account</Text>
                    </View>

                    <View style={styles.form}>
                        {/* Username */}
                        <Text style={styles.label}>Username</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: colors.input, color: colors.text }]}
                            value={username}
                            onChangeText={setUsername}
                            placeholder="Your username"
                            placeholderTextColor="#bbb"
                            autoCapitalize="none"
                        />

                        {/* Bio */}
                        <Text style={styles.label}>Bio</Text>
                        <TextInput
                            style={[styles.input, styles.textarea, { backgroundColor: colors.input, color: colors.text }]}
                            value={bio}
                            onChangeText={setBio}
                            placeholder="Tell people about yourself..."
                            placeholderTextColor="#bbb"
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />

                        {/* Gender */}
                        <Text style={styles.label}>Gender</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{ marginBottom: 16 }}
                        >
                            {GENDER_OPTIONS.map((opt) => (
                                <Pressable
                                    key={opt}
                                    style={[styles.chip, { backgroundColor: colors.surface }, gender === opt && styles.chipActive]}
                                    onPress={() => setGender(opt)}
                                >
                                    <Text
                                        style={[
                                            styles.chipText,
                                            gender === opt && styles.chipTextActive,
                                        ]}
                                    >
                                        {labelOf(opt)}
                                    </Text>
                                </Pressable>
                            ))}
                        </ScrollView>

                        {/* Orientation */}
                        <Text style={styles.label}>Orientation</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{ marginBottom: 16 }}
                        >
                            {ORIENTATION_OPTIONS.map((opt) => (
                                <Pressable
                                    key={opt}
                                    style={[
                                        styles.chip,
                                        { backgroundColor: colors.surface },
                                        orientation === opt && styles.chipActive,
                                    ]}
                                    onPress={() => setOrientation(opt)}
                                >
                                    <Text
                                        style={[
                                            styles.chipText,
                                            orientation === opt && styles.chipTextActive,
                                        ]}
                                    >
                                        {labelOf(opt)}
                                    </Text>
                                </Pressable>
                            ))}
                        </ScrollView>

                        {/* Visibility */}
                        <Text style={styles.label}>Profile Visibility</Text>
                        <View style={styles.visibilityRow}>
                            {VISIBILITY_OPTIONS.map((opt) => (
                                <Pressable
                                    key={opt}
                                    style={[
                                        styles.visibilityBtn,
                                        { backgroundColor: colors.surface },
                                        visibility === opt && styles.visibilityBtnActive,
                                    ]}
                                    onPress={() => setVisibility(opt)}
                                >
                                    <Ionicons
                                        name={visibilityIconName(opt) as any}
                                        size={18}
                                        color={visibility === opt ? "#fff" : "#888"}
                                    />
                                    <Text
                                        style={[
                                            styles.visibilityText,
                                            visibility === opt && styles.visibilityTextActive,
                                        ]}
                                    >
                                        {labelOf(opt)}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>

                        {/* Feedback */}
                        {error !== "" && (
                            <View style={styles.errorBox}>
                                <Ionicons name="alert-circle-outline" size={16} color="#e11d48" />
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        )}
                        {success && (
                            <View style={styles.successBox}>
                                <Ionicons name="checkmark-circle-outline" size={16} color="#16a34a" />
                                <Text style={styles.successText}>Changes saved successfully!</Text>
                            </View>
                        )}

                        {/* Save Button */}
                        <Pressable style={styles.saveBtn} onPress={handleSave} disabled={saving}>
                            {saving ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.saveBtnText}>Save Changes</Text>
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
    center: { flex: 1, alignItems: "center", justifyContent: "center" },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 12,
    },
    backBtn: { marginRight: 12, padding: 4 },
    header: { fontSize: 24, fontWeight: "700", color: "#ff3366" },
    form: { paddingHorizontal: 20 },
    label: {
        fontSize: 13,
        fontWeight: "600",
        color: "#555",
        marginBottom: 6,
        marginTop: 4,
    },
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
    textarea: { height: 110 },
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
    visibilityRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
    visibilityBtn: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        backgroundColor: "#fff",
    },
    visibilityBtnActive: { backgroundColor: "#ff3366", borderColor: "#ff3366" },
    visibilityText: { fontSize: 12, color: "#888", fontWeight: "500" },
    visibilityTextActive: { color: "#fff" },
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
    successBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f0fdf4",
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
        gap: 8,
    },
    successText: { fontSize: 13, color: "#16a34a", flex: 1 },
    saveBtn: {
        backgroundColor: "#ff3366",
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: "center",
        marginTop: 4,
    },
    saveBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
