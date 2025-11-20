import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const { height, width } = Dimensions.get("window");

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bgAnim = useRef(new Animated.Value(0)).current;
  const textSlide = useRef(new Animated.Value(30)).current;
  const textFade = useRef(new Animated.Value(0)).current;
  const mottoFade = useRef(new Animated.Value(0)).current;
  const mottoSlide = useRef(new Animated.Value(20)).current;

  const smallHearts = Array.from({ length: 5 }, () => ({
    x: new Animated.Value(Math.random() * width),
    y: new Animated.Value(height),
    opacity: new Animated.Value(0),
  }));

  const router = useRouter();

  useEffect(() => {
    // Background color transition loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(bgAnim, { toValue: 1, duration: 2000, useNativeDriver: false }),
        Animated.timing(bgAnim, { toValue: 0, duration: 2000, useNativeDriver: false }),
      ])
    ).start();

    // Main animation sequence
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, { toValue: 1.3, duration: 500, useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ]),
        { iterations: 2 }
      ),
      Animated.parallel([
        Animated.timing(textFade, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(textSlide, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(mottoFade, { toValue: 1, duration: 1000, delay: 200, useNativeDriver: true }),
        Animated.timing(mottoSlide, { toValue: 0, duration: 1000, delay: 200, useNativeDriver: true }),
      ]),
      Animated.delay(1000),
    ]).start(() => {
      // Simple navigation after animation (no auth)
      router.replace("/(tabs)");
    });

    // Floating hearts animation
    smallHearts.forEach((heart, i) => {
      const delay = i * 300;
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(heart.y, { toValue: -50, duration: 4000, useNativeDriver: true }),
            Animated.timing(heart.opacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
          ]),
          Animated.timing(heart.opacity, { toValue: 0, duration: 500, useNativeDriver: true }),
          Animated.timing(heart.y, { toValue: height, duration: 0, useNativeDriver: true }),
        ])
      ).start();
    });
  }, []);

  const bgColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#ffb6c1", "#ff4b6e"],
  });

  return (
    <Animated.View style={{ flex: 1 }}>
      <LinearGradient colors={["#ffe6eb", "#ffb6c1", "#ff4b6e"]} style={styles.gradient} />
      <Animated.View style={[styles.overlay, { backgroundColor: bgColor }]} />

      {/* Floating Hearts */}
      {smallHearts.map((heart, index) => (
        <Animated.Text
          key={index}
          style={[
            styles.floatingHeart,
            {
              opacity: heart.opacity,
              transform: [
                { translateX: heart.x },
                { translateY: heart.y },
                { scale: 0.8 + Math.random() * 0.4 },
              ],
            },
          ]}
        >
          💕
        </Animated.Text>
      ))}

      {/* Main Heart + App Text + Motto */}
      <View style={styles.center}>
        <Animated.Text style={[styles.logo, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          ❤️
        </Animated.Text>

        <Animated.Text style={[styles.text, { opacity: textFade, transform: [{ translateY: textSlide }] }]}>
          PerlMe
        </Animated.Text>

        <Animated.Text style={[styles.motto, { opacity: mottoFade, transform: [{ translateY: mottoSlide }] }]}>
          Where hearts find their rhythm.
        </Animated.Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  gradient: { ...StyleSheet.absoluteFillObject },
  overlay: { ...StyleSheet.absoluteFillObject, opacity: 0.3 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  logo: { fontSize: 90 },
  text: { fontSize: 28, fontWeight: "700", color: "#fff", marginTop: 20 },
  motto: {
    fontSize: 16,
    color: "#fff",
    marginTop: 10,
    opacity: 0.9,
    textShadowColor: "rgba(255,255,255,0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  floatingHeart: { position: "absolute", fontSize: 20 },
});
