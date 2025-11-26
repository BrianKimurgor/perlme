// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store";
import { Ionicons, AntDesign, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import ThemedWrapper from "@/src/components/ThemedWrapper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const theme = useSelector((state: RootState) => state.theme.mode);
  const accent = useSelector((state: RootState) => state.theme.accent);
  const insets = useSafeAreaInsets();

  const inactiveColor = theme === "dark" ? "#aaa" : "#444";
  const backgroundColor = theme === "dark" ? "#000" : "#fff";

  return (
    <ThemedWrapper>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: accent,
          tabBarInactiveTintColor: inactiveColor,
          tabBarStyle: {
            backgroundColor,
            borderTopWidth: 0.4,
            borderTopColor: theme === "dark" ? "#333" : "#ddd",
            height: 60 + insets.bottom, // Custom height + safe area
            paddingBottom: insets.bottom, // Safe area padding
          },
        }}
      >
        {/* Home */}
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <AntDesign name="home" size={24} color={color} />
            ),
          }}
        />

        {/* Matches */}
        <Tabs.Screen
          name="matches"
          options={{
            title: "Matches",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="heart" size={26} color={color} />
            ),
          }}
        />

        {/* Chats */}
        <Tabs.Screen
          name="chats"
          options={{
            title: "Chats",
            tabBarIcon: ({ color }) => (
              <Ionicons name="chatbubbles" size={25} color={color} />
            ),
          }}
        />

        {/* Profile */}
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <Feather name="user" size={24} color={color} />
            ),
          }}
        />

        {/* More */}
        <Tabs.Screen
          name="more"
          options={{
            title: "More",
            tabBarIcon: ({ color }) => (
              <Ionicons name="ellipsis-horizontal" size={25} color={color} />
            ),
          }}
        />
      </Tabs>
    </ThemedWrapper>
  );
}
