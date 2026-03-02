import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, View, ViewStyle } from "react-native";

interface AvatarProps {
    uri?: string | null;
    size?: number;
    name?: string;
    style?: ViewStyle;
    showOnlineBadge?: boolean;
    isOnline?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
    uri,
    size = 50,
    name,
    style,
    showOnlineBadge = false,
    isOnline = false,
}) => {
    const getInitials = (name: string): string => {
        const parts = name.trim().split(" ");
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const getBgColor = (name: string): string => {
        const colors = [
            "#ff3366",
            "#0a7ea4",
            "#06b6d4",
            "#10b981",
            "#8b5cf6",
            "#f59e0b",
            "#ec4899",
        ];
        const index =
            name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
            colors.length;
        return colors[index];
    };

    return (
        <View style={[styles.container, { width: size, height: size }, style]}>
            {uri ? (
                <Image source={{ uri }} style={[styles.image, { borderRadius: size / 2 }]} />
            ) : (
                <View
                    style={[
                        styles.placeholder,
                        {
                            width: size,
                            height: size,
                            borderRadius: size / 2,
                            backgroundColor: name ? getBgColor(name) : "#ccc",
                        },
                    ]}
                >
                    {name ? (
                        <Text style={[styles.initials, { fontSize: size / 2.5 }]}>
                            {getInitials(name)}
                        </Text>
                    ) : (
                        <Ionicons name="person" size={size / 2} color="#fff" />
                    )}
                </View>
            )}
            {showOnlineBadge && (
                <View
                    style={[
                        styles.badge,
                        {
                            width: size / 4,
                            height: size / 4,
                            borderRadius: size / 8,
                            backgroundColor: isOnline ? "#10b981" : "#9ca3af",
                        },
                    ]}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "relative",
    },
    image: {
        width: "100%",
        height: "100%",
    },
    placeholder: {
        alignItems: "center",
        justifyContent: "center",
    },
    initials: {
        color: "#fff",
        fontWeight: "700",
    },
    badge: {
        position: "absolute",
        bottom: 0,
        right: 0,
        borderWidth: 2,
        borderColor: "#fff",
    },
});
