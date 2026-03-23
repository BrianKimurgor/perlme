import { ProfileSwipeCard, SwipeCardUser } from "@/components/ProfileSwipeCard";
import { StoryBar } from "@/components/StoryBar";
import { Loading } from "@/components/ui";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { ExploreUser, useGetRecommendationsQuery } from "@/src/store/Apis/ExploreApi";
import {
  useFollowUserMutation,
} from "@/src/store/Apis/UsersApi";
import { expoLogger as logger } from "@/src/utils/logger";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const { width: SCREEN_W } = Dimensions.get("window");
const GRID_ITEM_W = (SCREEN_W - 48) / 2;

// ─── Mini profile card for the Discovery Feed grid ─────────────────────────
const DiscoveryGridItem: React.FC<{
  user: ExploreUser;
  onPress: () => void;
  isDark: boolean;
  accent: string;
}> = ({ user, onPress, isDark, accent }) => (
  <TouchableOpacity
    style={[
      styles.gridItem,
      { backgroundColor: isDark ? "#1e1e1e" : "#fff" },
    ]}
    onPress={onPress}
    activeOpacity={0.82}
  >
    {user.avatarUrl ? (
      <Image
        source={{ uri: user.avatarUrl }}
        style={styles.gridPhoto}
        contentFit="cover"
      />
    ) : (
      <View style={[styles.gridPhoto, { backgroundColor: isDark ? "#2a2a2a" : "#e8e8e8", alignItems: "center", justifyContent: "center" }]}>
        <Ionicons name="person" size={40} color={isDark ? "#555" : "#bbb"} />
      </View>
    )}
    <LinearGradient
      colors={["transparent", "rgba(0,0,0,0.75)"]}
      style={styles.gridGradient}
      pointerEvents="none"
    >
      <Text style={styles.gridName} numberOfLines={1}>
        {user.username}
        {user.age ? `, ${user.age}` : ""}
      </Text>
      {user.distance != null && (
        <Text style={styles.gridDistance}>{user.distance} km</Text>
      )}
    </LinearGradient>
  </TouchableOpacity>
);

// ─── Empty state card ──────────────────────────────────────────────────────
const AllSeenCard: React.FC<{ isDark: boolean; accent: string; onRefresh: () => void }> = ({
  isDark,
  accent,
  onRefresh,
}) => (
  <View style={[styles.allSeenCard, { backgroundColor: isDark ? "#1e1e1e" : "#fff" }]}>
    <MaterialCommunityIcons name="heart-search" size={60} color={accent} />
    <Text style={[styles.allSeenTitle, { color: isDark ? "#f0f0f0" : "#111" }]}>
      You've seen everyone!
    </Text>
    <Text style={[styles.allSeenSub, { color: isDark ? "#aaa" : "#777" }]}>
      Check back later for new people nearby.
    </Text>
    <TouchableOpacity
      style={[styles.refreshBtn, { backgroundColor: accent }]}
      onPress={onRefresh}
    >
      <Text style={styles.refreshBtnText}>Refresh</Text>
    </TouchableOpacity>
  </View>
);

// ─── Main Home Screen ──────────────────────────────────────────────────────
export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, accent, isDark } = useAppTheme();

  const { data, isLoading, refetch } = useGetRecommendationsQuery();
  const [followUser] = useFollowUserMutation();

  const [refreshing, setRefreshing] = useState(false);
  const [profileIndex, setProfileIndex] = useState(0);
  const [swipeHistory, setSwipeHistory] = useState<number[]>([]);

  const scrollY = useRef(new Animated.Value(0)).current;

  const profiles: ExploreUser[] = data?.users ?? [];
  const currentProfile = profiles[profileIndex];
  const storyUsers = profiles.slice(0, 14);
  const feedProfiles = profiles.filter((_, i) => i !== profileIndex);
  const noMoreProfiles = profiles.length > 0 && profileIndex >= profiles.length;

  // ─── Scroll-based hero card shrink ────────────────────────────────────────
  const heroOpacity = scrollY.interpolate({
    inputRange: [0, 160],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });
  const heroScale = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0.88],
    extrapolate: "clamp",
  });
  const heroTranslateY = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, -30],
    extrapolate: "clamp",
  });

  // ─── Swipe handlers ───────────────────────────────────────────────────────
  const advance = useCallback(() => {
    setSwipeHistory((prev) => [...prev, profileIndex]);
    setProfileIndex((prev) => prev + 1);
  }, [profileIndex]);

  const handleSwipeLeft = useCallback(() => {
    advance();
  }, [advance]);

  const handleSwipeRight = useCallback(async () => {
    if (currentProfile) {
      try {
        await followUser(currentProfile.id).unwrap();
      } catch (e: any) {
        // ignore "already following" errors silently
        if (e?.data?.message !== "Already following this user") {
          logger.error("Follow failed:", e);
        }
      }
    }
    advance();
  }, [currentProfile, advance, followUser]);

  const handleRewind = useCallback(() => {
    if (swipeHistory.length === 0) return;
    const last = swipeHistory[swipeHistory.length - 1];
    setSwipeHistory((prev) => prev.slice(0, -1));
    setProfileIndex(last);
  }, [swipeHistory]);

  const handleSuperlike = useCallback(async () => {
    if (currentProfile) {
      try {
        await followUser(currentProfile.id).unwrap();
      } catch (_) {}
    }
    advance();
    Toast.show({ type: "success", text1: "⭐ Superlike sent!", position: "top" });
  }, [currentProfile, advance, followUser]);

  const handleSpotlight = useCallback(() => {
    Toast.show({
      type: "info",
      text1: "⚡ Spotlight",
      text2: "Coming soon — Premium feature!",
      position: "top",
    });
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    setProfileIndex(0);
    setSwipeHistory([]);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading && profiles.length === 0) {
    return <Loading fullScreen text="Finding people near you..." />;
  }

  const toSwipeUser = (u: ExploreUser): SwipeCardUser => ({
    id: u.id,
    username: u.username,
    avatarUrl: u.avatarUrl,
    age: u.age,
    distance: u.distance,
    bio: u.bio,
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* ─── Top Header ─────────────────────────────────────────────── */}
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
        <Text style={[styles.brandText, { color: accent }]}>perlme</Text>
        <TouchableOpacity onPress={() => router.push("/settings/manage" as any)}>
          <Ionicons name="options-outline" size={24} color={accent} />
        </TouchableOpacity>
      </View>

      {/* ─── Scrollable body ────────────────────────────────────────── */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={accent} />
        }
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* ─── Stories ──────────────────────────────────────────────── */}
        <View
          style={[
            styles.storiesContainer,
            {
              backgroundColor: colors.surface,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <StoryBar
            users={storyUsers}
            onPress={(id) => router.push(`/user/${id}` as any)}
            isDark={isDark}
          />
        </View>

        {/* ─── Hero Swipe Card ──────────────────────────────────────── */}
        <Animated.View
          style={{
            opacity: heroOpacity,
            transform: [{ scale: heroScale }, { translateY: heroTranslateY }],
          }}
        >
          {noMoreProfiles ? (
            <AllSeenCard isDark={isDark} accent={accent} onRefresh={onRefresh} />
          ) : currentProfile ? (
            <ProfileSwipeCard
              user={toSwipeUser(currentProfile)}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
              onRewind={handleRewind}
              onSuperlike={handleSuperlike}
              onSpotlight={handleSpotlight}
              onNope={handleSwipeLeft}
              onLike={handleSwipeRight}
              isDark={isDark}
              accent={accent}
              canRewind={swipeHistory.length > 0}
            />
          ) : (
            <AllSeenCard isDark={isDark} accent={accent} onRefresh={onRefresh} />
          )}
        </Animated.View>

        {/* ─── Discovery Feed Section ───────────────────────────────── */}
        {feedProfiles.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Daily Picks
              </Text>
              <Text style={[styles.sectionCount, { color: colors.subtext }]}>
                {feedProfiles.length} people
              </Text>
            </View>

            <View style={styles.grid}>
              {feedProfiles.map((user) => (
                <DiscoveryGridItem
                  key={user.id}
                  user={user}
                  onPress={() => router.push(`/user/${user.id}` as any)}
                  isDark={isDark}
                  accent={accent}
                />
              ))}
            </View>
          </>
        )}
      </Animated.ScrollView>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  brandText: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  storiesContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  sectionCount: {
    fontSize: 13,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    gap: 12,
  },
  gridItem: {
    width: GRID_ITEM_W,
    height: GRID_ITEM_W * 1.35,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  gridPhoto: {
    width: "100%",
    height: "100%",
  },
  gridGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  gridName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
  },
  gridDistance: {
    fontSize: 11,
    color: "rgba(255,255,255,0.75)",
    marginTop: 2,
  },
  allSeenCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    minHeight: Dimensions.get("window").height * 0.48,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  allSeenTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginTop: 16,
    textAlign: "center",
  },
  allSeenSub: {
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },
  refreshBtn: {
    marginTop: 22,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 30,
  },
  refreshBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});

