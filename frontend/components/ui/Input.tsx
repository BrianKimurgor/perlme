import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    TextStyle,
    View,
    ViewStyle,
} from "react-native";

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    icon?: keyof typeof Ionicons.glyphMap;
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    icon,
    containerStyle,
    inputStyle,
    ...props
}) => {
    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[styles.inputContainer, error && styles.inputError]}>
                {icon && (
                    <Ionicons
                        name={icon}
                        size={20}
                        color="#9ca3af"
                        style={styles.icon}
                    />
                )}
                <TextInput
                    style={[styles.input, icon && styles.inputWithIcon, inputStyle]}
                    placeholderTextColor="#9ca3af"
                    {...props}
                />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 8,
        backgroundColor: "#fff",
    },
    inputError: {
        borderColor: "#ef4444",
    },
    icon: {
        marginLeft: 12,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        color: "#111827",
    },
    inputWithIcon: {
        paddingLeft: 8,
    },
    errorText: {
        fontSize: 12,
        color: "#ef4444",
        marginTop: 4,
        marginLeft: 4,
    },
});
