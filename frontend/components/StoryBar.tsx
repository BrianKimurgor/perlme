import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const RING_GRADIENTS: [string, string, ...string[]][] = [
  ["#f09433", "#e6683c", "#dc2743", "#cc2366", "#bc1888"],
  ["#8a2be2", "#da70d6"],
  ["#f7971e", "#ffd200"],
  ["#00b09b", "#96c93d"],
  ["#4776e6", "#8e54e9"],
  ["#f5515f", "#9f041b"],
  ["#11998e", "#38ef7d"],
  ["#fc00ff", "#00dbde"],
];

export interface StoryUser {
  id: string;
  username: string;
  avatarUrl: string | null;
}

interface StoryBarProps {
  users: StoryUser[];
  onPress: (userId: string) => void;
  isDark?: boolean;
}

const RING_SIZE = 68;
const BORDER_GAP = 3;
const AVATAR_SIZE = RING_SIZE - BORDER_GAP * 2;

export const StoryBar: React.FC<StoryBarProps> = ({ users, onPress, isDark }) => {
  if (users.length === 0) return null;

  return (
    <FlatList
      data={users}
      horizontal
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      renderItem={({ item, index }) => {
        const gradient = RING_GRADIENTS[index % RING_GRADIENTS.length];
        return (
          <TouchableOpacity
            style={styles.storyItem}
            onPress={() => onPress(item.id)}
            activeOpacity={0.75}
          >
            <LinearGradient
              colors={gradient}
              start={{ x: 0.2, y: 1 }}
              end={{ x: 1, y: 0.2 }}
              style={styles.gradientRing}
            >
              <View
                style={[
                  styles.avatarBorder,
                  { backgroundColor: isDark ? "#111" : "#fff" },
                ]}
              >
                {item.avatarUrl ? (
                  <Image
                    source={{ uri: item.avatarUrl }}
                    style={styles.avatar}
                    contentFit="cover"
                  />
                ) : (
                  <View style={[styles.avatar, styles.avatarFallback]}>
                    <Text style={styles.initial}>
                      {(item.username[0] ?? "?").toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>
            </LinearGradient>
            <Text
              style={[styles.label, { color: isDark ? "#ddd" : "#333" }]}
              numberOfLines={1}
            >
              {item.username}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  storyItem: {
    alignItems: "center",
    width: RING_SIZE + 8,
  },
  gradientRing: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarBorder: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
  },
  avatar: {
    width: AVATAR_SIZE - 4,
    height: AVATAR_SIZE - 4,
    borderRadius: (AVATAR_SIZE - 4) / 2,
  },
  avatarFallback: {
    backgroundColor: "#c8c8c8",
    alignItems: "center",
    justifyContent: "center",
  },
  initial: {
    fontSize: 21,
    fontWeight: "700",
    color: "#555",
  },
  label: {
    fontSize: 11,
    marginTop: 5,
    textAlign: "center",
    maxWidth: RING_SIZE + 8,
    fontWeight: "500",
  },
});
