// app/theme.tsx
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { RootState } from "@/src/store";
import { setAccent, setMode } from "@/src/store/themeSlice";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

const accentColors = ["#ff3366", "#6a0dad", "#007aff", "#00c853", "#ff9100", "#9c27b0"];

const THEME_MODE_KEY = "@theme_mode";
const ACCENT_KEY = "@theme_accent";

export default function ThemeScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.mode);
  const { colors, accent, isDark } = useAppTheme();

  const handleModeChange = async (mode: "light" | "dark" | "system") => {
    dispatch(setMode(mode));
    await AsyncStorage.setItem(THEME_MODE_KEY, mode);
  };

  const handleAccentChange = async (color: string) => {
    dispatch(setAccent(color));
    await AsyncStorage.setItem(ACCENT_KEY, color);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 20 }}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={accent} />
          </Pressable>
          <Text style={styles.header}>Theme & Appearance</Text>
        </View>

        {/* Theme Mode */}
        <Text style={[styles.sectionTitle, { color: colors.sectionLabel }]}>Theme Mode</Text>
        {["light", "dark", "system"].map((modeOption) => (
          <Pressable
            key={modeOption}
            style={[
              styles.item,
              { backgroundColor: colors.surface },
              theme === modeOption && { borderColor: accent, borderWidth: 2 },
            ]}
            onPress={() => handleModeChange(modeOption as any)}
          >
            <Text style={[styles.itemText, { color: colors.text }]}>
              {modeOption.charAt(0).toUpperCase() + modeOption.slice(1)}
            </Text>
            {theme === modeOption && <Text style={{ color: accent }}>✓</Text>}
          </Pressable>
        ))}

        {/* Accent Colors */}
        <Text style={[styles.sectionTitle, { marginTop: 30, color: colors.sectionLabel }]}>Accent Color</Text>
        <View style={styles.colorContainer}>
          {accentColors.map((color) => (
            <Pressable
              key={color}
              style={[
                styles.colorCircle,
                { backgroundColor: color },
                accent === color && { borderWidth: 3, borderColor: isDark ? "#fff" : "#333" },
              ]}
              onPress={() => handleAccentChange(color)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 20, marginTop: 8 },
  backBtn: { marginRight: 12, padding: 4 },
  header: { fontSize: 24, fontWeight: "700", color: "#ff3366" },
  sectionTitle: { fontSize: 14, fontWeight: "600", color: "#999", marginBottom: 12 },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  itemText: { fontSize: 16 },
  colorContainer: { flexDirection: "row", flexWrap: "wrap", gap: 15 },
  colorCircle: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
});
