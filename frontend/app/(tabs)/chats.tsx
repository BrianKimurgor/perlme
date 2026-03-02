import { Avatar, Loading } from "@/components/ui";
import { Conversation, useGetConversationListQuery } from "@/src/store/Apis/MessagesApi";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ChatsScreen() {
  const router = useRouter();
  const { data: conversations, isLoading, error, refetch } = useGetConversationListQuery();
  const [refreshing, setRefreshing] = useState(false);

  // Debug logging
  React.useEffect(() => {
    console.log("=== CHATS DEBUG ===");
    console.log("Conversations data:", JSON.stringify(conversations, null, 2));
    console.log("Conversations type:", typeof conversations);
    console.log("Conversations is array:", Array.isArray(conversations));
    console.log("Conversations length:", conversations?.length);
    console.log("Loading:", isLoading);
    console.log("Error:", JSON.stringify(error, null, 2));
    console.log("===================");
  }, [conversations, isLoading, error]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
    return date.toLocaleDateString();
  };

  const renderConversation = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => router.push(`/conversation/${item.otherUser.id}`)}
    >
      <Avatar
        uri={item.otherUser.avatarUrl}
        name={item.otherUser.username}
        size={56}
        showOnlineBadge
        isOnline={item.otherUser.isOnline}
      />
      <View style={styles.conversationInfo}>
        <View style={styles.header}>
          <Text style={styles.username}>{item.otherUser.username}</Text>
          {item.lastMessage && (
            <Text style={styles.time}>
              {formatTimeAgo(item.lastMessage.createdAt)}
            </Text>
          )}
        </View>
        {item.lastMessage && (
          <Text
            style={[
              styles.lastMessage,
              item.unreadCount > 0 && styles.unreadMessage,
            ]}
            numberOfLines={1}
          >
            {item.lastMessage.content}
          </Text>
        )}
      </View>
      {item.unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {item.unreadCount > 99 ? "99+" : item.unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (isLoading && !conversations) {
    return <Loading fullScreen text="Loading chats..." />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Messages</Text>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#FF3B30" />
          <Text style={styles.errorTitle}>Failed to load conversations</Text>
          <Text style={styles.errorMessage}>
            {(error as any)?.data?.message || (error as any)?.error || "Network error. Is the backend running?"}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity>
          <Ionicons name="create-outline" size={28} color="#ff3366" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={conversations || []}
        renderItem={renderConversation}
        keyExtractor={(item) => item.otherUser.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#ff3366"
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="chatbubbles-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyText}>No messages yet</Text>
            <Text style={styles.emptySubtext}>
              Start a conversation with someone
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  listContent: {
    paddingVertical: 8,
  },
  conversationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f3f4f6",
  },
  conversationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  time: {
    fontSize: 12,
    color: "#9ca3af",
  },
  lastMessage: {
    fontSize: 14,
    color: "#6b7280",
  },
  unreadMessage: {
    fontWeight: "600",
    color: "#111827",
  },
  badge: {
    backgroundColor: "#ff3366",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6b7280",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: "#ff3366",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
