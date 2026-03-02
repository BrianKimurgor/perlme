import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface CommentInputProps {
    onSubmit: (text: string) => Promise<void>;
    isSubmitting?: boolean;
    placeholder?: string;
}

export const CommentInput: React.FC<CommentInputProps> = ({
    onSubmit,
    isSubmitting = false,
    placeholder = "Add a comment...",
}) => {
    const [text, setText] = useState("");

    const canSend = text.trim().length > 0 && !isSubmitting;

    const handleSend = async () => {
        if (!canSend) return;
        const content = text.trim();
        setText("");
        await onSubmit(content);
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#b0b0b0"
                value={text}
                onChangeText={setText}
                multiline
                maxLength={1000}
                editable={!isSubmitting}
            />
            <TouchableOpacity
                style={[styles.sendButton, canSend && styles.sendButtonActive]}
                onPress={handleSend}
                disabled={!canSend}
                activeOpacity={0.7}
            >
                <Ionicons
                    name="send"
                    size={18}
                    color={canSend ? "#fff" : "#ccc"}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "flex-end",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: "#f3e8ff",
        backgroundColor: "#fff",
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: "#1f2937",
        backgroundColor: "#fdf2f8",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#f9d4e8",
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 10,
        maxHeight: 80,
        minHeight: 38,
    },
    sendButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: "#e5e7eb",
        alignItems: "center",
        justifyContent: "center",
    },
    sendButtonActive: {
        backgroundColor: "#ff3366",
        shadowColor: "#ff3366",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 3,
    },
});
