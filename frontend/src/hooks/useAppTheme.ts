import { RootState } from "@/src/store";
import { useColorScheme } from "react-native";
import { useSelector } from "react-redux";

export interface AppColors {
    /** Main screen background */
    bg: string;
    /** Card / item surface */
    surface: string;
    /** Secondary surface (section bg, input bg) */
    surface2: string;
    /** Primary text */
    text: string;
    /** Secondary / muted text */
    subtext: string;
    /** Borders and dividers */
    border: string;
    /** Input field background */
    input: string;
    /** Pressed state highlight */
    pressed: string;
    /** Section label text */
    sectionLabel: string;
    /** Light tint of the accent colour (used for icon containers etc.) */
    accentTint: string;
}

function buildColors(isDark: boolean, accent: string): AppColors {
    return {
        bg: isDark ? "#111111" : "#fefefe",
        surface: isDark ? "#1e1e1e" : "#ffffff",
        surface2: isDark ? "#252525" : "#f9fafb",
        text: isDark ? "#f0f0f0" : "#111827",
        subtext: isDark ? "#aaaaaa" : "#6b7280",
        border: isDark ? "#2e2e2e" : "#e5e7eb",
        input: isDark ? "#2a2a2a" : "#f8f8f8",
        pressed: isDark ? "#2a2a2a" : "#ffe6eb",
        sectionLabel: isDark ? "#888888" : "#999999",
        accentTint: isDark ? "rgba(255,51,102,0.15)" : "#fff0f4",
    };
}

export function useAppTheme() {
    const mode = useSelector((state: RootState) => state.theme.mode);
    const accent = useSelector((state: RootState) => state.theme.accent);
    const systemScheme = useColorScheme();

    const isDark =
        mode === "dark" || (mode === "system" && systemScheme === "dark");

    return {
        isDark,
        accent,
        colors: buildColors(isDark, accent),
    };
}
