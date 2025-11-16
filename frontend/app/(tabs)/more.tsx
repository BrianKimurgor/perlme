import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function MoreScreen() {
  const router = useRouter();

  const sections = [
    {
      title: "Account",
      items: [
        { title: "Manage Account", icon: "person-circle-outline", path: "/settings/manage" },
        { title: "Change Password", icon: "key-outline", path: "/settings/password" },
        { title: "Logout", icon: "log-out-outline", path: "/settings/logout" },
      ],
    },
    {
      title: "Support & Legal",
      items: [
        { title: "Help / FAQ", icon: "help-circle-outline", path: "/help" },
        { title: "Privacy Policy", icon: "shield-checkmark-outline", path: "/privacy" },
        { title: "Terms of Service", icon: "document-text-outline", path: "/terms" },
        { title: "Feedback", icon: "chatbubbles-outline", path: "/feedback" },
      ],
    },
    {
      title: "Personalization",
      items: [
        { title: "Theme & Appearance", icon: "color-palette-outline", path: "/settings/theme" },
        { title: "Subscriptions", icon: "card-outline", path: "/settings/subscription" },
        { title: "Notification Settings", icon: "notifications-outline", path: "/settings/notifications" },
      ],
    },
    {
      title: "App & Social",
      items: [
        { title: "Invite Friends", icon: "person-add-outline", path: "/invite" },
        { title: "Blocked Users", icon: "ban-outline", path: "/blocked" },
        { title: "Activity Log", icon: "time-outline", path: "/activity" },
      ],
    },
    {
      title: "About",
      items: [
        { title: "About PerlMe", icon: "information-circle-outline", path: "/about" },
        { title: "Version 1.0.0", icon: "ellipse-outline", path: "/version" },
      ],
    },
  ];

  // Animation refs
  const fadeAnims = useRef(sections.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // Animate sections sequentially
    Animated.stagger(
      150,
      fadeAnims.map((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        })
      )
    ).start();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {sections.map((section, sIndex) => (
          <Animated.View
            key={sIndex}
            style={{ opacity: fadeAnims[sIndex], transform: [{ scale: fadeAnims[sIndex].interpolate({ inputRange: [0, 1], outputRange: [0.97, 1] }) }] }}
          >
            <View style={styles.section}>
              {section.title && <Text style={styles.sectionTitle}>{section.title}</Text>}
              {section.items.map((item, index) => (
                <Pressable
                  key={index}
                  style={({ pressed }) => [
                    styles.item,
                    pressed && { backgroundColor: "#ffe6eb", transform: [{ scale: 0.97 }] },
                  ]}
                  onPress={() => router.push(item.path as any)}
                >
                  <View style={styles.itemContent}>
                    <Ionicons name={item.icon as any} size={22} color="#ff3366" />
                    <Text style={styles.itemText}>{item.title}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#aaa" />
                </Pressable>
              ))}
            </View>
          </Animated.View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fefefe",
  },
  section: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#999",
    marginBottom: 12,
    textTransform: "uppercase",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemText: {
    marginLeft: 14,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
});

