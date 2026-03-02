import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

interface LoadingProps {
    size?: "small" | "large";
    color?: string;
    fullScreen?: boolean;
    text?: string;
}

export const Loading: React.FC<LoadingProps> = ({
    size = "large",
    color = "#ff3366",
    fullScreen = false,
    text,
}) => {
    return (
        <View style={[styles.container, fullScreen && styles.fullScreen]}>
            <ActivityIndicator size={size} color={color} />
            {text && <Text style={styles.text}>{text}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    fullScreen: {
        flex: 1,
    },
    text: {
        marginTop: 12,
        fontSize: 14,
        color: "#6b7280",
    },
});
