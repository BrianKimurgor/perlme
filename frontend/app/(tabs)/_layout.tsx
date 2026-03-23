import ThemedWrapper from "@/src/components/ThemedWrapper";
import { RootState } from "@/src/store";
import { useGetUnreadCountQuery } from "@/src/store/Apis/MessagesApi";
import { useGetMyProfileQuery } from "@/src/store/Apis/ProfileApi";
import { AntDesign, Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Tabs from "expo-router/tabs";
import { useEffect } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

type TabBarIconProps = {
  color: string;
  focused: boolean;
  size: number;
};

export default function TabsLayout() {
  const { mode: theme, accent } = useSelector((state: RootState) => state.theme);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const token = useSelector((state: RootState) => state.auth.token);
  const { data: profile, isSuccess } = useGetMyProfileQuery(undefined, {
    skip: !token,
  });

  // Unread messages count for chat badge
  const { data: unreadData } = useGetUnreadCountQuery(undefined, {
    skip: !token,
    pollingInterval: 30_000,
  });
  const unreadCount = unreadData?.count ?? 0;

  // Redirect to profile completion if not yet completed
  useEffect(() => {
    if (isSuccess && profile && !profile.profileCompletedAt) {
      router.replace("/Auth/complete-profile" as any);
    }
  }, [isSuccess, profile]);

  const inactiveColor = theme === "dark" ? "#aaa" : "#666";
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
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "600",
          },
        }}
      >
        {/* Home â€” Discovery */}
        <Tabs.Screen
          name="index"
          options={{
            title: "Discover",
            tabBarIcon: ({ color }: TabBarIconProps) => (
              <AntDesign name="home" size={24} color={color} />
            ),
          }}
        />

        {/* Matches */}
        <Tabs.Screen
          name="matches"
          options={{
            title: "Matches",
            tabBarIcon: ({ color }: TabBarIconProps) => (
              <MaterialCommunityIcons name="heart" size={24} color={color} />
            ),
          }}
        />

        {/* Chats â€” with unread badge */}
        <Tabs.Screen
          name="chats"
          options={{
            title: "Messages",
            tabBarBadge: unreadCount > 0 ? (unreadCount > 99 ? "99+" : unreadCount) : undefined,
            tabBarBadgeStyle: { backgroundColor: accent, fontSize: 10 },
            tabBarIcon: ({ color }: TabBarIconProps) => (
              <Ionicons name="chatbubbles" size={24} color={color} />
            ),
          }}
        />

        {/* Notifications */}
        <Tabs.Screen
          name="notifications"
          options={{
            title: "Alerts",
            tabBarIcon: ({ color }: TabBarIconProps) => (
              <Ionicons name="notifications" size={24} color={color} />
            ),
          }}
        />

        {/* Profile */}
        <Tabs.Screen
          name="profile"
          options={{
            title: "Me",
            tabBarIcon: ({ color }: TabBarIconProps) => (
              <Feather name="user" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </ThemedWrapper>
  );
}
