import React from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    TouchableOpacityProps,
    ViewStyle,
} from "react-native";

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    onPress: () => void;
    variant?: "primary" | "secondary" | "outline" | "danger";
    size?: "small" | "medium" | "large";
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = "primary",
    size = "medium",
    loading = false,
    disabled = false,
    style,
    textStyle,
    ...props
}) => {
    const getButtonStyle = (): ViewStyle => {
        const baseStyle: ViewStyle = {
            ...styles.button,
            ...styles[`${size}Button`],
        };

        switch (variant) {
            case "primary":
                return { ...baseStyle, ...styles.primaryButton };
            case "secondary":
                return { ...baseStyle, ...styles.secondaryButton };
            case "outline":
                return { ...baseStyle, ...styles.outlineButton };
            case "danger":
                return { ...baseStyle, ...styles.dangerButton };
            default:
                return baseStyle;
        }
    };

    const getTextStyle = (): TextStyle => {
        const baseStyle: TextStyle = {
            ...styles.text,
            ...styles[`${size}Text`],
        };

        switch (variant) {
            case "primary":
                return { ...baseStyle, ...styles.primaryText };
            case "secondary":
                return { ...baseStyle, ...styles.secondaryText };
            case "outline":
                return { ...baseStyle, ...styles.outlineText };
            case "danger":
                return { ...baseStyle, ...styles.dangerText };
            default:
                return baseStyle;
        }
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={[
                getButtonStyle(),
                (disabled || loading) && styles.disabledButton,
                style,
            ]}
            activeOpacity={0.7}
            {...props}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === "outline" ? "#ff3366" : "#fff"}
                />
            ) : (
                <Text style={[getTextStyle(), textStyle]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    },
    // Size styles
    smallButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    mediumButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    largeButton: {
        paddingVertical: 16,
        paddingHorizontal: 32,
    },
    // Variant styles
    primaryButton: {
        backgroundColor: "#ff3366",
    },
    secondaryButton: {
        backgroundColor: "#0a7ea4",
    },
    outlineButton: {
        backgroundColor: "transparent",
        borderWidth: 1.5,
        borderColor: "#ff3366",
    },
    dangerButton: {
        backgroundColor: "#ef4444",
    },
    disabledButton: {
        opacity: 0.5,
    },
    // Text styles
    text: {
        fontWeight: "600",
    },
    smallText: {
        fontSize: 14,
    },
    mediumText: {
        fontSize: 16,
    },
    largeText: {
        fontSize: 18,
    },
    primaryText: {
        color: "#ffffff",
    },
    secondaryText: {
        color: "#ffffff",
    },
    outlineText: {
        color: "#ff3366",
    },
    dangerText: {
        color: "#ffffff",
    },
});
