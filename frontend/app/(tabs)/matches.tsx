import { Loading } from "@/components/ui";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useBlockUserMutation } from "@/src/store/Apis/BlocksApi";
import { ExploreUser, useGetRecommendationsQuery } from "@/src/store/Apis/ExploreApi";
import { useUnfollowUserMutation } from "@/src/store/Apis/UsersApi";
import { useGetVibesQuery } from "@/src/store/Apis/VibesApi";
import { expoLogger as logger } from "@/src/utils/logger";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const VIEWED_KEY = "matches_viewed_ids";

// ─── Ascending bar-chart stat (matches design spec) ──────────────────────────
const BarStat: React.FC<{
  label: string;
  value: number;
  max?: number;
  color: string;
  subtext: string;
}> = ({ label, value, max = 100, color, subtext }) => {
  const bars = 4;
  const filled = Math.max(1, Math.round((Math.min(value, max) / max) * bars));
  return (
    <View style={barStyles.col}>
      <View style={barStyles.bars}>
        {Array.from({ length: bars }, (_, i) => (
          <View
            key={`${label}-bar-${i}`}
            style={[
              barStyles.bar,
              {
                height: 5 + i * 4,
                backgroundColor: i < filled ? color : "#d1d5db",
              },
            ]}
          />
        ))}
      </View>
      <Text style={[barStyles.num, { color }]}>{value}</Text>
      <Text style={[barStyles.lbl, { color: subtext }]}>{label}</Text>
    </View>
  );
};

const barStyles = StyleSheet.create({
  col: { alignItems: "center", flex: 1 },
  bars: { flexDirection: "row", alignItems: "flex-end", gap: 3, height: 20 },
  bar: { width: 6, borderRadius: 2 },
  num: { fontSize: 13, fontWeight: "700", marginTop: 4 },
  lbl: { fontSize: 11, marginTop: 1, textAlign: "center" },
});

// ─── Detail stats (vibes fetched inside) ─────────────────────────────────────
const MatchDetailStats: React.FC<{
  user: ExploreUser;
  accent: string;
  subtext: string;
  divider: string;
  text: string;
}> = ({ user, accent, subtext, divider, text }) => {
  const { data: vibeData } = useGetVibesQuery(user.id);
  const total = vibeData?.allCounts?.reduce((s, v) => s + v.count, 0) ?? 0;
  const vibePct = Math.min(99, total * 8);
  const responseScore = Math.min(99, total * 5);

  return (
    <View style={[dtStyles.row, { borderTopColor: divider, borderBottomColor: divider }]}>
      {/* Posts — not clickable */}
      <View style={dtStyles.col}>
        <View style={dtStyles.postsWrap}>
          <MaterialCommunityIcons name="post-outline" size={15} color={text} />
          <Text style={[dtStyles.postsNum, { color: text }]}>
            {user._count?.posts ?? 0}
          </Text>
        </View>
        <Text style={[dtStyles.postsLbl, { color: subtext }]}>Posts</Text>
        <Text style={[dtStyles.notClick, { color: subtext }]}>*Not clickable*</Text>
      </View>

      <View style={[dtStyles.divider, { backgroundColor: divider }]} />

      {/* Response Speed — bar chart */}
      <BarStat label="Response Speed" value={responseScore} color="#f59e0b" subtext={subtext} />

      <View style={[dtStyles.divider, { backgroundColor: divider }]} />

      {/* Vibe Score — bar chart */}
      <BarStat label="Vibe Score" value={vibePct} color={accent} subtext={subtext} />
    </View>
  );
};

const dtStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    marginVertical: 12,
  },
  col: { alignItems: "center", flex: 1 },
  divider: { width: 1, height: 40, marginHorizontal: 4 },
  postsWrap: { flexDirection: "row", alignItems: "center", gap: 4 },
  postsNum: { fontSize: 15, fontWeight: "700" },
  postsLbl: { fontSize: 11, marginTop: 3 },
  notClick: { fontSize: 10, fontStyle: "italic", marginTop: 1 },
});

// ─── Bottom-sheet detail modal ────────────────────────────────────────────────
const MatchDetailSheet: React.FC<{
  user: ExploreUser;
  onClose: () => void;
  onUnmatch: () => void;
}> = ({ user, onClose, onUnmatch }) => {
  const router = useRouter();
  const { colors, accent, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [unfollowUser] = useUnfollowUserMutation();
  const [blockUser] = useBlockUserMutation();

  const bg = isDark ? "#111827" : "#ffffff";
  const divider = isDark ? "#2a2a2a" : "#f0f0f0";
  const text = isDark ? "#f0f0f0" : "#111827";

  const handleUnmatch = () => {
    Alert.alert(
      "Unmatch",
      `Unmatch with ${user.username}? They won't appear anywhere on yours or their feed.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Unmatch",
          style: "destructive",
          onPress: async () => {
            try {
              await unfollowUser(user.id).unwrap();
              onClose();
              onUnmatch();
            } catch (e) {
              logger.error("Unmatch error:", e);
            }
          },
        },
      ]
    );
  };

  const handleBlock = () => {
    Alert.alert(
      "Block User",
      `Block ${user.username}? They won't be able to contact you.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Block",
          style: "destructive",
          onPress: async () => {
            try {
              await blockUser({ targetUserId: user.id }).unwrap();
              onClose();
              onUnmatch();
            } catch (e) {
              logger.error("Block error:", e);
            }
          },
        },
      ]
    );
  };

  const handleMessage = () => {
    onClose();
    router.push(`/conversation/${user.id}` as any);
  };

  const handleViewProfile = () => {
    onClose();
    router.push(`/user/${user.id}` as any);
  };

  const handleReport = () => {
    Alert.alert(
      "Report User",
      `Report ${user.username} for inappropriate behaviour?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Report",
          style: "destructive",
          onPress: () => {
            onClose();
            router.push(`/user/${user.id}` as any);
          },
        },
      ]
    );
  };

  return (
    <View style={[sheetStyles.sheet, { backgroundColor: bg }]}>
      {/* Drag handle */}
      <View style={[sheetStyles.handle, { backgroundColor: divider }]} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Math.max(32, insets.bottom + 16) }}>
        {/* Name - Age */}
        <Text style={[sheetStyles.name, { color: text }]}>
          {user.username}
          {user.age ? ` - ${user.age}` : ""}
        </Text>

        {/* Bio */}
        {user.bio ? (
          <Text style={[sheetStyles.detail, { color: colors.subtext }]}>{user.bio}</Text>
        ) : null}

        {/* Location */}
        {(user as any).location ? (
          <View style={sheetStyles.infoRow}>
            <Ionicons name="location-outline" size={14} color={colors.subtext} />
            <Text style={[sheetStyles.detail, { color: colors.subtext }]}>
              {[(user as any).location.city, (user as any).location.country]
                .filter(Boolean)
                .join(", ")}
            </Text>
          </View>
        ) : null}

        {/* What they're looking for */}
        {(user as any).lookingFor ? (
          <View style={sheetStyles.infoRow}>
            <Ionicons name="heart-outline" size={14} color={colors.subtext} />
            <Text style={[sheetStyles.detail, { color: colors.subtext }]}>
              {(user as any).lookingFor}
            </Text>
          </View>
        ) : null}

        {/* Stats: Posts | Response Speed | Vibe Score */}
        <MatchDetailStats
          user={user}
          accent={accent}
          subtext={colors.subtext}
          divider={divider}
          text={text}
        />

        {/* Row 1: Unmatch (outline) + Message (filled) + Blue ↑ arrow */}
        <View style={sheetStyles.actionsRow}>
          <TouchableOpacity
            style={[sheetStyles.btnHalf, { borderColor: "#374151", borderWidth: 1.5 }]}
            onPress={handleUnmatch}
            activeOpacity={0.75}
          >
            <Ionicons name="heart-dislike-outline" size={16} color={text} />
            <Text style={[sheetStyles.btnTxt, { color: text }]}>Unmatch</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[sheetStyles.btnHalf, { backgroundColor: accent }]}
            onPress={handleMessage}
            activeOpacity={0.8}
          >
            <Ionicons name="chatbubble" size={16} color="#fff" />
            <Text style={[sheetStyles.btnTxt, { color: "#fff" }]}>Message</Text>
          </TouchableOpacity>

          {/* Blue up-arrow — view profile + return path */}
          <TouchableOpacity
            style={[sheetStyles.arrowBtn, { backgroundColor: accent }]}
            onPress={handleViewProfile}
            activeOpacity={0.85}
          >
            <Ionicons name="arrow-up" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* View Profile → labeled full-width button */}
        <TouchableOpacity
          style={[sheetStyles.btnFull, { backgroundColor: colors.surface2, borderColor: colors.border, borderWidth: 1, marginTop: 10 }]}
          onPress={handleViewProfile}
          activeOpacity={0.8}
        >
          <Ionicons name="person-outline" size={16} color={accent} />
          <Text style={[sheetStyles.btnTxt, { color: accent }]}>View Profile</Text>
          <Ionicons name="arrow-forward" size={15} color={accent} />
        </TouchableOpacity>

        {/* Row 2: Unmatch (filled) — "Remove Post Here" */}
        <TouchableOpacity
          style={[sheetStyles.btnFull, { backgroundColor: accent, marginTop: 10 }]}
          onPress={handleUnmatch}
          activeOpacity={0.8}
        >
          <Text style={[sheetStyles.btnTxt, { color: "#fff" }]}>Unmatch</Text>
        </TouchableOpacity>
        <Text style={[sheetStyles.removeNote, { color: colors.subtext }]}>
          *Remove Post Here*
        </Text>

        {/* Block User + Report User — icon+text buttons (image 2 style) */}
        <View style={sheetStyles.actionsRow}>
          <TouchableOpacity
            style={[sheetStyles.btnHalf, { borderColor: colors.border, borderWidth: 1 }]}
            onPress={handleBlock}
            activeOpacity={0.75}
          >
            <Ionicons name="ban-outline" size={16} color={colors.subtext} />
            <Text style={[sheetStyles.btnTxt, { color: colors.subtext }]}>Block User</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[sheetStyles.btnHalf, { borderColor: "#f97316", borderWidth: 1 }]}
            onPress={handleReport}
            activeOpacity={0.75}
          >
            <Ionicons name="flag-outline" size={16} color="#f97316" />
            <Text style={[sheetStyles.btnTxt, { color: "#f97316" }]}>Report User</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const sheetStyles = StyleSheet.create({
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    maxHeight: "88%",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  name: { fontSize: 22, fontWeight: "700", marginBottom: 6 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 4 },
  detail: { fontSize: 14, lineHeight: 20, marginBottom: 2 },
  actionsRow: { flexDirection: "row", gap: 10, marginTop: 4 },
  btnHalf: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 30,
  },
  btnFull: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 30,
  },
  btnTxt: { fontSize: 15, fontWeight: "600" },
  arrowBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  removeNote: {
    fontSize: 12,
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 6,
    marginBottom: 14,
  },
  checkRow: {
    display: "none",
  },
  checkTxt: {
    display: "none",
  },
});

// ─── Compact list item (circular avatar + name + red dot) ────────────────────
const MatchListItem: React.FC<{
  item: ExploreUser;
  viewed: boolean;
  onPress: () => void;
}> = ({ item, viewed, onPress }) => {
  const { colors } = useAppTheme();
  return (
    <TouchableOpacity style={listStyles.item} onPress={onPress} activeOpacity={0.8}>
      <View style={listStyles.avatarWrap}>
        {item.avatarUrl ? (
          <Image
            source={{ uri: item.avatarUrl }}
            style={listStyles.avatar}
            contentFit="cover"
          />
        ) : (
          <View style={[listStyles.avatar, listStyles.avatarFallback]}>
            <Ionicons name="person" size={36} color="#ccc" />
          </View>
        )}
        {/* Red dot — profile not yet viewed */}
        {!viewed && <View style={listStyles.dot} />}
      </View>
      <Text style={[listStyles.name, { color: colors.text }]} numberOfLines={1}>
        {item.username}
      </Text>
    </TouchableOpacity>
  );
};

const listStyles = StyleSheet.create({
  item: { alignItems: "center", marginHorizontal: 10, marginBottom: 18, width: 80 },
  avatarWrap: { position: "relative" },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2.5,
    borderColor: "#e5e7eb",
  },
  avatarFallback: {
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#ef4444",
    borderWidth: 2,
    borderColor: "#fff",
  },
  name: { fontSize: 12, fontWeight: "500", marginTop: 6, textAlign: "center" },
});

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function MatchesScreen() {
  const { data, isLoading, refetch } = useGetRecommendationsQuery();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ExploreUser | null>(null);
  const [viewedIds, setViewedIds] = useState<Set<string>>(new Set());
  const { colors, accent } = useAppTheme();
  const insets = useSafeAreaInsets();

  // Load viewed IDs from AsyncStorage on mount
  useEffect(() => {
    AsyncStorage.getItem(VIEWED_KEY).then((raw) => {
      if (raw) setViewedIds(new Set(JSON.parse(raw)));
    });
  }, []);

  const markViewed = useCallback((id: string) => {
    setViewedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      AsyncStorage.setItem(VIEWED_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handlePress = (user: ExploreUser) => {
    markViewed(user.id);
    setSelectedUser(user);
  };

  if (isLoading && !data) return <Loading fullScreen text="Loading matches..." />;

  const matches = data?.users || [];

  return (
    <View style={[screenStyles.container, { backgroundColor: colors.surface2 }]}>
      {/* Header */}
      <View
        style={[
          screenStyles.header,
          { backgroundColor: colors.surface, borderBottomColor: colors.border, paddingTop: insets.top },
        ]}
      >
        <View>
          <Text style={[screenStyles.title, { color: colors.text }]}>Matches</Text>
          <Text style={[screenStyles.sub, { color: colors.subtext }]}>
            Only displays the profile picture
          </Text>
        </View>
        <TouchableOpacity onPress={onRefresh}>
          <Ionicons name="refresh-outline" size={24} color={accent} />
        </TouchableOpacity>
      </View>

      {/* Grid of circular avatars */}
      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        numColumns={4}
        contentContainerStyle={screenStyles.list}
        columnWrapperStyle={screenStyles.row}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={accent} />
        }
        renderItem={({ item }) => (
          <MatchListItem
            item={item}
            viewed={viewedIds.has(item.id)}
            onPress={() => handlePress(item)}
          />
        )}
        ListEmptyComponent={
          <View style={screenStyles.empty}>
            <MaterialCommunityIcons name="heart-off-outline" size={64} color="#d1d5db" />
            <Text style={[screenStyles.emptyTitle, { color: colors.text }]}>No matches yet</Text>
            <Text style={[screenStyles.emptySub, { color: colors.subtext }]}>
              Keep discovering — your matches will appear here
            </Text>
          </View>
        }
      />

      {/* Bottom-sheet modal */}
      <Modal
        visible={!!selectedUser}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedUser(null)}
      >
        <TouchableOpacity
          style={screenStyles.overlay}
          activeOpacity={1}
          onPress={() => setSelectedUser(null)}
        />
        {selectedUser && (
          <MatchDetailSheet
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onUnmatch={refetch}
          />
        )}
      </Modal>
    </View>
  );
}

const screenStyles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
  },
  title: { fontSize: 26, fontWeight: "700" },
  sub: { fontSize: 12, marginTop: 1 },
  list: { padding: 12, paddingBottom: 40 },
  row: { justifyContent: "flex-start" },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)" },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 100,
    gap: 12,
  },
  emptyTitle: { fontSize: 18, fontWeight: "600" },
  emptySub: { fontSize: 14, textAlign: "center", paddingHorizontal: 32 },
});

