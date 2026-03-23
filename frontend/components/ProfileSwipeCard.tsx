import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  GestureResponderEvent,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const CARD_HEIGHT = SCREEN_H * 0.60;
const SWIPE_THRESHOLD = SCREEN_W * 0.25;

// ─── Types ─────────────────────────────────────────────────────────────────
export interface SwipeCardUser {
  id: string;
  username: string;
  avatarUrl: string | null;
  photos?: string[];
  age?: number;
  distance?: number;
  bio?: string | null;
  location?: string;
  isVerified?: boolean;
}

interface ProfileSwipeCardProps {
  user: SwipeCardUser;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onRewind: () => void;
  onSuperlike: () => void;
  onSpotlight: () => void;
  onNope: () => void;
  onLike: () => void;
  isDark: boolean;
  accent: string;
  canRewind?: boolean;
}

// ─── Component ─────────────────────────────────────────────────────────────
export const ProfileSwipeCard: React.FC<ProfileSwipeCardProps> = ({
  user,
  onSwipeLeft,
  onSwipeRight,
  onRewind,
  onSuperlike,
  onSpotlight,
  onNope,
  onLike,
  isDark,
  accent,
  canRewind = false,
}) => {
  // Keep latest callbacks in refs so PanResponder closure is always fresh
  const onSwipeLeftRef = useRef(onSwipeLeft);
  const onSwipeRightRef = useRef(onSwipeRight);
  useEffect(() => { onSwipeLeftRef.current = onSwipeLeft; }, [onSwipeLeft]);
  useEffect(() => { onSwipeRightRef.current = onSwipeRight; }, [onSwipeRight]);

  const photos = user.photos?.length
    ? user.photos
    : user.avatarUrl
      ? [user.avatarUrl]
      : [];

  const [photoIndex, setPhotoIndex] = useState(0);

  // Reset photo + pan when user changes
  useEffect(() => {
    setPhotoIndex(0);
    pan.setValue({ x: 0, y: 0 });
  }, [user.id]);

  // ─── Pan animation ───────────────────────────────────────────────────────
  const pan = useRef(new Animated.ValueXY()).current;
  const isDragging = useRef(false);
  const isSwiping = useRef(false);

  const cardRotation = pan.x.interpolate({
    inputRange: [-SCREEN_W / 2, 0, SCREEN_W / 2],
    outputRange: ["-10deg", "0deg", "10deg"],
    extrapolate: "clamp",
  });

  const likeOpacity = pan.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const nopeOpacity = pan.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const animateSwipe = useCallback(
    (direction: "left" | "right") => {
      if (isSwiping.current) return;
      isSwiping.current = true;
      const targetX = direction === "right" ? SCREEN_W * 1.6 : -SCREEN_W * 1.6;
      Animated.timing(pan, {
        toValue: { x: targetX, y: 0 },
        duration: 280,
        useNativeDriver: false,
      }).start(() => {
        pan.setValue({ x: 0, y: 0 });
        isSwiping.current = false;
        isDragging.current = false;
        if (direction === "right") onSwipeRightRef.current();
        else onSwipeLeftRef.current();
      });
    },
    [pan]
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gs) => {
        if (isSwiping.current) return false;
        return Math.abs(gs.dx) > 6 && Math.abs(gs.dx) > Math.abs(gs.dy);
      },
      onPanResponderGrant: () => {
        isDragging.current = false;
      },
      onPanResponderMove: (_, gs) => {
        isDragging.current = true;
        pan.setValue({ x: gs.dx, y: 0 });
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dx > SWIPE_THRESHOLD || gs.vx > 0.8) {
          animateSwipe("right");
        } else if (gs.dx < -SWIPE_THRESHOLD || gs.vx < -0.8) {
          animateSwipe("left");
        } else {
          isDragging.current = false;
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
            friction: 6,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        isDragging.current = false;
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
          friction: 6,
        }).start();
      },
    })
  ).current;

  // ─── Photo tap ───────────────────────────────────────────────────────────
  const handlePhotoTap = (evt: GestureResponderEvent) => {
    if (isDragging.current) return;
    const { locationX } = evt.nativeEvent;
    if (locationX < SCREEN_W / 2) {
      setPhotoIndex((i) => Math.max(0, i - 1));
    } else {
      setPhotoIndex((i) => Math.min(photos.length - 1, i + 1));
    }
  };

  const currentPhoto = photos[photoIndex] ?? null;

  // ─── Action button handlers (also trigger swipe animation) ───────────────
  const handleLikeBtn = () => {
    if (isSwiping.current) return;
    animateSwipe("right");
  };

  const handleNopeBtn = () => {
    if (isSwiping.current) return;
    animateSwipe("left");
  };

  const handleSuper = () => {
    if (isSwiping.current) return;
    onSuperlike();
    animateSwipe("right");
  };

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <View style={styles.wrapper}>
      <Animated.View
        style={[
          styles.card,
          {
            transform: [
              { translateX: pan.x },
              { rotate: cardRotation },
            ],
          },
        ]}
        {...panResponder.panHandlers}
      >
        {/* Photo */}
        <TouchableOpacity
          activeOpacity={1}
          style={StyleSheet.absoluteFill}
          onPress={handlePhotoTap}
        >
          {currentPhoto ? (
            <Image
              source={{ uri: currentPhoto }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
            />
          ) : (
            <View style={[styles.noPhoto, { backgroundColor: isDark ? "#2a2a2a" : "#e0e0e0" }]}>
              <Ionicons name="person" size={80} color={isDark ? "#555" : "#aaa"} />
            </View>
          )}
        </TouchableOpacity>

        {/* Photo progress dots */}
        {photos.length > 1 && (
          <View style={styles.dots}>
            {photos.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  { backgroundColor: i === photoIndex ? "#fff" : "rgba(255,255,255,0.45)" },
                ]}
              />
            ))}
          </View>
        )}

        {/* LIKE stamp */}
        <Animated.View style={[styles.stamp, styles.likeStamp, { opacity: likeOpacity }]}>
          <Text style={styles.stampLikeText}>LIKE</Text>
        </Animated.View>

        {/* NOPE stamp */}
        <Animated.View style={[styles.stamp, styles.nopeStamp, { opacity: nopeOpacity }]}>
          <Text style={styles.stampNopeText}>NOPE</Text>
        </Animated.View>

        {/* Bottom gradient overlay */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.22)", "rgba(0,0,0,0.82)"]}
          style={styles.gradient}
          pointerEvents="none"
        >
          {/* User info */}
          <View style={styles.infoRow}>
            <View style={{ flex: 1 }}>
              <View style={styles.nameRow}>
                <Text style={styles.nameText}>
                  {user.username}
                  {user.age ? `, ${user.age}` : ""}
                </Text>
                {user.isVerified && (
                  <Ionicons name="checkmark-circle" size={20} color="#4fc3f7" style={{ marginLeft: 6 }} />
                )}
              </View>
              {(user.location || user.distance != null) && (
                <View style={styles.locationRow}>
                  <Ionicons name="location-outline" size={13} color="rgba(255,255,255,0.85)" />
                  <Text style={styles.locationText}>
                    {user.location
                      ? user.location
                      : user.distance != null
                        ? `${user.distance} km away`
                        : ""}
                  </Text>
                </View>
              )}
              {user.bio ? (
                <Text style={styles.bioText} numberOfLines={2}>{user.bio}</Text>
              ) : null}
            </View>
          </View>

          {/* Floating action buttons */}
          <BlurView
            intensity={isDark ? 55 : 40}
            tint={isDark ? "dark" : "light"}
            style={styles.actionBar}
          >
            {/* Rewind */}
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnSm]}
              onPress={onRewind}
              activeOpacity={0.75}
              disabled={!canRewind}
            >
              <MaterialCommunityIcons
                name="restore"
                size={22}
                color={canRewind ? "#f5a623" : "rgba(245,166,35,0.35)"}
              />
            </TouchableOpacity>

            {/* Nope */}
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnMd]}
              onPress={handleNopeBtn}
              activeOpacity={0.75}
            >
              <Ionicons name="close" size={30} color="#f44" />
            </TouchableOpacity>

            {/* Superlike */}
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnSm]}
              onPress={handleSuper}
              activeOpacity={0.75}
            >
              <Ionicons name="star" size={22} color="#4fc3f7" />
            </TouchableOpacity>

            {/* Like */}
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnMd]}
              onPress={handleLikeBtn}
              activeOpacity={0.75}
            >
              <Ionicons name="heart" size={28} color={accent} />
            </TouchableOpacity>

            {/* Spotlight */}
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnSm]}
              onPress={onSpotlight}
              activeOpacity={0.75}
            >
              <MaterialCommunityIcons name="lightning-bolt" size={22} color="#a855f7" />
            </TouchableOpacity>
          </BlurView>
        </LinearGradient>
      </Animated.View>
    </View>
  );
};

// ─── Styles ────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  wrapper: {
    width: SCREEN_W,
    height: CARD_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  card: {
    width: SCREEN_W - 32,
    height: CARD_HEIGHT - 8,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#222",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  noPhoto: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dots: {
    position: "absolute",
    top: 12,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
    zIndex: 2,
  },
  dot: {
    width: 28,
    height: 4,
    borderRadius: 2,
  },
  stamp: {
    position: "absolute",
    top: 40,
    borderWidth: 3,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    zIndex: 10,
  },
  likeStamp: {
    left: 18,
    borderColor: "#4caf50",
    transform: [{ rotate: "-20deg" }],
  },
  nopeStamp: {
    right: 18,
    borderColor: "#f44336",
    transform: [{ rotate: "20deg" }],
  },
  stampLikeText: {
    fontSize: 26,
    fontWeight: "900",
    color: "#4caf50",
    letterSpacing: 2,
  },
  stampNopeText: {
    fontSize: 26,
    fontWeight: "900",
    color: "#f44336",
    letterSpacing: 2,
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 70,
    paddingBottom: 0,
  },
  infoRow: {
    paddingHorizontal: 18,
    paddingBottom: 14,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  nameText: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
    gap: 3,
  },
  locationText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
  },
  bioText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.80)",
    marginTop: 5,
    lineHeight: 18,
  },
  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255,255,255,0.15)",
    overflow: "hidden",
  },
  actionBtn: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.25)",
  },
  actionBtnSm: {
    width: 48,
    height: 48,
  },
  actionBtnMd: {
    width: 60,
    height: 60,
  },
});
