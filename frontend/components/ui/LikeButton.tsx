import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useRef } from "react";
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
} from "react-native";

interface LikeButtonProps {
    isLiked: boolean;
    likeCount: number;
    onToggle: () => void;
    size?: "small" | "medium" | "large";
    showCount?: boolean;
}

const SIZES = {
    small: { icon: 20, text: 12 },
    medium: { icon: 24, text: 14 },
    large: { icon: 28, text: 16 },
};

export const LikeButton: React.FC<LikeButtonProps> = ({
    isLiked,
    likeCount,
    onToggle,
    size = "medium",
    showCount = true,
}) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePress = useCallback(() => {
        // Bounce animation
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 1.3,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();

        onToggle();
    }, [onToggle, scaleAnim]);

    const { icon, text } = SIZES[size];

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={handlePress}
            activeOpacity={0.7}
        >
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Ionicons
                    name={isLiked ? "heart" : "heart-outline"}
                    size={icon}
                    color={isLiked ? "#ff3366" : "#6b7280"}
                />
            </Animated.View>
            {showCount && (
                <Text
                    style={[
                        styles.count,
                        { fontSize: text },
                        isLiked && styles.countLiked,
                    ]}
                >
                    {likeCount}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
    },
    count: {
        color: "#6b7280",
        marginLeft: 6,
        fontWeight: "600",
    },
    countLiked: {
        color: "#ff3366",
    },
});
