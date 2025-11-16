import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ProfileSettings() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header with Compact Back Arrow */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#ff3366" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Settings</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text>Edit settings/profile.tsx to edit this screen.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10, // smaller vertical padding
    paddingHorizontal: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
  },
  backButton: {
    width: 32, // small clickable area
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    // optional: add subtle background on press
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ff3366",
    marginLeft: 10,
  },
  content: {
    flex: 1,
    padding: 20,
  },
});
