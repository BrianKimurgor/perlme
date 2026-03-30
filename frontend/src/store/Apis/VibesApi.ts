import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQueryWithReauth";

// ---------- Vibe type constants ----------
export const VIBE_CATEGORIES = {
    Energy: ["SOCIAL_BUTTERFLY", "SOLO_ADVENTURER", "DEEP_DIVER"] as const,
    Reliability: ["INSTANT_MATCH", "SLOW_BURNER", "EVENING_STAR"] as const,
    "Date Style": ["CAFFEINE_CRITIC", "NIGHT_OWL", "ACTIVITY_JUNKIE"] as const,
    Humor: ["WITTY_ONE", "WHOLESOME", "MEME_DEALER"] as const,
} as const;

export type VibeType =
    | "SOCIAL_BUTTERFLY" | "SOLO_ADVENTURER" | "DEEP_DIVER"
    | "INSTANT_MATCH" | "SLOW_BURNER" | "EVENING_STAR"
    | "CAFFEINE_CRITIC" | "NIGHT_OWL" | "ACTIVITY_JUNKIE"
    | "WITTY_ONE" | "WHOLESOME" | "MEME_DEALER";

// Human-readable labels + icons for each vibe
export const VIBE_META: Record<VibeType, { label: string; icon: string; category: string }> = {
    SOCIAL_BUTTERFLY: { label: "Social Butterfly", icon: "🦋", category: "Energy" },
    SOLO_ADVENTURER: { label: "Solo Adventurer", icon: "🏔️", category: "Energy" },
    DEEP_DIVER: { label: "Deep Diver", icon: "🤿", category: "Energy" },
    INSTANT_MATCH: { label: "Instant Match", icon: "⚡", category: "Reliability" },
    SLOW_BURNER: { label: "Slow Burner", icon: "🕯️", category: "Reliability" },
    EVENING_STAR: { label: "Evening Star", icon: "🌙", category: "Reliability" },
    CAFFEINE_CRITIC: { label: "Caffeine Critic", icon: "☕", category: "Date Style" },
    NIGHT_OWL: { label: "Night Owl", icon: "🍹", category: "Date Style" },
    ACTIVITY_JUNKIE: { label: "Activity Junkie", icon: "🎾", category: "Date Style" },
    WITTY_ONE: { label: "Witty One", icon: "🎭", category: "Humor" },
    WHOLESOME: { label: "Wholesome", icon: "🌻", category: "Humor" },
    MEME_DEALER: { label: "Meme Dealer", icon: "📱", category: "Humor" },
};

// ---------- Response types ----------
export interface VibeCount {
    vibeType: VibeType;
    count: number;
}

export interface VibeData {
    topVibe: { vibeType: VibeType; count: number } | null;
    allCounts: VibeCount[];
    myVote: VibeType | null;
}

export interface PromptStatus {
    show: boolean;
}

// ---------- API ----------
export const vibesApi = createApi({
    reducerPath: "vibesApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Vibe"],
    endpoints: (builder) => ({

        // GET /api/vibes/:targetUserId — top vibe + all counts + my vote
        getVibes: builder.query<VibeData, string>({
            query: (targetUserId) => `vibes/${targetUserId}`,
            transformResponse: (res: any) => res.data,
            providesTags: (_r, _e, targetUserId) => [{ type: "Vibe", id: targetUserId }],
        }),

        // GET /api/vibes/:targetUserId/prompt — should the vibe card show?
        getVibePromptStatus: builder.query<PromptStatus, string>({
            query: (targetUserId) => `vibes/${targetUserId}/prompt`,
            transformResponse: (res: any) => res.data,
            providesTags: (_r, _e, targetUserId) => [{ type: "Vibe", id: `prompt-${targetUserId}` }],
        }),

        // POST /api/vibes/:targetUserId — cast a vibe
        castVibe: builder.mutation<{ changed: boolean }, { targetUserId: string; vibeType: VibeType }>({
            query: ({ targetUserId, vibeType }) => ({
                url: `vibes/${targetUserId}`,
                method: "POST",
                body: { vibeType },
            }),
            invalidatesTags: (_r, _e, { targetUserId }) => [
                { type: "Vibe", id: targetUserId },
                { type: "Vibe", id: `prompt-${targetUserId}` },
            ],
        }),
    }),
});

export const {
    useGetVibesQuery,
    useGetVibePromptStatusQuery,
    useCastVibeMutation,
} = vibesApi;
