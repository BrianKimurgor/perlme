import ThemedWrapper from "@/src/components/ThemedWrapper";
import { RootState } from "@/src/store";
import { AntDesign, Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Tabs from "expo-router/tabs";
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
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom,
          },
        }}
      >
        {/* Home */}
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
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

        {/* Chats */}
        <Tabs.Screen
          name="chats"
          options={{
            title: "Chats",
            tabBarIcon: ({ color }: TabBarIconProps) => (
              <Ionicons name="chatbubbles" size={24} color={color} />
            ),
          }}
        />

        {/* Profile */}
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }: TabBarIconProps) => (
              <Feather name="user" size={24} color={color} />
            ),
          }}
        />

        {/* More */}
        <Tabs.Screen
          name="more"
          options={{
            title: "More",
            tabBarIcon: ({ color }: TabBarIconProps) => (
              <Ionicons name="ellipsis-horizontal" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </ThemedWrapper>
  );
}
