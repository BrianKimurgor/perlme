import { useAppTheme } from "@/src/hooks/useAppTheme";
import {
  type Notification,
  useGetNotificationsQuery,
  useGetUnreadNotifCountQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from "@/src/store/Apis/NotificationsApi";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// â”€â”€â”€ Icon helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ICON_BG: Record<string, string> = {
  LIKE: "#e91e63",
  MATCH: "#9c27b0",
  FOLLOW: "#7c4dff",
  COMMENT: "#ff6d00",
  REPOST: "#00bfa5",
  MESSAGE: "#00bcd4",
  SUPERLIKE: "#2196f3",
  TIP: "#ffd600",
  SUBSCRIPTION: "#43a047",
  ADMIN_MESSAGE: "#f44336",
  default: "#9e9e9e",
};

const NotifTypeIcon = ({ type, accent }: { type: string; accent: string }) => {
  switch (type) {
    case "LIKE":
      return <Ionicons name="heart" size={20} color="#fff" />;
    case "MATCH":
      return <Ionicons name="heart-circle" size={20} color="#fff" />;
    case "FOLLOW":
      return <Ionicons name="person-add" size={20} color="#fff" />;
    case "COMMENT":
      return <Ionicons name="chatbubble" size={20} color="#fff" />;
    case "REPOST":
      return <MaterialCommunityIcons name="repeat" size={20} color="#fff" />;
    case "MESSAGE":
      return <Ionicons name="mail" size={20} color="#fff" />;
    case "TIP":
      return <Ionicons name="gift" size={20} color="#fff" />;
    case "SUBSCRIPTION":
      return <Ionicons name="checkmark-circle" size={20} color="#fff" />;
    case "ADMIN_MESSAGE":
      return <Ionicons name="shield" size={20} color="#fff" />;
    default:
      return <Ionicons name="notifications" size={20} color="#fff" />;
  }
};

const timeAgo = (isoDate: string): string => {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(isoDate).toLocaleDateString();
};

export default function NotificationsScreen() {
  const { colors, accent, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();

  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetNotificationsQuery({ page: 1, limit: 50 });

  const { data: unreadData } = useGetUnreadNotifCountQuery(undefined, {
    pollingInterval: 30000,
  });

  const [markRead] = useMarkNotificationReadMutation();
  const [markAllRead] = useMarkAllNotificationsReadMutation();

  const notifications = data?.notifications ?? [];
  const unreadCount = unreadData?.count ?? 0;

  const unread = notifications.filter((n) => !n.isRead);
  const earlier = notifications.filter((n) => n.isRead);

  const handleMarkRead = useCallback(
    (id: string) => {
      markRead(id);
    },
    [markRead]
  );

  const handleMarkAllRead = useCallback(() => {
    markAllRead();
  }, [markAllRead]);

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color={accent} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.bg }]}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.subtext} />
        <Text style={[styles.emptyText, { color: colors.subtext }]}>
          Failed to load notifications
        </Text>
        <TouchableOpacity onPress={refetch} style={[styles.retryBtn, { borderColor: accent }]}>
          <Text style={{ color: accent, fontWeight: "600" }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.border,
            paddingTop: insets.top,
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
        {unreadCount > 0 && (
          <View style={[styles.headerBadge, { backgroundColor: accent }]}>
            <Text style={styles.headerBadgeText}>{unreadCount}</Text>
          </View>
        )}
        {unreadCount > 0 && (
          <TouchableOpacity
            onPress={handleMarkAllRead}
            style={styles.markAllBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={[styles.markAllText, { color: accent }]}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
            tintColor={accent}
            colors={[accent]}
          />
        }
      >
        {/* Empty state */}
        {notifications.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={56} color={colors.subtext} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No notifications yet</Text>
            <Text style={[styles.emptyText, { color: colors.subtext }]}>
              When someone follows you, likes your post, or sends you a message, it'll show up here.
            </Text>
          </View>
        )}

        {/* Section: New (unread) */}
        {unread.length > 0 && (
          <>
            <Text style={[styles.sectionLabel, { color: colors.sectionLabel }]}>NEW</Text>
            {unread.map((notif) => (
              <NotifRow
                key={notif.id}
                notif={notif}
                colors={colors}
                isDark={isDark}
                isUnread
                onPress={() => handleMarkRead(notif.id)}
              />
            ))}
          </>
        )}

        {/* Section: Earlier (read) */}
        {earlier.length > 0 && (
          <>
            <Text style={[styles.sectionLabel, { color: colors.sectionLabel }]}>EARLIER</Text>
            {earlier.map((notif) => (
              <NotifRow
                key={notif.id}
                notif={notif}
                colors={colors}
                isDark={isDark}
                isUnread={false}
                onPress={() => { }}
              />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

// â”€â”€â”€ Notification row â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const NotifRow: React.FC<{
  notif: Notification;
  colors: ReturnType<typeof useAppTheme>["colors"];
  isDark: boolean;
  isUnread: boolean;
  onPress: () => void;
}> = ({ notif, colors, isDark, isUnread, onPress }) => (
  <TouchableOpacity
    style={[
      styles.notifRow,
      {
        backgroundColor: isUnread
          ? isDark
            ? "rgba(255,51,102,0.08)"
            : "rgba(255,51,102,0.04)"
          : colors.surface,
        borderBottomColor: colors.border,
      },
    ]}
    activeOpacity={0.7}
    onPress={onPress}
  >
    <View style={[styles.notifIcon, { backgroundColor: ICON_BG[notif.type] ?? ICON_BG.default }]}>
      <NotifTypeIcon type={notif.type} accent="#fff" />
    </View>
    <View style={styles.notifContent}>
      <View style={styles.notifTitleRow}>
        {notif.actor?.username ? (
          <Text style={[styles.notifTitle, { color: colors.text }]} numberOfLines={1}>
            <Text style={{ fontWeight: "800" }}>{notif.actor.username} </Text>
            {notif.message}
          </Text>
        ) : (
          <Text style={[styles.notifTitle, { color: colors.text }]} numberOfLines={1}>
            {notif.message}
          </Text>
        )}
        {isUnread && <View style={styles.unreadDot} />}
      </View>
      <Text style={[styles.notifTime, { color: colors.sectionLabel }]}>
        {timeAgo(notif.createdAt)}
      </Text>
    </View>
  </TouchableOpacity>
);

// â”€â”€â”€ Styles â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    flex: 1,
  },
  headerBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  headerBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  markAllBtn: {
    paddingVertical: 4,
  },
  markAllText: {
    fontSize: 13,
    fontWeight: "600",
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  notifRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 14,
  },
  notifIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  notifContent: {
    flex: 1,
  },
  notifTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  notifTitle: {
    fontSize: 15,
    fontWeight: "500",
    flex: 1,
    lineHeight: 20,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#e91e63",
    flexShrink: 0,
  },
  notifTime: {
    fontSize: 12,
    marginTop: 5,
  },
  emptyContainer: {
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  retryBtn: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
  },
});

