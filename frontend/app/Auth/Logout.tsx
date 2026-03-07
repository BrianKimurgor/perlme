import { persistor, RootState } from "@/src/store";
import { authApi } from "@/src/store/Apis/AuthApi";
import { blocksApi } from "@/src/store/Apis/BlocksApi";
import { exploreApi } from "@/src/store/Apis/ExploreApi";
import { groupsApi } from "@/src/store/Apis/GroupsApi";
import { messagesApi } from "@/src/store/Apis/MessagesApi";
import { postsApi } from "@/src/store/Apis/PostsApi";
import { usersApi } from "@/src/store/Apis/UsersApi";
import { logout } from "@/src/store/AuthSlice";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { expoLogger as logger } from "@/src/utils/logger";

export default function LogoutScreen() {
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            logger.info("🚪 Starting logout process...");

            // 1. Dispatch logout action to clear Redux state
            dispatch(logout());

            // 2. Reset all RTK Query caches
            dispatch(authApi.util.resetApiState());
            dispatch(postsApi.util.resetApiState());
            dispatch(messagesApi.util.resetApiState());
            dispatch(usersApi.util.resetApiState());
            dispatch(exploreApi.util.resetApiState());
            dispatch(blocksApi.util.resetApiState());
            dispatch(groupsApi.util.resetApiState());

            // 3. Clear persisted Redux state
            await persistor.purge();
            await persistor.flush();

            // 4. Clear all AsyncStorage
            await AsyncStorage.clear();

            logger.info("✅ Logout completed successfully");

            Toast.show({ type: "success", text1: "Logged out successfully 👋" });

            // 5. Navigate to login screen
            router.replace("/Auth/Login");
        } catch (error) {
            logger.error("❌ Logout error:", error);
            Toast.show({ type: "error", text1: "Logout failed. Please try again." });
            setIsLoggingOut(false);
        }
    };

    return (
        <LinearGradient colors={["#8e44ad", "#ff5fa2"]} style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.card}>
                    <Ionicons name="log-out-outline" size={60} color="#8e44ad" />
                    <Text style={styles.title}>Log Out</Text>
                    <Text style={styles.subtitle}>
                        Are you sure you want to log out
                        {user?.username ? `, ${user.username}` : ""}?
                    </Text>

                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={handleLogout}
                        disabled={isLoggingOut}
                    >
                        {isLoggingOut ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.logoutButtonText}>Yes, Log Out</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => router.back()}
                        disabled={isLoggingOut}
                    >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
                <Toast />
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 25,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 25,
        padding: 30,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 10,
        elevation: 7,
        width: "100%",
    },
    title: {
        fontSize: 24,
        fontWeight: "800",
        color: "#8e44ad",
        marginTop: 15,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: "#555",
        textAlign: "center",
        marginBottom: 25,
        lineHeight: 22,
    },
    logoutButton: {
        backgroundColor: "#e74c3c",
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 40,
        width: "100%",
        alignItems: "center",
        marginBottom: 12,
    },
    logoutButtonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
    },
    cancelButton: {
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 40,
        width: "100%",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#8e44ad",
    },
    cancelButtonText: {
        color: "#8e44ad",
        fontWeight: "600",
        fontSize: 16,
    },
});

